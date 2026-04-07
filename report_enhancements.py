"""
Interactive Report Enhancements
- Attack Path SVG Visualization
- MITRE ATT&CK Heatmap
- Enhanced Evidence Display
"""

import html as html_module
from typing import Dict, Any, List


# ─── FRAMEWORK-AWARE ICONS ────────────────────────────────────────────────────

PHASE_ICONS = {
    # MITRE ATT&CK
    'Reconnaissance': '🔍', 'Initial Access': '📧', 'Execution': '💥',
    'Persistence': '🧠', 'Privilege Escalation': '⬆️', 'Defense Evasion': '🛡️',
    'Credential Access': '🔑', 'Discovery': '🗺', 'Lateral Movement': '↔️',
    'Collection': '📦', 'Command and Control': '📡', 'Exfiltration': '🚀', 'Impact': '💰',
    # STRIDE
    'Spoofing': '🎭', 'Spoofing Identity': '🎭', 'Tampering': '✂️',
    'Tampering with Data': '✂️', 'Repudiation': '🚫', 'Information Disclosure': '👁',
    'Denial of Service': '🔴', 'Elevation of Privilege': '⬆️',
    # PASTA
    'Define Objectives': '🎯', 'Define Technical Scope': '🗺',
    'Application Decomposition': '🔩', 'Threat Analysis': '🧐', 'Vulnerability Analysis': '🔎',
    'Attack Modeling': '⚔️', 'Risk & Impact Analysis': '📊', 'Risk and Impact Analysis': '📊',
    # OCTAVE
    'Build Asset-Based Threat Profiles': '📋',
    'Identify Infrastructure Vulnerabilities': '🏗',
    'Develop Security Strategy and Plans': '📝',
    # VAST
    'Application Threat Models': '📱', 'Operational Threat Models': '⚙️',
    'Infrastructure Models': '🏛',
    # Generic
    'Assessment': '📋', 'Analysis': '🔬', 'Identification': '🔍',
    'Mitigation': '🛡', 'Response': '🚨', 'Recovery': '🔄',
    'Prevention': '🔒', 'Detection': '👁', 'Remediation': '🔧', 'Review': '📝',
}


def get_icon_for_tactic(tactic: str) -> str:
    """Get emoji icon for a tactic/phase"""
    return PHASE_ICONS.get(tactic, '⚡')


# ─── ATTACK PATH GENERATION ────────────────────────────────────────────────────

def generate_attack_paths(findings: List[Dict], kill_chains: List[Dict]) -> List[Dict]:
    """
    Generate attack path scenarios from findings and kill chains.
    Returns list of scenarios with SVG visualization data.
    """
    scenarios = []
    
    # Scenario 1: Critical path from CRITICAL findings
    critical_findings = [f for f in findings if f.get('severity') == 'CRITICAL']
    if len(critical_findings) >= 3:
        nodes = []
        edges = []
        
        for idx, finding in enumerate(critical_findings[:8]):
            node = {
                'id': finding.get('id', f'node{idx}'),
                'title': finding.get('title', '')[:60],
                'icon': get_icon_for_tactic(finding.get('tactic', '')),
                'severity': finding.get('severity', 'CRITICAL'),
                'technique_id': finding.get('technique_id', ''),
                'doc_source': finding.get('doc_source', '')[:100],
                'verbatim_evidence': finding.get('verbatim_evidence', '')[:200],
                'business_impact': finding.get('business_impact', '')[:200],
                'x': 100 + (idx * 130),
                'y': 145,
                'radius': 33
            }
            nodes.append(node)
            
            if idx > 0:
                edges.append({
                    'from_x': nodes[idx-1]['x'],
                    'from_y': nodes[idx-1]['y'],
                    'to_x': node['x'],
                    'to_y': node['y'],
                    'type': 'attack'
                })
        
        scenarios.append({
            'id': 'scenario1',
            'title': 'Critical Attack Path — Highest Risk Scenario',
            'subtitle': f'Based on {len(critical_findings)} CRITICAL findings from document evidence',
            'severity': 'CRITICAL',
            'risk_score': max([f.get('risk_score', 20) for f in critical_findings], default=20),
            'nodes': nodes,
            'edges': edges
        })
    
    # Scenario 2: Kill chain path
    if kill_chains and len(kill_chains) > 0:
        kc = kill_chains[0]
        phases = kc.get('phases', [])
        if phases:
            nodes = []
            edges = []
            
            for idx, phase in enumerate(phases[:8]):
                node = {
                    'id': f'phase{idx}',
                    'title': phase.get('phase', '')[:60],
                    'icon': get_icon_for_tactic(phase.get('phase', '')),
                    'severity': phase.get('severity', 'HIGH'),
                    'technique_id': phase.get('technique_id', phase.get('stage_id', '')),
                    'doc_source': phase.get('doc_source', '')[:100],
                    'verbatim_evidence': phase.get('description', '')[:200],
                    'business_impact': phase.get('detection_window', '')[:200],
                    'x': 100 + (idx * 120),
                    'y': 145,
                    'radius': 30
                }
                nodes.append(node)
                
                if idx > 0:
                    edges.append({
                        'from_x': nodes[idx-1]['x'],
                        'from_y': nodes[idx-1]['y'],
                        'to_x': node['x'],
                        'to_y': node['y'],
                        'type': 'sequence'
                    })
            
            scenarios.append({
                'id': 'scenario2',
                'title': kc.get('title', 'Multi-Stage Attack Scenario'),
                'subtitle': f'{len(phases)} phases — {kc.get("description", "Kill chain analysis")}',
                'severity': kc.get('severity', 'HIGH'),
                'risk_score': kc.get('risk_score', 18),
                'nodes': nodes,
                'edges': edges
            })
    
    return scenarios


