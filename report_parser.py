"""
Report Parser — Extracts structured JSON from Claude threat assessment responses.

Claude is prompted to output a JSON metadata block at the top of the response,
followed by the full markdown report. This module extracts and validates that block,
falling back to regex-based extraction from markdown if the JSON block is absent
(e.g. older prompt version responses already stored in the database).
"""

import json
import re
import logging
from typing import Optional, Dict, Any, List, Tuple

logger = logging.getLogger(__name__)


# ─── JSON BLOCK EXTRACTION ─────────────────────────────────────────────────────

def extract_json_block(raw_response: str) -> Optional[Dict[str, Any]]:
    """
    Extract the JSON metadata block from Claude's response.
    The new prompt asks Claude to output ```json ... ``` before the markdown report.
    """
    # Try ```json ... ``` fenced block
    pattern = r"```json\s*([\s\S]*?)```"
    matches = re.findall(pattern, raw_response, re.MULTILINE)

    for match in matches:
        try:
            data = json.loads(match.strip())
            # Validate it's the expected structure (not just any JSON block)
            if "all_findings" in data or "overall_risk_rating" in data:
                logger.info(f"✅ JSON block extracted: {len(data.get('all_findings', []))} findings")
                return data
        except json.JSONDecodeError:
            continue

    # Try without fences — sometimes Claude omits them
    try:
        # Find first { ... } block that spans multiple lines
        brace_match = re.search(r"^\s*\{[\s\S]+?\n\}", raw_response, re.MULTILINE)
        if brace_match:
            data = json.loads(brace_match.group(0))
            if "all_findings" in data or "overall_risk_rating" in data:
                logger.info("✅ JSON block extracted (no fences)")
                return data
    except (json.JSONDecodeError, AttributeError):
        pass

    logger.warning("⚠️ No JSON block found in response — will use markdown fallback")
    return None


def extract_markdown_body(raw_response: str) -> str:
    """
    Strip the JSON block from the response, returning only the markdown report body.
    """
    # Remove ```json ... ``` block (greedy match to get the whole block)
    cleaned = re.sub(r"```json\s*[\s\S]*?```\s*", "", raw_response, flags=re.MULTILINE)
    
    # Also remove any standalone { ... } JSON objects at the start
    cleaned = re.sub(r"^\s*\{[\s\S]*?\n\}\s*", "", cleaned, flags=re.MULTILINE)
    
    return cleaned.strip()


# ─── MARKDOWN FALLBACK EXTRACTION ─────────────────────────────────────────────

def _extract_severity_from_markdown(markdown: str) -> Dict[str, int]:
    """Count severity occurrences in markdown as fallback."""
    upper = markdown.upper()
    return {
        "CRITICAL": upper.count("**CRITICAL**") + upper.count("CRITICAL"),
        "HIGH": upper.count("**HIGH**") + upper.count("HIGH"),
        "MEDIUM": upper.count("**MEDIUM**") + upper.count("MEDIUM"),
        "LOW": upper.count("**LOW**") + upper.count("LOW"),
    }


