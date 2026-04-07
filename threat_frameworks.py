"""
Threat Modeling Frameworks and Risk Assessment Definitions
Improved prompt architecture - v2.0

Key improvements over v1:
- Chain-of-thought reasoning phase BEFORE output (finds threats v1 missed)
- Explicit likelihood/impact rubrics (no guessing — tied to real business cost)
- Structured JSON metadata block for interactive report + React frontend
- Verbatim quote requirement (enforces real evidence, not fabricated references)
- ATT&CK technique ID mapping (T####.### + tactic ID TA####)
- Output format feeds BOTH PDF renderer and interactive HTML from one call
- All 6 frameworks fully defined with coverage areas
"""

FRAMEWORKS = {
    "MITRE ATT&CK": {
        "description": "Comprehensive framework for understanding cyber adversary behavior",
        "focus": "Tactics, Techniques, and Procedures (TTPs)",
        "best_for": "Advanced threat modeling, APT analysis, comprehensive security assessments",
        "coverage": [
            "TA0001 - Initial Access", "TA0002 - Execution", "TA0003 - Persistence",
            "TA0004 - Privilege Escalation", "TA0005 - Defense Evasion",
            "TA0006 - Credential Access", "TA0007 - Discovery",
            "TA0008 - Lateral Movement", "TA0009 - Collection",
            "TA0010 - Command and Control", "TA0011 - Exfiltration", "TA0012 - Impact"
        ],
        "technique_prefix": "T",
        "tactic_ids": ["TA0001","TA0002","TA0003","TA0004","TA0005","TA0006",
                       "TA0007","TA0008","TA0009","TA0010","TA0011","TA0012"]
    },
    "STRIDE": {
        "description": "Microsoft's threat modeling methodology for software and APIs",
        "focus": "Six threat categories covering all application security dimensions",
        "best_for": "Software development, API security, application threat modeling",
        "coverage": [
            "S - Spoofing Identity",
            "T - Tampering with Data",
            "R - Repudiation",
            "I - Information Disclosure",
            "D - Denial of Service",
            "E - Elevation of Privilege"
        ]
    },
    "PASTA": {
        "description": "Process for Attack Simulation and Threat Analysis",
        "focus": "Risk-centric approach with seven structured stages",
        "best_for": "Risk-based threat modeling, business-aligned security assessments",
        "coverage": [
            "Stage I - Define Objectives",
            "Stage II - Define Technical Scope",
            "Stage III - Application Decomposition",
            "Stage IV - Threat Analysis",
            "Stage V - Vulnerability Analysis",
            "Stage VI - Attack Modeling",
            "Stage VII - Risk & Impact Analysis"
        ]
    },
    "OCTAVE": {
        "description": "Operationally Critical Threat, Asset, and Vulnerability Evaluation",
        "focus": "Organizational risk and asset-based assessment",
        "best_for": "Enterprise risk management, asset-based threat modeling",
        "coverage": [
            "Phase 1 - Build Asset-Based Threat Profiles",
            "Phase 2 - Identify Infrastructure Vulnerabilities",
            "Phase 3 - Develop Security Strategy and Plans"
        ]
    },
    "VAST": {
        "description": "Visual, Agile, and Simple Threat modeling",
        "focus": "Scalable threat modeling for agile and DevSecOps environments",
        "best_for": "DevSecOps, continuous threat modeling, large-scale organizations",
        "coverage": [
            "Application Threat Models",
            "Operational Threat Models",
            "Infrastructure Models"
        ]
    },
    "Custom Client Framework": {
        "description": "Your organization's proprietary security assessment framework",
        "focus": "Tailored controls and risk categories specific to your industry",
        "best_for": "Organization-specific compliance, industry regulations, custom security requirements",
        "coverage": [
            "Custom Domain 1", "Custom Domain 2", "Custom Domain 3", "Industry-Specific Controls"
        ]
    }
}

