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
    # Remove ```json ... ``` block
    cleaned = re.sub(r"```json\s*[\s\S]*?```\s*", "", raw_response, flags=re.MULTILINE)
    return cleaned.strip()


def inject_executive_summary(markdown: str, structured_data: Dict[str, Any], project_name: str = "") -> str:
    """
    Inject an Executive Summary section at the beginning of the markdown report.
    This ensures the PDF will have a proper Executive Summary page.
    """
    overall = structured_data.get("overall_risk_rating", "HIGH")
    sev = structured_data.get("findings_by_severity", {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0})
    total = structured_data.get("total_findings", 0)
    frameworks = structured_data.get("frameworks_used", [])
    risk_areas = structured_data.get("risk_areas_assessed", [])
    
    critical = sev.get("CRITICAL", 0)
    high = sev.get("HIGH", 0)
    medium = sev.get("MEDIUM", 0)
    low = sev.get("LOW", 0)
    
    # Calculate risk percentage
    total_risk = critical * 25 + high * 15 + medium * 8 + low * 3
    max_possible = total * 25 if total > 0 else 1
    risk_pct = round((total_risk / max_possible) * 100) if max_possible > 0 else 0
    
    # Get top findings
    top_findings = structured_data.get("all_findings", [])[:5]
    
    # Build executive summary markdown
    exec_summary = f"""# Executive Summary

## Overall Risk Assessment: **{overall}**

**Project:** {project_name}  
**Risk Score:** {risk_pct}%  
**Total Findings:** {total}  
**Frameworks:** {', '.join(frameworks) if frameworks else 'MITRE ATT&CK'}

### Finding Distribution

| Severity | Count | Percentage |
|----------|-------|------------|
| **CRITICAL** | {critical} | {round(critical/total*100) if total > 0 else 0}% |
| **HIGH** | {high} | {round(high/total*100) if total > 0 else 0}% |
| **MEDIUM** | {medium} | {round(medium/total*100) if total > 0 else 0}% |
| **LOW** | {low} | {round(low/total*100) if total > 0 else 0}% |

### Risk Assessment

"""
    
    if overall == "CRITICAL":
        exec_summary += "**⚠️ IMMEDIATE EXECUTIVE ACTION REQUIRED**\n\n"
        exec_summary += "Critical vulnerabilities present significant business risk requiring immediate attention. This assessment identifies serious security gaps that could lead to major incidents.\n\n"
    elif overall == "HIGH":
        exec_summary += "**⚠️ URGENT ACTION REQUIRED**\n\n"
        exec_summary += "Significant vulnerabilities require urgent attention within 30 days. Multiple high-risk findings demand prioritized remediation.\n\n"
    else:
        exec_summary += "Moderate risk identified. Address findings per the recommended timeline to maintain security posture.\n\n"
    
    # Add top findings
    if top_findings:
        exec_summary += "### Top Priority Findings\n\n"
        exec_summary += "| ID | Title | Severity | Risk Score |\n"
        exec_summary += "|-----|-------|----------|------------|\n"
        for f in top_findings:
            fid = f.get("id", "F???")
            title = f.get("title", "Untitled")[:60]
            severity = f.get("severity", "MEDIUM")
            risk_score = f.get("risk_score", 9)
            exec_summary += f"| {fid} | {title} | **{severity}** | {risk_score}/25 |\n"
        exec_summary += "\n"
    
    # Add immediate actions
    p0_recs = [r for r in structured_data.get("all_recommendations", []) if r.get("priority") == "P0"][:3]
    if p0_recs:
        exec_summary += "### Immediate Actions (0-30 Days)\n\n"
        for i, rec in enumerate(p0_recs, 1):
            title = rec.get("title", "Untitled")
            risk_reduction = rec.get("risk_reduction_pct", 0)
            effort = rec.get("effort_weeks", 0)
            exec_summary += f"{i}. **{title}**\n"
            if risk_reduction:
                exec_summary += f"   - Risk Reduction: {risk_reduction}%\n"
            if effort:
                exec_summary += f"   - Effort: {effort} weeks\n"
            exec_summary += "\n"
    
    # Add scope info
    if risk_areas:
        exec_summary += f"### Assessment Scope\n\n"
        exec_summary += f"**Risk Areas Assessed:** {', '.join(risk_areas[:5])}\n"
        if frameworks:
            exec_summary += f"**Frameworks Used:** {', '.join(frameworks)}\n"
        exec_summary += "\n"
    
    exec_summary += "---\n\n"
    
    # Inject at the beginning of the report
    return exec_summary + markdown


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
    Looks for rows starting with F### pattern.
    """
    findings = []
    # Match table rows with finding IDs like F001, F002, etc.
    row_pattern = re.compile(
        r"\|\s*(F\d{3})\s*\|\s*([^|]+)\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|",
    )
    for match in row_pattern.finditer(markdown):
        fid = match.group(1).strip()
        title = match.group(2).strip()
        sev_raw = match.group(5).strip().upper()
        sev = "CRITICAL" if "CRITICAL" in sev_raw else "HIGH" if "HIGH" in sev_raw else "MEDIUM" if "MEDIUM" in sev_raw else "LOW"
        findings.append({
            "id": fid,
            "title": title,
            "severity": sev,
            "likelihood": 3,
            "impact": 3,
            "risk_score": 9,
            "priority": "P0" if sev == "CRITICAL" else "P1" if sev == "HIGH" else "P2",
            "owner": "Security Team",
            "timeline": "30–90 days",
            "tactic": "",
            "technique_id": "",
            "doc_source": "",
            "verbatim_evidence": "",
            "business_impact": "",
            "mitigation_steps": [],
        })
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
            f.setdefault("mitigation_steps", [])

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
        # Inject executive summary at the beginning
        markdown_with_summary = inject_executive_summary(markdown_body, json_data, project_name)
        return json_data, markdown_with_summary

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
    # Inject executive summary at the beginning
    markdown_with_summary = inject_executive_summary(markdown_body, structured, project_name)
    return structured, markdown_with_summary
