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
    Looks for rows starting with finding ID pattern (F###, T-AGE-###, etc.).
    """
    findings = []
    # Match table rows with finding IDs like F001, T-AGE-001, etc.
    row_pattern = re.compile(
        r"\|\s*([A-Z0-9\-]+)\s*\|\s*([^|]+)\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|",
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


def _extract_component_analysis_from_markdown(markdown: str) -> List[Dict[str, Any]]:
    """
    Extract Component-Specific Threat Analysis table from markdown.
    Returns list of component objects with structure:
    {
        "component": "API Gateway",
        "doc_source": "architecture.pdf: API Design",
        "verbatim_quote": "Gateway exposed on public internet",
        "critical_threats": "Unauthenticated access, DDoS, injection attacks",
        "risk_level": "CRITICAL",
        "mitigation_priority": "P0",
        "finding_refs": ["F001", "F003"]  # extracted from context
    }
    """
    components = []
    
    # Find the Component-Specific section
    comp_section = re.search(
        r"#\s*COMPONENT-SPECIFIC THREAT ANALYSIS(.*?)(?=\n#\s+[A-Z]|\Z)",
        markdown,
        re.DOTALL | re.IGNORECASE
    )
    
    if not comp_section:
        return components
    
    section_text = comp_section.group(1)
    
    # Match table rows (skip header and separator)
    # Table format: | Component | Document Evidence | Verbatim Quote | Critical Threats | Risk Level | Mitigation Priority |
    row_pattern = re.compile(
        r"\|\s*([^|\n]+?)\s*\|\s*([^|\n]+?)\s*\|\s*\"?([^|\n\"]+?)\"?\s*\|\s*([^|\n]+?)\s*\|\s*\*?\*?([A-Z]+)\*?\*?\s*\|\s*([^|\n]+?)\s*\|"
    )
    
    for match in row_pattern.finditer(section_text):
        component_name = match.group(1).strip()
        doc_source = match.group(2).strip()
        quote = match.group(3).strip()
        threats = match.group(4).strip()
        risk_level = match.group(5).strip()
        priority = match.group(6).strip()
        
        # Skip header rows
        if component_name.lower() in ["component", "---", ""]:
            continue
        
        # Extract finding references from surrounding context
        finding_refs = re.findall(r'\b(F\d{3})\b', threats + quote + priority)
            
        components.append({
            "component": component_name,
            "doc_source": doc_source,
            "verbatim_quote": quote,
            "critical_threats": threats,
            "risk_level": risk_level,
            "mitigation_priority": priority,
            "finding_refs": list(set(finding_refs))  # deduplicate
        })
    
    logger.info(f"📦 Extracted {len(components)} components from markdown")
    return components


def _extract_specialized_risks_from_markdown(markdown: str) -> List[Dict[str, Any]]:
    """
    Extract Specialized Risk Assessments sections from markdown.
    NEW FORMAT: Parses detailed tables with columns:
    Threat ID | Evidence Source | Verbatim Quote | Threat Description | Likelihood | Impact | Risk Score | Priority | Mitigation Strategy
    
    Returns list of specialized risk domains:
    {
        "domain": "Agentic AI Risk",
        "icon": "🤖",
        "findings": [
            {
                "label": "Prompt Injection Vulnerabilities",
                "value": "CRITICAL",
                "severity": "CRITICAL",
                "threat_id": "F001",
                "finding_ref": "F001"
            },
            ...
        ],
        "summary": "5 critical threats identified",
        "grade": "CRITICAL"
    }
    """
    specialized = []
    
    # Find the Specialized Risk section
    spec_section = re.search(
        r"#\s*SPECIALIZED RISK ASSESSMENTS(.*?)(?=\n#\s+COMPONENT-SPECIFIC|\n#\s+ATTACK SCENARIOS|\n#\s+[A-Z]|\Z)",
        markdown,
        re.DOTALL | re.IGNORECASE
    )
    
    if not spec_section:
        logger.warning("⚠️ SPECIALIZED RISK ASSESSMENTS section not found")
        return specialized
    
    section_text = spec_section.group(1)
    
    # Extract subsections (e.g., ## Agentic AI Risk, ## Cloud Infrastructure, etc.)
    subsection_pattern = re.compile(
        r"##\s+([^\n]+)\n(.*?)(?=\n##\s+|\Z)",
        re.DOTALL
    )
    
    for subsection_match in subsection_pattern.finditer(section_text):
        domain_title = subsection_match.group(1).strip()
        domain_content = subsection_match.group(2)
        
        # Skip empty sections
        if not domain_content.strip():
            continue
        
        findings = []
        highest_severity = "LOW"
        
        # NEW: Match the detailed 9-column table format
        # | Threat ID | Evidence Source | Verbatim Quote | Threat Description | Likelihood | Impact | Risk Score | Priority | Mitigation |
        detailed_row_pattern = re.compile(
            r"\|\s*([A-Z0-9\-]+)\s*\|\s*([^|]+?)\s*\|\s*\"([^\"]*)\"\s*\|\s*([^|]+?)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*([P\d]+)\s*\|\s*([^|]+?)\s*\|",
            re.MULTILINE
        )
        
        for match in detailed_row_pattern.finditer(domain_content):
            threat_id = match.group(1).strip()
            evidence_source = match.group(2).strip()
            quote = match.group(3).strip()
            description = match.group(4).strip()
            likelihood = int(match.group(5).strip())
            impact = int(match.group(6).strip())
            risk_score = int(match.group(7).strip())
            priority = match.group(8).strip()
            mitigation = match.group(9).strip()
            
            # Skip headers
            if threat_id.lower() in ["threat", "id", "---"]:
                continue
            
            # Determine severity from risk score
            if risk_score >= 20:
                severity = "CRITICAL"
            elif risk_score >= 12:
                severity = "HIGH"
            elif risk_score >= 6:
                severity = "MEDIUM"
            else:
                severity = "LOW"
            
            # Track highest severity for grade
            severity_order = {"CRITICAL": 4, "HIGH": 3, "MEDIUM": 2, "LOW": 1}
            if severity_order.get(severity, 0) > severity_order.get(highest_severity, 0):
                highest_severity = severity
            
            # Extract short label from description (first few words)
            label_words = description.split()[:6]
            label = " ".join(label_words)
            if len(description.split()) > 6:
                label += "..."
            
            findings.append({
                "label": label,
                "value": severity,
                "severity": severity,
                "threat_id": threat_id,
                "finding_ref": threat_id,
                "description": description,
                "evidence_source": evidence_source,
                "quote": quote,
                "likelihood": likelihood,
                "impact": impact,
                "risk_score": risk_score,
                "priority": priority,
                "mitigation": mitigation
            })
        
        # If no detailed table found, try old simple format
        if not findings:
            simple_row_pattern = re.compile(
                r"\|\s*([^|\n]+?)\s*\|\s*\*?\*?([A-Z]+)\*?\*?\s*\|"
            )
            
            for row_match in simple_row_pattern.finditer(domain_content):
                label = row_match.group(1).strip()
                severity = row_match.group(2).strip()
                
                # Skip headers
                if label.lower() in ["risk", "finding", "assessment", "---", ""]:
                    continue
                
                # Extract finding reference from label
                finding_match = re.search(r'\b(F\d{3})\b', label)
                
                findings.append({
                    "label": label,
                    "value": severity,
                    "severity": severity,
                    "finding_ref": finding_match.group(1) if finding_match else None
                })
                
                severity_order = {"CRITICAL": 4, "HIGH": 3, "MEDIUM": 2, "LOW": 1}
                if severity_order.get(severity, 0) > severity_order.get(highest_severity, 0):
                    highest_severity = severity
        
        if not findings:
            continue
        
        # Assign icon based on domain name
        icon = "🔒"
        if any(kw in domain_title.lower() for kw in ["ai", "ml", "model", "machine learning", "agentic", "agent"]):
            icon = "🤖"
        elif any(kw in domain_title.lower() for kw in ["cloud", "infrastructure", "aws", "azure"]):
            icon = "☁️"
        elif any(kw in domain_title.lower() for kw in ["data", "privacy", "pii"]):
            icon = "📊"
        elif any(kw in domain_title.lower() for kw in ["compliance", "regulatory"]):
            icon = "⚖️"
        elif any(kw in domain_title.lower() for kw in ["supply", "chain", "vendor"]):
            icon = "🔗"
        elif any(kw in domain_title.lower() for kw in ["crypto", "encryption"]):
            icon = "🔐"
        
        # Calculate grade based on findings severity
        grade = "LOW"
        if any(f["severity"] == "CRITICAL" for f in findings):
            grade = "CRITICAL"
        elif any(f["severity"] == "HIGH" for f in findings):
            grade = "HIGH"
        elif any(f["severity"] == "MEDIUM" for f in findings):
            grade = "MEDIUM"
        
        specialized.append({
            "domain": domain_title,
            "icon": icon,
            "findings": findings[:5],  # Limit to 5 key findings
            "summary": f"{len(findings)} findings",
            "grade": grade
        })
    
    logger.info(f"🎯 Extracted {len(specialized)} specialized risk domains from markdown")
    return specialized


def _extract_kill_chains_from_markdown(markdown: str) -> List[Dict[str, Any]]:
    """
    Extract Attack Scenarios & Kill Chains from markdown.
    Parses sections like:
    
    # ATTACK SCENARIOS & KILL CHAINS
    
    ## Scenario 1: [Title]
    **Profile:** ...
    **Overall Risk Score:** 20/25
    **Primary Evidence:** ...
    
    | Phase | Technique ID | Document Evidence | ... |
    
    Returns list of kill chain scenarios.
    """
    kill_chains = []
    
    # Find the Attack Scenarios section
    scenarios_section = re.search(
        r"#\s*ATTACK SCENARIOS[^\n]*KILL CHAINS(.*?)(?=\n#\s+COMPREHENSIVE RISK|\n#\s+[A-Z]|\Z)",
        markdown,
        re.DOTALL | re.IGNORECASE
    )
    
    if not scenarios_section:
        logger.warning("⚠️ ATTACK SCENARIOS & KILL CHAINS section not found")
        return kill_chains
    
    section_text = scenarios_section.group(1)
    
    # Extract individual scenarios (## Scenario 1, ## Scenario 2, etc.)
    scenario_pattern = re.compile(
        r"##\s+Scenario\s+\d+:\s+([^\n]+)\n(.*?)(?=\n##\s+Scenario|\Z)",
        re.DOTALL | re.IGNORECASE
    )
    
    for scenario_match in scenario_pattern.finditer(section_text):
        title = scenario_match.group(1).strip()
        scenario_content = scenario_match.group(2)
        
        # Extract metadata
        profile_match = re.search(r"\*\*Profile:\*\*\s*([^\n]+)", scenario_content)
        risk_score_match = re.search(r"\*\*Overall Risk Score:\*\*\s*(\d+)/25", scenario_content)
        evidence_match = re.search(r"\*\*Primary Evidence:\*\*\s*([^\n]+)", scenario_content)
        
        profile = profile_match.group(1).strip() if profile_match else ""
        risk_score = int(risk_score_match.group(1)) if risk_score_match else 15
        evidence = evidence_match.group(1).strip() if evidence_match else ""
        
        # Extract phases from table
        # | Phase | Technique ID | Document Evidence | Verbatim Quote | Description | Detection Window | Mitigation |
        phases = []
        phase_pattern = re.compile(
            r"\|\s*([^|]+?)\s*\|\s*([T\d.]+)\s*\|\s*([^|]*?)\s*\|\s*\"?([^\"]*?)\"?\s*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|",
            re.MULTILINE
        )
        
        for phase_match in phase_pattern.finditer(scenario_content):
            phase_name = phase_match.group(1).strip()
            technique_id = phase_match.group(2).strip()
            doc_evidence = phase_match.group(3).strip()
            quote = phase_match.group(4).strip()
            description = phase_match.group(5).strip()
            detection = phase_match.group(6).strip()
            mitigation = phase_match.group(7).strip()
            
            # Skip headers
            if phase_name.lower() in ["phase", "---"]:
                continue
            
            phases.append({
                "phase": phase_name,
                "technique_id": technique_id,
                "evidence_source": doc_evidence,
                "quote": quote,
                "description": description,
                "detection_window": detection,
                "mitigation": mitigation,
                "severity": "CRITICAL" if risk_score >= 20 else "HIGH" if risk_score >= 12 else "MEDIUM"
            })
        
        if phases:
            kill_chains.append({
                "title": title,
                "profile": profile,
                "risk_score": risk_score,
                "evidence": evidence,
                "phases": phases
            })
    
    logger.info(f"🎯 Extracted {len(kill_chains)} attack scenarios from markdown")
    return kill_chains


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
        
        # Extract component, specialized, and kill chain data from markdown even when JSON exists
        # (Claude returns these in markdown sections, not always in JSON)
        json_data.setdefault("component_analysis", _extract_component_analysis_from_markdown(markdown_body))
        json_data.setdefault("specialized_risks", _extract_specialized_risks_from_markdown(markdown_body))
        
        # Allow kill_chains override from markdown (more detailed than JSON)
        markdown_kill_chains = _extract_kill_chains_from_markdown(markdown_body)
        if markdown_kill_chains:
            json_data["kill_chains"] = markdown_kill_chains
        elif not json_data["kill_chains"]:
            json_data["kill_chains"] = markdown_kill_chains

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
    components = _extract_component_analysis_from_markdown(markdown_body)
    specialized_risks = _extract_specialized_risks_from_markdown(markdown_body)
    kill_chains = _extract_kill_chains_from_markdown(markdown_body)
    
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
        "component_analysis": components,
        "specialized_risks": specialized_risks,
        "kill_chains": kill_chains,
        "_parsed_via": "markdown_fallback",
    }

    logger.info(
        f"⚠️ Fallback extracted: {len(findings)} findings, {len(recommendations)} recs, "
        f"{len(components)} components, {len(specialized_risks)} specialized domains, {len(kill_chains)} scenarios"
    )
    # Inject executive summary at the beginning
    markdown_with_summary = inject_executive_summary(markdown_body, structured, project_name)
    return structured, markdown_with_summary