# ── Likelihood rubric ──────────────────────────────────────────────────────────
# Explicit criteria prevent Claude from guessing scores intuitively.
# Every score must map to one of these definitions.
LIKELIHOOD_RUBRIC = {
    5: "Almost Certain — Exploit is public knowledge, trivial to execute, no mitigations in place",
    4: "Likely — Exploit exists in the wild, attacker needs moderate skill, partial mitigations only",
    3: "Possible — Exploit is feasible, requires skilled attacker, some mitigations present",
    2: "Unlikely — Exploit is complex, requires advanced attacker capability, good mitigations",
    1: "Rare — Extremely difficult to exploit, nation-state level skill required, strong controls"
}

# ── Impact rubric ──────────────────────────────────────────────────────────────
# Tied to real business consequences — not abstract severity labels.
IMPACT_RUBRIC = {
    5: "Catastrophic — Business shutdown, >$10M loss, criminal liability, regulatory action",
    4: "Major — Critical system failure, $1M–$10M loss, significant regulatory fines",
    3: "Moderate — Service degradation, $100K–$1M loss, compliance violations",
    2: "Minor — Limited impact, <$100K loss, operational disruption only",
    1: "Negligible — No business impact, cosmetic or theoretical issue only"
}

# ── Risk Focus Areas ───────────────────────────────────────────────────────────
RISK_AREAS = {
    "Agentic AI Risk": {
        "description": "Risks from autonomous AI agents and agentic systems",
        "threats": [
            "Prompt injection and jailbreaking of agent instructions",
            "Unauthorized actions by autonomous agents exceeding intended scope",
            "Model hallucinations leading to incorrect autonomous decisions",
            "Data poisoning and training data manipulation attacks",
            "Agent-to-agent communication security and trust chain failures",
            "Privilege escalation by AI agents beyond authorized boundaries",
            "Loss of human oversight and meaningful human control",
            "Emergent agent behaviors not anticipated in system design",
            "Cascading failures in multi-agent orchestration systems"
        ]
    },
    "Model Risk": {
        "description": "Risks associated with AI/ML model deployment and operations",
        "threats": [
            "Model drift and silent performance degradation over time",
            "Adversarial attacks exploiting model decision boundaries",
            "Model inversion attacks exposing training data",
            "Model extraction enabling competitive theft of IP",
            "Bias and fairness failures causing discriminatory outcomes",
            "Model supply chain attacks via poisoned pre-trained weights",
            "Insufficient model validation before production deployment",
            "Model versioning failures and unsafe rollback procedures"
        ]
    },
    "Data Security Risk": {
        "description": "Risks to data confidentiality, integrity, and availability",
        "threats": [
            "Data breaches and unauthorized exfiltration",
            "Sensitive data exposure through insecure APIs or endpoints",
            "Data tampering affecting integrity of business-critical records",
            "Encryption gaps at rest, in transit, or in use",
            "Data residency violations across jurisdictions",
            "PII exposure and re-identification from aggregated data",
            "Insufficient data retention and disposal controls"
        ]
    },
    "Infrastructure Risk": {
        "description": "Risks in underlying technology infrastructure",
        "threats": [
            "Cloud service misconfigurations exposing internal resources",
            "Network segmentation failures enabling lateral movement",
            "Container escape and orchestration platform vulnerabilities",
            "API security weaknesses enabling abuse and data extraction",
            "Insufficient monitoring creating attacker blind spots",
            "DDoS vulnerabilities disrupting service availability",
            "Third-party integration risks propagating compromise"
        ]
    },
    "Compliance Risk": {
        "description": "Regulatory and compliance-related risks",
        "threats": [
            "GDPR violations and inadequate data subject rights management",
            "PCI-DSS scope expansion and cardholder data exposure",
            "HIPAA violations with PHI mishandling",
            "SOX control failures affecting financial reporting integrity",
            "Industry-specific regulatory gaps",
            "Insufficient audit trail for regulatory evidence",
            "Data sovereignty issues with cross-border data transfers"
        ]
    },
    "Privacy Risk": {
        "description": "Risks to personal data protection and privacy rights",
        "threats": [
            "PII exposure and re-identification from aggregated datasets",
            "Inadequate consent management and preference enforcement",
            "Data subject rights violations — erasure, portability, access",
            "Cross-border data transfer without adequate safeguards",
            "Privacy by design failures in system architecture",
            "Third-party data sharing without adequate controls",
            "Privacy policy non-compliance and misleading representations"
        ]
    },
    "Supply Chain Risk": {
        "description": "Risks in software supply chain and third-party dependencies",
        "threats": [
            "Compromised open-source dependencies and libraries",
            "Malicious packages and backdoored components",
            "Vulnerable third-party components with unpatched CVEs",
            "Insufficient vendor security due diligence",
            "Dependency confusion and namespace hijacking attacks",
            "Build pipeline integrity and artifact signing gaps",
            "Third-party service provider breach propagating to your system"
        ]
    },
    "Identity & Access Risk": {
        "description": "Risks related to authentication, authorization, and identity management",
        "threats": [
            "Weak authentication enabling credential-based attacks",
            "Broken access controls with IDOR and privilege escalation",
            "Identity federation weaknesses in SSO, SAML, and OAuth flows",
            "Session management flaws enabling session hijacking",
            "Credential theft, stuffing, and brute force attacks",
            "Insufficient MFA coverage on sensitive operations",
            "RBAC and ABAC design gaps granting excessive permissions"
        ]
    }
}