def _extract_findings_from_markdown(markdown: str) -> List[Dict[str, Any]]:
    """
    Fallback: extract findings from markdown tables.
    Robustly handles multiple table formats by finding F### IDs anywhere in the table.
    """
    findings = []
    
    try:
        # Split into lines and find table rows containing F001, F002, etc.
        lines = markdown.split('\n')
        header_columns = []
        
        for i, line in enumerate(lines):
            # Try to identify header row first (case-insensitive)
            if '|' in line and i < len(lines) - 1:
                lower_line = line.lower()
                if any(keyword in lower_line for keyword in ['finding', 'title', 'severity', 'risk']):
                    # This might be a header row
                    header_columns = [col.strip().lower() for col in line.split('|')]
                    logger.info(f"Found table header: {header_columns}")
            
            # Look for finding rows (contains F followed by digits)
            if '|' in line and re.search(r'F\d{2,4}', line):
                # Skip separator lines like |---|---|---|
                if re.match(r'^\s*\|[\s\-:]+\|\s*$', line) or line.count('-') > 3:
                    continue
                
                try:
                    columns = [col.strip() for col in line.split('|')]
                    
                    # Find which column has the Finding ID
                    finding_id = None
                    finding_id_idx = -1
                    for idx, col in enumerate(columns):
                        match = re.match(r'(F\d{2,4})', col)
                        if match:
                            finding_id = match.group(1)
                            finding_id_idx = idx
                            break
                    
                    if not finding_id:
                        continue
                    
                    # Extract other fields - try to be smart about column positions
                    title = ""
                    severity = "MEDIUM"
                    risk_score = 9
                    evidence_source = ""
                    business_impact = ""
                    action_required = ""
                    
                    # Try to use headers if we found them
                    if header_columns:
                        for idx, col in enumerate(columns):
                            if idx < len(header_columns):
                                header = header_columns[idx]
                                col_value = col.strip()
                                
                                if 'title' in header or 'description' in header:
                                    title = col_value
                                elif 'severity' in header or 'risk level' in header:
                                    severity = _extract_severity_from_text(col_value)
                                elif 'risk score' in header or 'score' in header:
                                    try:
                                        # Handle formats like "25/25" or "9"
                                        risk_score = int(re.search(r'\d+', col_value).group())
                                    except:
                                        pass
                                elif 'evidence' in header or 'source' in header:
                                    evidence_source = col_value
                                elif 'business' in header or 'impact' in header:
                                    business_impact = col_value
                                elif 'action' in header or 'mitigation' in header or 'remediation' in header:
                                    action_required = col_value
                    else:
                        # No headers - use positional logic based on common formats
                        # Common: | # | ID | Title | Severity | Risk Score | Evidence | Impact | Action |
                        # or:     | ID | Title | Severity | Risk Score | Evidence | Impact | Action |
                        if finding_id_idx >= 0 and len(columns) > finding_id_idx:
                            # Title is typically after Finding ID
                            if len(columns) > finding_id_idx + 1:
                                title = columns[finding_id_idx + 1]
                            
                            # Severity is typically 1-2 columns after title
                            if len(columns) > finding_id_idx + 2:
                                potential_sev = columns[finding_id_idx + 2]
                                severity = _extract_severity_from_text(potential_sev)
                            
                            # Risk score might be next
                            if len(columns) > finding_id_idx + 3:
                                try:
                                    risk_score_text = columns[finding_id_idx + 3]
                                    risk_score = int(re.search(r'\d+', risk_score_text).group())
                                except:
                                    pass
                            
                            # Remaining columns for evidence, impact, action
                            if len(columns) > finding_id_idx + 4:
                                evidence_source = columns[finding_id_idx + 4]
                            if len(columns) > finding_id_idx + 5:
                                business_impact = columns[finding_id_idx + 5]
                            if len(columns) > finding_id_idx + 6:
                                action_required = columns[finding_id_idx + 6]
                    
                    # Calculate likelihood and impact from risk score
                    #risk_score (1-25): convert to likelihood * impact
                    if risk_score >= 20:
                        likelihood, impact = 5, 5
                    elif risk_score >= 15:
                        likelihood, impact = 4, 4
                    elif risk_score >= 9:
                        likelihood, impact = 3, 3
                    elif risk_score >= 4:
                        likelihood, impact = 2, 2
                    else:
                        likelihood, impact = 1, 1
                    
                    finding = {
                        "id": finding_id,
                        "title": title or f"Finding {finding_id}",
                        "description": title or business_impact or f"Security finding {finding_id}",
                        "severity": severity,
                        "likelihood": likelihood,
                        "impact": impact,
                        "risk_score": risk_score,
                        "priority": "P0" if severity == "CRITICAL" else "P1" if severity == "HIGH" else "P2",
                        "owner": "Security Team",
                        "timeline": "30–90 days" if severity in ["CRITICAL", "HIGH"] else "90+ days",
                        "tactic": "",
                        "technique_id": "",
                        "tactic_id": "",
                        "doc_source": evidence_source,
                        "verbatim_evidence": evidence_source,
                        "business_impact": business_impact,
                        "affected_systems": [],
                        "mitigation_steps": [action_required] if action_required else [],
                        "validation_method": "",
                        "references": [],
                    }
                    findings.append(finding)
                    logger.info(f"Extracted finding: {finding_id} - {title[:50] if title else finding_id}")
                    
                except Exception as row_error:
                    logger.warning(f"Error parsing table row: {row_error}")
                    continue
        
        logger.info(f"Extracted {len(findings)} findings from markdown tables")
        
    except Exception as e:
        logger.error(f"Error in _extract_findings_from_markdown: {e}", exc_info=True)
    
    return findings


def _extract_severity_from_text(text: str) -> str:
    """Extract severity level from text."""
    text_upper = text.upper()
    if "CRITICAL" in text_upper or "CRIT" in text_upper:
        return "CRITICAL"
    elif "HIGH" in text_upper:
        return "HIGH"
    elif "MEDIUM" in text_upper or "MED" in text_upper:
        return "MEDIUM"
    elif "LOW" in text_upper:
        return "LOW"
    return "MEDIUM"


def _extract_recommendations_from_markdown(markdown: str) -> List[Dict[str, Any]]:
    """Fallback: extract recommendations from markdown tables."""
    recs = []
    row_pattern = re.compile(
        r"\|\s*(R\d{3})\s*\|\s*([^|]+)\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|"
    )
    for match in row_pattern.finditer(markdown):
        rid = match.group(1).strip()
        title = match.group(2).strip()
        recs.append({
            "id": rid,
            "title": title,
            "priority": "P0",
            "addresses_findings": [],
            "risk_reduction_pct": 60,
            "effort_weeks": 4,
            "owner": "Security Team",
            "target_date": "",
            "steps": [],
        })
    return recs