def generate_attack_path_svg(scenario: Dict) -> str:
    """Generate SVG markup for an attack path scenario"""
    nodes = scenario.get('nodes', [])
    edges = scenario.get('edges', [])
    
    if not nodes:
        return '<p style="color:var(--t3);padding:20px;text-align:center;font-family:\'JetBrains Mono\',monospace;font-size:12px">No attack path data available for this assessment</p>'
    
    # Calculate SVG dimensions
    max_x = max([n['x'] for n in nodes], default=800) + 100
    max_y = max([n['y'] for n in nodes], default=200) + 100
    
    svg_parts = []
    svg_parts.append(f'<svg viewBox="0 0 {max_x} {max_y}" xmlns="http://www.w3.org/2000/svg" width="100%" style="min-width:800px;overflow:visible">')
    
    # Defs for markers and filters
    svg_parts.append('''<defs>
<marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#dc2626" opacity="0.9"/></marker>
<marker id="ao" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#ea580c" opacity="0.9"/></marker>
<marker id="ag" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#94a3b8" opacity="0.8"/></marker>
<filter id="sh1"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="rgba(220,38,38,0.25)"/></filter>
<filter id="sh2"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(234,88,12,0.2)"/></filter>
</defs>''')
    
    # Draw edges first (so they appear behind nodes)
    for edge in edges:
        edge_type = edge.get('type', 'attack')
        marker = 'url(#ar)' if edge_type == 'attack' else 'url(#ao)' if edge_type == 'sequence' else 'url(#ag)'
        color = '#dc2626' if edge_type == 'attack' else '#ea580c' if edge_type == 'sequence' else '#94a3b8'
        width = '2' if edge_type in ['attack', 'sequence'] else '1.5'
        dash = 'stroke-dasharray="5,3"' if edge_type == 'pivot' else ''
        
        svg_parts.append(f'<line x1="{edge["from_x"]}" y1="{edge["from_y"]}" x2="{edge["to_x"]}" y2="{edge["to_y"]}" stroke="{color}" stroke-width="{width}" opacity="0.5" {dash} marker-end="{marker}"/>')
    
    # Draw nodes
    for node in nodes:
        sev = node.get('severity', 'MEDIUM')
        color = '#dc2626' if sev == 'CRITICAL' else '#ea580c' if sev == 'HIGH' else '#d97706'
        bg = '#fef2f2' if sev == 'CRITICAL' else '#fff7ed' if sev == 'HIGH' else '#fffbeb'
        filter_attr = 'filter="url(#sh1)"' if sev == 'CRITICAL' else 'filter="url(#sh2)"' if sev == 'HIGH' else ''
        
        # Escape strings for HTML
        title = html_module.escape(node.get('title', ''))
        evidence = html_module.escape(node.get('verbatim_evidence', ''))
        doc = html_module.escape(node.get('doc_source', ''))
        impact = html_module.escape(node.get('business_impact', ''))
        ref = html_module.escape(node.get('technique_id', ''))
        
        svg_parts.append(f'''
<g class="ap-node" transform="translate({node['x']},{node['y']})" style="cursor:pointer" {filter_attr} 
   data-title="{title}" data-sev="{sev}" data-doc="{doc}" 
   data-evidence="{evidence}" data-impact="{impact}" data-ref="{ref}">
  <circle r="{node['radius']}" fill="white" stroke="{color}" stroke-width="2.5"/>
  <circle r="{node['radius']-7}" fill="{bg}"/>
  <text y="1" text-anchor="middle" dominant-baseline="middle" font-size="17">{node.get('icon', '⚡')}</text>
</g>''')
    
    svg_parts.append('</svg>')
    return ''.join(svg_parts)


