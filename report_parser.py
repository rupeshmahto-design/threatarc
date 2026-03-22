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
    Handles tables with optional row number column.
    """
    findings = []
    
    # Match table rows - handles formats:
    # | F001 | Title | ... |  (Finding ID first)
    # | 1 | F001 | Title | ... |  (Row number, then Finding ID)
    # More flexible pattern to find F### anywhere in the row
    lines = markdown.split('\n')
    
    for line in lines:
        # Skip if not a table row or is a separator
        if '|' not in line or '---' in line:
            continue
        
        # Look for F### pattern in the line
        finding_match = re.search(r'(F\d{3,4})', line)
        if not finding_match:
            continue
        
        # Split into columns
        columns = [col.strip() for col in line.split('|')]
        # Filter out empty columns (from leading/trailing pipes)
        columns = [c for c in columns if c]
        
        if len(columns) < 3:  # Need at least ID, Title, Severity
            continue
        
        # Find which column has the Finding ID
        finding_id = finding_match.group(1)
        finding_idx = -1
        for i, col in enumerate(columns):
            if finding_id in col:
                finding_idx = i
                break
        
        if finding_idx == -1:
            continue
        
        # Extract fields based on position relative to Finding ID
        # Typical format: [Row#,] F001, Title, [Tactic,] Severity, Risk Score, Evidence, Impact, Action
        title = columns[finding_idx + 1] if len(columns) > finding_idx + 1 else f"Finding {finding_id}"
        
        # Look for severity in next 2-3 columns
        severity = "MEDIUM"
        for i in range(finding_idx + 2, min(finding_idx + 5, len(columns))):
            col_upper = columns[i].upper()
            if "CRITICAL" in col_upper or "CRIT" in col_upper:
                severity = "CRITICAL"
                break
            elif "HIGH" in col_upper:
                severity = "HIGH"
                break
            elif "MEDIUM" in col_upper or "MED" in col_upper:
                severity = "MEDIUM"
                break
            elif "LOW" in col_upper:
                severity = "LOW"
                break
        
        # Try to extract risk score
        risk_score = 9
        for i in range(finding_idx + 2, min(finding_idx + 6, len(columns))):
            try:
                # Look for numbers like "25/25" or just "9"
                score_match = re.search(r'(\d+)', columns[i])
                if score_match:
                    risk_score = int(score_match.group(1))
                    break
            except:
                pass
        
        # Extract additional fields if available
        evidence = ""
        business_impact = ""
        tactic = ""
        
        # Look for evidence/source column (usually after risk score)
        if len(columns) > finding_idx + 5:
            evidence = columns[finding_idx + 5]
        
        # Look for business impact
        if len(columns) > finding_idx + 6:
            business_impact = columns[finding_idx + 6]
        
        # Look for tactic (might be between title and severity)
        if len(columns) > finding_idx + 2:
            potential_tactic = columns[finding_idx + 2]
            # If it's not a severity word and not a number, might be tactic
            if not any(sev in potential_tactic.upper() for sev in ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']) and not re.match(r'^\d', potential_tactic):
                tactic = potential_tactic
        
        findings.append({
            "id": finding_id,
            "title": title,
            "description": title,
            "severity": severity,
            "likelihood": 3,
            "impact": 3,
            "risk_score": risk_score,
            "priority": "P0" if severity == "CRITICAL" else "P1" if severity == "HIGH" else "P2",
            "owner": "Security Team",
            "timeline": "30–90 days" if severity in ["CRITICAL", "HIGH"] else "90+ days",
            "tactic": tactic,
            "technique_id": "",
            "tactic_id": "",
            "doc_source": evidence,
            "verbatim_evidence": evidence,
            "business_impact": business_impact,
            "affected_systems": [],
            "mitigation_steps": [],
            "validation_method": "",
            "references": [],
        })
        logger.info(f"Extracted: {finding_id} - {title[:50] if len(title) > 50 else title} - {severity}")
    
    logger.info(f"Total extracted: {len(findings)} findings from markdown")
    return findings


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
        json_data.setdefault("attack_scenarios", [])
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
        "attack_scenarios": [],
        "_parsed_via": "markdown_fallback",
    }

    logger.info(
        f"⚠️ Fallback extracted: {len(findings)} findings, {len(recommendations)} recs"
    )
    return structured, markdown_body