# ── Helper functions ───────────────────────────────────────────────────────────

def build_likelihood_rubric_str() -> str:
    return "\n".join([f"  {k}/5 = {v}" for k, v in LIKELIHOOD_RUBRIC.items()])


def build_impact_rubric_str() -> str:
    return "\n".join([f"  {k}/5 = {v}" for k, v in IMPACT_RUBRIC.items()])


def build_framework_coverage(frameworks: list) -> str:
    lines = []
    for fw in frameworks:
        f = FRAMEWORKS.get(fw, {})
        lines.append(f"**{fw}**")
        lines.append(f"  Description: {f.get('description', '')}")
        lines.append(f"  Focus: {f.get('focus', '')}")
        lines.append(f"  Coverage areas: {', '.join(f.get('coverage', []))}")
        if fw == "MITRE ATT&CK":
            lines.append(
                "  IMPORTANT: Map every threat to the specific ATT&CK Technique ID "
                "(e.g. T1566.001) and Tactic ID (e.g. TA0001). "
                "Reference: https://attack.mitre.org/"
            )
        lines.append("")
    return "\n".join(lines)


def build_risk_areas_sections(risk_areas: list) -> str:
    sections = []
    for area in risk_areas:
        ra = RISK_AREAS.get(area, {})
        threat_list = "\n".join([f"    - {t}" for t in ra.get("threats", [])])
        area_prefix = area[:3].upper()
        sections.append(f"""## {area}

**Domain Description:** {ra.get('description', '')}

**Known threat patterns for this domain:**
{threat_list}

**Analysis instructions for {area}:**
- Review ALL uploaded documents for any mentions, design decisions, or gaps relating to this domain
- For each threat found, provide the VERBATIM quote from the document as evidence
- Score likelihood and impact using the rubrics provided above — do not estimate
- If no threats are found, state explicitly: "No threats identified in uploaded documentation for this domain" and explain why

**Summary:** [1-2 sentences describing the {area} risk landscape based on evidence in the uploaded documents]

| Threat ID | Evidence Source (Doc + Section) | Verbatim Quote from Doc | Threat Description | Likelihood (1-5) | Impact (1-5) | Risk Score | Priority | Mitigation Strategy |
|-----------|---------------------------------|-------------------------|--------------------|------------------|--------------|------------|----------|---------------------|
| T-{area_prefix}-001 | [Document name: Section] | "[exact quote from document]" | [specific threat] | [score] | [score] | [L×I] | P0/P1/P2 | [specific action] |

""")
    return "\n".join(sections)