def _infer_overall_rating(findings: List[Dict]) -> str:
    """Infer overall rating from findings list."""
    if any(f.get("severity") == "CRITICAL" for f in findings):
        return "CRITICAL"
    if any(f.get("severity") == "HIGH" for f in findings):
        return "HIGH"
    if any(f.get("severity") == "MEDIUM" for f in findings):
        return "MEDIUM"
    return "LOW"


# ─── MAIN PARSE FUNCTION ──────────────────────────────────────────────────────

def parse_assessment_response(
    raw_response: str,
    project_name: str = "",
    frameworks: Optional[List[str]] = None,
    risk_areas: Optional[List[str]] = None,
) -> Tuple[Dict[str, Any], str]:
    """
    Parse Claude's raw response into structured data + clean markdown.

    Returns:
        (structured_data dict, markdown_body string)

    The structured_data dict is suitable for:
    - Storing in ThreatAssessment.report_meta
    - Feeding into interactive_report_generator.generate_html()
    - API responses to the frontend
    """
    # 1. Try to get JSON block
    json_data = extract_json_block(raw_response)
    markdown_body = extract_markdown_body(raw_response)

    if json_data:
        # Ensure required keys exist with sensible defaults
        json_data.setdefault("overall_risk_rating", "HIGH")
        json_data.setdefault("total_findings", len(json_data.get("all_findings", [])))
        json_data.setdefault("all_findings", [])
        json_data.setdefault("all_recommendations", [])
        json_data.setdefault("kill_chains", [])
        json_data.setdefault("frameworks_used", frameworks or [])
        json_data.setdefault("risk_areas_assessed", risk_areas or [])
        json_data.setdefault("project_name", project_name)

        # Ensure findings_by_severity is computed
        if "findings_by_severity" not in json_data:
            sev_counts = {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0}
            for f in json_data["all_findings"]:
                sev = f.get("severity", "MEDIUM").upper()
                sev_counts[sev] = sev_counts.get(sev, 0) + 1
            json_data["findings_by_severity"] = sev_counts

        # Normalize each finding to guarantee required fields
        for f in json_data["all_findings"]:
            f.setdefault("id", "F???")
            f.setdefault("title", "Untitled Finding")
            f.setdefault("description", f.get("title", "No description available"))  # Add description fallback
            f.setdefault("tactic", "")
            f.setdefault("technique_id", "")
            f.setdefault("tactic_id", "")
            f.setdefault("severity", "MEDIUM")
            f.setdefault("likelihood", 3)
            f.setdefault("impact", 3)
            f.setdefault("risk_score", f["likelihood"] * f["impact"])
            f.setdefault("priority", "P1")
            f.setdefault("owner", "Security Team")
            f.setdefault("timeline", "30–90 days")
            f.setdefault("doc_source", "")
            f.setdefault("verbatim_evidence", "")
            f.setdefault("business_impact", "")
            f.setdefault("affected_systems", [])
            f.setdefault("mitigation_steps", [])
            f.setdefault("validation_method", "")
            f.setdefault("references", [])

        # Normalize each recommendation
        for r in json_data["all_recommendations"]:
            r.setdefault("id", "R???")
            r.setdefault("title", "Untitled Recommendation")
            r.setdefault("priority", "P1")
            r.setdefault("addresses_findings", [])
            r.setdefault("risk_reduction_pct", 50)
            r.setdefault("effort_weeks", 4)
            r.setdefault("owner", "Security Team")
            r.setdefault("target_date", "")
            r.setdefault("steps", [])

        logger.info(
            f"✅ Parsed: {json_data['total_findings']} findings, "
            f"{len(json_data['all_recommendations'])} recommendations, "
            f"rating={json_data['overall_risk_rating']}"
        )
        return json_data, markdown_body

    # 2. Fallback: extract from markdown
    logger.warning("⚠️ Using markdown fallback extraction")
    findings = _extract_findings_from_markdown(markdown_body)
    recommendations = _extract_recommendations_from_markdown(markdown_body)
    sev_counts = {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0}
    for f in findings:
        sev_counts[f.get("severity", "MEDIUM")] = sev_counts.get(f.get("severity", "MEDIUM"), 0) + 1

    structured = {
        "overall_risk_rating": _infer_overall_rating(findings) if findings else "HIGH",
        "total_findings": len(findings),
        "findings_by_severity": sev_counts,
        "top_5_finding_ids": [f["id"] for f in findings[:5]],
        "project_name": project_name,
        "frameworks_used": frameworks or [],
        "risk_areas_assessed": risk_areas or [],
        "all_findings": findings,
        "all_recommendations": recommendations,
        "kill_chains": [],
        "_parsed_via": "markdown_fallback",
    }

    logger.info(
        f"⚠️ Fallback extracted: {len(findings)} findings, {len(recommendations)} recs"
    )
    return structured, markdown_body