# ─── MITRE HEATMAP GENERATION ──────────────────────────────────────────────────

MITRE_TACTICS = [
    ('TA0001', 'Initial Access'), ('TA0002', 'Execution'), ('TA0003', 'Persistence'),
    ('TA0004', 'Priv Esc'), ('TA0005', 'Defense Evasion'), ('TA0006', 'Cred Access'),
    ('TA0007', 'Discovery'), ('TA0008', 'Lateral Movement'), ('TA0009', 'Collection'),
    ('TA0010', 'C2'), ('TA0011', 'Exfiltration'), ('TA0012', 'Impact')
]


def generate_mitre_heatmap(findings: List[Dict], framework: str) -> str:
    """Generate MITRE ATT&CK heatmap HTML"""
    if 'MITRE' not in framework.upper():
        return ''
    
    # Group findings by tactic
    tactic_map = {}
    for f in findings:
        tactic = f.get('tactic', '')
        if tactic:
            if tactic not in tactic_map:
                tactic_map[tactic] = []
            tactic_map[tactic].append(f)
    
    cols_html = []
    for tactic_id, tactic_name in MITRE_TACTICS:
        findings_in_tactic = tactic_map.get(tactic_name, [])
        
        col_html = f'''<div class="mitre-col">
<div class="mitre-head">
  <div class="mitre-head-id">{tactic_id}</div>
  <div class="mitre-head-name">{tactic_name}</div>
</div>'''
        
        if findings_in_tactic:
            for f in findings_in_tactic[:5]:  # Max 5 per column
                sev = f.get('severity', 'MEDIUM')
                cls = 'c' if sev == 'CRITICAL' else 'h' if sev == 'HIGH' else 'm'
                tech_id = html_module.escape(f.get('technique_id', ''))
                title = html_module.escape(f.get('title', '')[:50])
                score = f.get('risk_score', 9)
                
                col_html += f'''<div class="mitre-cell {cls}" onclick="openModal(FD.find(x=>x.id==='{html_module.escape(f.get('id', ''))}'))">
  <span class="mitre-cid">{tech_id}</span>
  <span class="mitre-cname">{title}</span>
  <span class="mitre-score">Score: {score}/25</span>
</div>'''
        
        col_html += '</div>'
        cols_html.append(col_html)
    
    return '<div class="mitre-wrap">' + ''.join(cols_html) + '</div>'


# ─── ADDITIONAL CSS FOR NEW SECTIONS ──────────────────────────────────────────────

ADDITIONAL_CSS = """
/* MITRE HEATMAP */
.mitre-scroll{overflow-x:auto;padding:2px}
.mitre-wrap{display:flex;gap:3px;min-width:1140px}
.mitre-col{flex:1;min-width:82px}
.mitre-head{background:var(--ag);border:1px solid var(--ab);border-radius:6px 6px 0 0;padding:8px 7px;text-align:center;margin-bottom:3px}
.mitre-head-id{font-family:'JetBrains Mono',monospace;font-size:8px;color:var(--a);font-weight:600;letter-spacing:0.3px}
.mitre-head-name{font-size:10px;font-weight:700;color:var(--t1);margin-top:2px;line-height:1.3}
.mitre-cell{border-radius:5px;padding:7px 8px;margin-bottom:2px;cursor:pointer;transition:all 0.15s;border:1px solid transparent;font-size:10px;line-height:1.35}
.mitre-cell:hover{transform:scale(1.02);box-shadow:var(--shadow-md)}
.mitre-cell.c{background:var(--cg);border-color:var(--cb);color:var(--ct)}
.mitre-cell.h{background:var(--hg);border-color:var(--hb);color:var(--ht)}
.mitre-cell.m{background:var(--mg);border-color:var(--mb);color:var(--mt)}
.mitre-cid{font-family:'JetBrains Mono',monospace;font-size:8px;display:block;margin-bottom:2px;font-weight:500;opacity:0.75}
.mitre-cname{font-size:10px;font-weight:600}
.mitre-score{display:block;font-family:'JetBrains Mono',monospace;font-size:8px;margin-top:3px;opacity:0.7}
.scroll-hint{font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--t3);margin-top:8px;text-align:center}

/* ATTACK PATH */
.ap-legend{display:flex;gap:20px;padding:14px 20px;border-top:1px solid var(--bd);flex-wrap:wrap;background:var(--s2)}
.ap-legend-item{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--t2);font-weight:500}
.ap-dot{width:9px;height:9px;border-radius:50%}
"""