def build_comprehensive_prompt(
    project_info: dict,
    documents_content: str,
    frameworks: list,
    risk_areas: list,
    assessment_date: str
) -> str:
    """
    Build the comprehensive threat assessment prompt — v2.0

    Produces a hybrid output:
    - JSON metadata block at the top (parsed by report_parser.py → feeds interactive report)
    - Full markdown report body (parsed by pdf_generator.py → feeds PDF export)

    Both outputs come from a single Claude API call.
    """

    frameworks_str = " + ".join(frameworks) if len(frameworks) > 1 else frameworks[0]
    framework_coverage = build_framework_coverage(frameworks)
    risk_areas_sections = build_risk_areas_sections(risk_areas)
    likelihood_rubric = build_likelihood_rubric_str()
    impact_rubric = build_impact_rubric_str()

    compliance_reqs = ", ".join(project_info.get("compliance", [])) or "None specified"
    compliance_rows = "\n".join([
        f"| [F-ID] | [finding] | {req} | [specific gap] | [evidence required] | [timeline] |"
        for req in project_info.get("compliance", [])
    ]) or "| — | No compliance requirements specified | — | — | — | — |"

    framework_refs = "\n".join([
        f"- **{fw}** - {FRAMEWORKS[fw]['description']}" for fw in frameworks
        if fw in FRAMEWORKS
    ])
    compliance_refs = "\n".join([
        f"- **{req}** - Regulatory compliance requirement"
        for req in project_info.get("compliance", [])
    ]) or "- No compliance frameworks specified"

    prompt = f"""You are a senior cybersecurity consultant with 20 years of experience in threat modeling, penetration testing, and security architecture. You are performing a formal threat assessment engagement for a paying enterprise client.

This is a high-stakes deliverable reviewed by CISOs, legal teams, and board members. Accuracy, evidence quality, and actionability are paramount. Every finding must be traceable to the uploaded documentation.

═══════════════════════════════════════════════════════════
PHASE 1: DOCUMENT ANALYSIS — Think before you write
═══════════════════════════════════════════════════════════

Before generating ANY output, carefully read ALL uploaded documentation below. For each document:
1. Identify what type of document it is (architecture, data flow, API spec, etc.)
2. Note all components, systems, data flows, integrations, and trust boundaries
3. Flag any explicit security concerns, known gaps, or risks mentioned by the authors themselves
4. Identify sensitive data types, external integrations, and authentication mechanisms
5. Note encryption approaches, access controls, and compliance posture described

Only after completing this analysis should you generate the report below.

═══════════════════════════════════════════════════════════
PROJECT CONTEXT
═══════════════════════════════════════════════════════════

- **Project Name:** {project_info['name']}
- **Application Type:** {project_info.get('app_type', 'Not specified')}
- **Deployment Model:** {project_info.get('deployment', 'Not specified')}
- **Business Criticality:** {project_info.get('criticality', 'High')}
- **Compliance Requirements:** {compliance_reqs}
- **Environment:** {project_info.get('environment', 'Production')}
- **Assessment Date:** {assessment_date}
- **Assessment Framework(s):** {frameworks_str}

═══════════════════════════════════════════════════════════
UPLOADED DOCUMENTATION — Read every word carefully
═══════════════════════════════════════════════════════════

<<DOCUMENT_START>>
{documents_content}
<<DOCUMENT_END>>

═══════════════════════════════════════════════════════════
THREAT MODELING FRAMEWORKS
═══════════════════════════════════════════════════════════

{framework_coverage}

═══════════════════════════════════════════════════════════
RISK SCORING RUBRICS — Use these exactly, no exceptions
═══════════════════════════════════════════════════════════

DO NOT estimate likelihood or impact from intuition. Score using ONLY these definitions:

LIKELIHOOD SCORING:
{likelihood_rubric}

IMPACT SCORING (calibrated to project criticality: {project_info.get('criticality', 'High')}):
{impact_rubric}

Risk Score = Likelihood × Impact
- 20–25: CRITICAL — immediate escalation to CISO, 0–30 day remediation
- 12–19: HIGH — remediate within 30–90 days
- 6–11:  MEDIUM — remediate within 90–180 days
- 1–5:   LOW — address in next planning cycle

═══════════════════════════════════════════════════════════
EVIDENCE STANDARDS — Mandatory for every single finding
═══════════════════════════════════════════════════════════

Every finding MUST include:
1. **Document name** — which specific file the evidence comes from
2. **Section/location** — heading, page, or section name in that document
3. **Verbatim quote** — the EXACT text from the document in quotation marks
4. **Analysis** — how this evidence demonstrates the threat or gap

STRICT RULES:
- Do NOT fabricate quotes. Do NOT paraphrase and present it as a quote.
- If you cannot find direct evidence in the documents, mark it: [INFERRED — no direct document evidence, based on architecture type]
- If a document does not mention a topic, say so explicitly rather than inferring

═══════════════════════════════════════════════════════════
OUTPUT FORMAT — Critical: produce BOTH blocks below
═══════════════════════════════════════════════════════════

Your output MUST begin with a JSON metadata block (between ```json and ```) followed immediately by the full markdown report. The JSON feeds the interactive dashboard. The markdown feeds the PDF export. Both come from this single response.

The JSON block MUST be valid, parseable JSON containing:

```json
{{
  "overall_risk_rating": "CRITICAL|HIGH|MEDIUM|LOW",
  "total_findings": 0,
  "findings_by_severity": {{"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0}},
  "top_5_finding_ids": ["F001", "F002", "F003", "F004", "F005"],
  "assessment_date": "{assessment_date}",
  "frameworks_used": {frameworks},
  "risk_areas_assessed": {risk_areas},
  "all_findings": [
    {{
      "id": "F001",
      "title": "Finding title",
      "tactic": "Tactic or category name",
      "technique_id": "T1566.001",
      "tactic_id": "TA0001",
      "severity": "CRITICAL",
      "likelihood": 4,
      "impact": 5,
      "risk_score": 20,
      "priority": "P0",
      "owner": "Security Team",
      "timeline": "0-30 days",
      "doc_source": "document_name.pdf — Section Name",
      "verbatim_evidence": "exact quote from the document",
      "business_impact": "description of business impact",
      "mitigation_steps": ["step 1", "step 2", "step 3", "step 4", "step 5"]
    }}
  ],
  "all_recommendations": [
    {{
      "id": "R001",
      "title": "Recommendation title",
      "priority": "P0",
      "addresses_findings": ["F001", "F002"],
      "risk_reduction_pct": 70,
      "effort_weeks": 3,
      "owner": "Security Team",
      "target_date": "30 days",
      "steps": ["step 1", "step 2", "step 3"]
    }}
  ],
  "kill_chains": [
    {{
      "id": "KC001",
      "title": "Attack scenario title",
      "risk_score": 20,
      "phases": [
        {{
          "phase": "Initial Access",
          "technique_id": "T1566.001",
          "description": "phase description",
          "doc_evidence": "document reference",
          "detection_window": "detection opportunity",
          "mitigation": "mitigation action"
        }}
      ]
    }}
  ]
}}
```

═══════════════════════════════════════════════════════════
REPORT STRUCTURE — Generate every section in full
═══════════════════════════════════════════════════════════

---

# THREAT ASSESSMENT REPORT

**Report Title:** Threat Assessment — {project_info['name']}
**Framework:** {frameworks_str}
**Assessment Date:** {assessment_date}
**Classification:** CONFIDENTIAL
**Generated By:** ThreatVision AI (Powered by Claude Sonnet)

---

# EXECUTIVE SUMMARY

**Overall Risk Rating:** [CRITICAL / HIGH / MEDIUM / LOW]

[Paragraph 1: What was assessed, which documents were reviewed, what methodology was applied.]

[Paragraph 2: The most significant findings, their business implications, and urgency of remediation.]

## Top 5 Critical Findings

| # | Finding ID | Title | Severity | Risk Score | Evidence Source | Business Impact | Action Required |
|---|-----------|-------|----------|-----------|-----------------|-----------------|----------------|
| 1 | F001 | [title] | **CRITICAL** | [score]/25 | [doc: section] | [impact] | [action] |

## Risk Distribution

| Priority | Count | Finding IDs | Remediation Window |
|----------|-------|------------|-------------------|
| P0 — CRITICAL | [n] | [IDs] | 0–30 days |
| P1 — HIGH | [n] | [IDs] | 30–90 days |
| P2 — MEDIUM | [n] | [IDs] | 90–180 days |

---

# DOCUMENT ANALYSIS SUMMARY

Before the threat analysis, summarise what documents were provided and what you found:
- List every document reviewed by name
- State what type of document each one is
- Note the key architectural components, data flows, and security controls you identified
- Flag any security concerns explicitly mentioned by the document authors themselves

---

# THREAT MODELING ANALYSIS — {frameworks_str}

**Analysis Summary:** [2-3 sentences on key findings across the framework]

[For each tactic/category in the selected framework(s), provide a full analysis section.
For MITRE ATT&CK: cover all 12 tactics TA0001–TA0012.
For STRIDE: cover all 6 categories S, T, R, I, D, E.
For PASTA: cover all 7 stages.
For each threat found, include the EXACT technique ID where applicable.]

## [TA0001 - Initial Access / or STRIDE category / or PASTA stage]

**Summary:** [What threats were found in this category and their overall severity]

| Threat ID | Technique ID | Threat Description | Document Evidence | Verbatim Quote | Likelihood | Impact | Risk Score | Severity | Mitigation |
|-----------|-------------|-------------------|-------------------|----------------|-----------|--------|-----------|---------|-----------|
| T001 | T1566.001 | [description] | [doc: section] | "[exact quote]" | [1-5] | [1-5] | [L×I] | **CRITICAL** | [action] |

[Repeat for all categories/tactics in the selected framework]

---

# SPECIALIZED RISK ASSESSMENTS

{risk_areas_sections}

---

# COMPONENT-SPECIFIC THREAT ANALYSIS

**Architecture Summary:** [Describe only components actually mentioned in the uploaded documents]

| Component | Document Evidence | Verbatim Quote | Critical Threats | Risk Level | Mitigation Priority |
|-----------|------------------|----------------|-----------------|-----------|---------------------|
| [component] | [doc: section] | "[quote]" | [threats] | **CRITICAL** | [priority] |

---

# ATTACK SCENARIOS & KILL CHAINS

**Scenario Selection:** [Explain why these scenarios were chosen based on document evidence]

## Scenario 1: [Most Dangerous Attack Path From Document Evidence]

**Profile:** [Attacker profile, goal, expected business impact if successful]
**Overall Risk Score:** [score]/25
**Primary Evidence:** [which document makes this scenario credible]

| Phase | Technique ID | Document Evidence | Verbatim Quote | Description | Detection Window | Mitigation |
|-------|-------------|-------------------|----------------|-------------|-----------------|-----------|
| Initial Access | T1566.001 | [doc] | "[quote]" | [description] | [window] | [action] |
| Execution | T1059.006 | [doc] | "[quote]" | [description] | [window] | [action] |
| Persistence | T1546 | [doc] | "[quote]" | [description] | [window] | [action] |
| Lateral Movement | T1021 | [doc] | "[quote]" | [description] | [window] | [action] |
| Exfiltration | T1041 | [doc] | "[quote]" | [description] | [window] | [action] |
| Impact | T1485 | [doc] | "[quote]" | [description] | [window] | [action] |

[Add Scenario 2 and 3 for the next highest-risk paths]

---

# COMPREHENSIVE RISK MATRIX

| | Impact 1 | Impact 2 | Impact 3 | Impact 4 | Impact 5 |
|---|---------|---------|---------|---------|---------|
| **Likelihood 5** | 5 | 10 | 15 | 20 | **25-CRITICAL** |
| **Likelihood 4** | 4 | 8 | 12 | **16-HIGH** | **20-CRITICAL** |
| **Likelihood 3** | 3 | 6 | **9-MEDIUM** | **12-HIGH** | **15-HIGH** |
| **Likelihood 2** | 2 | 4 | 6 | 8 | 10 |
| **Likelihood 1** | 1 | 2 | 3 | 4 | 5 |

## All Findings

| ID | Title | Category | Technique | L | I | Score | Severity | Priority | Owner | Timeline |
|----|-------|----------|-----------|---|---|-------|---------|---------|-------|---------|
| F001 | [title] | [tactic] | T1566.001 | [l] | [i] | [l×i] | **CRITICAL** | P0 | [owner] | 0-30 days |

---

# PRIORITIZED RECOMMENDATIONS

**Strategy:** [Overall remediation approach — quick wins first, then systemic fixes]

## P0 — CRITICAL: Remediate 0–30 Days

| ID | Recommendation | Addresses | Risk Reduction | Effort | Owner | Implementation Steps |
|----|---------------|-----------|---------------|--------|-------|---------------------|
| R001 | [action] | F001, F003 | 75% | 2-3 weeks | [team] | 1.[step] 2.[step] 3.[step] |

## P1 — HIGH: Remediate 30–90 Days

| ID | Recommendation | Addresses | Risk Reduction | Effort | Owner | Implementation Steps |
|----|---------------|-----------|---------------|--------|-------|---------------------|
| R010 | [action] | F005, F007 | 60% | 4-6 weeks | [team] | 1.[step] 2.[step] |

## P2 — MEDIUM: Remediate 90–180 Days

| ID | Recommendation | Addresses | Risk Reduction | Effort | Owner | Implementation Steps |
|----|---------------|-----------|---------------|--------|-------|---------------------|
| R020 | [action] | F009 | 40% | 8-10 weeks | [team] | 1.[step] 2.[step] |

---

# SECURITY CONTROLS MAPPING

| Control ID | Control Name | Framework Ref | Status | Addresses | Gap | Timeline |
|-----------|-------------|--------------|--------|-----------|-----|---------|
| AC-001 | [control] | NIST SP 800-53 AC-2 | Not Started | F001 | [gap] | [date] |

---

# COMPLIANCE CONSIDERATIONS

| Finding ID | Finding | Compliance Requirement | Gap | Required Evidence | Timeline |
|-----------|---------|----------------------|-----|------------------|---------|
{compliance_rows}

---

# REFERENCES

**Frameworks Used:**
{framework_refs}

**Security Standards:**
- [NIST SP 800-53 Rev 5](https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final)
- [OWASP Top 10 2021](https://owasp.org/www-project-top-ten/)
- [MITRE ATT&CK v14](https://attack.mitre.org/)
- [CIS Critical Security Controls v8](https://www.cisecurity.org/controls/v8)
- [ISO/IEC 27001:2022](https://www.iso.org/standard/27001)

**Compliance Frameworks:**
{compliance_refs}

**Risk Methodologies:**
- [CVSS v3.1](https://www.first.org/cvss/v3.1/specification-document)
- [NIST Risk Management Framework](https://csrc.nist.gov/projects/risk-management/about-rmf)

---

# DISCLAIMER

This assessment was generated by ThreatVision AI (powered by Anthropic Claude Sonnet). It is a preliminary assessment tool and must be validated by qualified security professionals before acting on findings. This report does not replace penetration testing, professional security audits, or compliance assessments.

---

**CRITICAL FORMATTING REQUIREMENTS:**
- Use F### for findings (F001, F002...), R### for recommendations, T### for threats, KC### for kill chains
- Every finding table row MUST have a verbatim quote — no empty evidence cells
- Risk severity always bold: **CRITICAL**, **HIGH**, **MEDIUM**, **LOW**
- For MITRE ATT&CK: every threat must have a technique ID (T####.###) and tactic ID (TA####)
- Do NOT truncate tables — include every finding row, no "..." placeholders
- The JSON block at the top must be complete and valid — it is parsed programmatically
- Do NOT include the JSON block again anywhere in the markdown body

Generate the complete report now. Do not truncate any section."""

    return prompt
