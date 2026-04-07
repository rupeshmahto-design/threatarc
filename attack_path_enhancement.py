"""
Attack Path Enhancement Module
Generates SVG-based interactive attack path visualizations from structured threat data
"""

import json
from typing import Dict, Any, List


def generate_attack_paths_from_findings(findings: List[Dict], kill_chains: List[Dict]) -> List[Dict]:
    """
    Generate attack path scenarios from findings and kill chains.
    Groups related findings into attack scenarios with visual flow.
    
    Returns list of attack scenarios with nodes and connections.
    """
    scenarios = []
    
    # Scenario 1: Group by high-severity findings with related tactics
    critical_findings = [f for f in findings if f.get('severity') == 'CRITICAL']
    high_findings = [f for f in findings if f.get('severity') == 'HIGH']
    
    if critical_findings:
        # Create primary attack scenario from critical findings
        scenario = {
            'id': 'scenario1',
            'title': 'Critical Attack Path — Primary Threat',
            'subtitle': 'Highest risk scenario based on document evidence',
            'severity': 'CRITICAL',
            'risk_score': max([f.get('risk_score', 0) for f in critical_findings], default=20),
            'nodes': [],
            'edges': []
        }
        
        # Build nodes from findings
        for idx, finding in enumerate(critical_findings[:8]):  # Limit to 8 nodes
            node = {
                'id': finding.get('id', f'node{idx}'),
                'title': finding.get('title', ''),
                'icon': _get_icon_for_tactic(finding.get('tactic', '')),
                'severity': finding.get('severity', 'HIGH'),
                'technique_id': finding.get('technique_id', ''),
                'doc_source': finding.get('doc_source', ''),
                'verbatim_evidence': finding.get('verbatim_evidence', ''),
                'business_impact': finding.get('business_impact', ''),
                'x': 100 + (idx * 140),  # Position nodes
                'y': 145,
                'radius': 33 if finding.get('severity') == 'CRITICAL' else 28
            }
            scenario['nodes'].append(node)
            
            # Create edges between sequential nodes
            if idx > 0:
                scenario['edges'].append({
                    'from_node': scenario['nodes'][idx-1]['id'],
                    'to_node': node['id'],
                    'type': 'attack' if finding.get('severity') == 'CRITICAL' else 'pivot'
                })
        
        scenarios.append(scenario)
    
    # Scenario 2: Multi-stage attack from kill chains
    if kill_chains and len(kill_chains) > 0:
        kc = kill_chains[0]
        if kc.get('phases'):
            scenario = {
                'id': 'scenario2',
                'title': kc.get('title', 'Multi-Stage Attack Scenario'),
                'subtitle': f"{len(kc.get('phases', []))} phases identified",
                'severity': kc.get('severity', 'HIGH'),
                'risk_score': kc.get('risk_score', 18),
                'nodes': [],
                'edges': []
            }
            
            for idx, phase in enumerate(kc.get('phases', [])[:8]):
                node = {
                    'id': f'phase{idx}',
                    'title': phase.get('phase', ''),
                    'icon': _get_icon_for_phase(phase.get('phase', '')),
                    'severity': phase.get('severity', 'HIGH'),
                    'technique_id': phase.get('technique_id', ''),
                    'doc_source': phase.get('doc_source', ''),
                    'verbatim_evidence': phase.get('description', ''),
                    'business_impact': phase.get('detection_window', ''),
                    'x': 100 + (idx * 130),
                    'y': 145,
                    'radius': 30
                }
                scenario['nodes'].append(node)
                
                if idx > 0:
                    scenario['edges'].append({
                        'from_node': scenario['nodes'][idx-1]['id'],
                        'to_node': node['id'],
                        'type': 'sequence'
                    })
            
            scenarios.append(scenario)
    
    return scenarios


def _get_icon_for_tactic(tactic: str) -> str:
    """Map MITRE tactics to emoji icons"""
    icons = {
        'Reconnaissance': '🔍',
        'Initial Access': '📧',
        'Execution': '💥',
        'Persistence': '🧠',
        'Privilege Escalation': '⬆️',
        'Defense Evasion': '🛡️',
        'Credential Access': '🔑',
        'Discovery': '🗺',
        'Lateral Movement': '↔️',
        'Collection': '📦',
        'Command and Control': '📡',
        'Exfiltration': '🚀',
        'Impact': '💰',
    }
    return icons.get(tactic, '⚡')


def _get_icon_for_phase(phase: str) -> str:
    """Map kill chain phases to icons"""
    return _get_icon_for_tactic(phase)


def generate_attack_path_svg(scenario: Dict) -> str:
    """Generate SVG markup for an attack path scenario"""
    nodes = scenario.get('nodes', [])
    edges = scenario.get('edges', [])
    
    if not nodes:
        return '<p style="color:var(--t3);padding:20px;text-align:center">No attack path data available</p>'
    
    # Calculate SVG dimensions
    max_x = max([n['x'] for n in nodes], default=800) + 100
    max_y = max([n['y'] for n in nodes], default=200) + 100
    
    svg_parts = []
    svg_parts.append(f'<svg viewBox="0 0 {max_x} {max_y}" xmlns="http://www.w3.org/2000/svg" width="100%" style="min-width:800px;overflow:visible">')
    
    # Defs for markers and filters
    svg_parts.append('''<defs>
<marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#dc2626" opacity="0.9"/></marker>
<marker id="ao" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#ea580c" opacity="0.9"/></marker>
<filter id="sh1"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="rgba(220,38,38,0.25)"/></filter>
<filter id="sh2"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(234,88,12,0.2)"/></filter>
</defs>''')
    
    # Draw edges first (so they appear behind nodes)
    for edge in edges:
        from_idx = next((i for i, n in enumerate(nodes) if n['id'] == edge['from_node']), None)
        to_idx = next((i for i, n in enumerate(nodes) if n['id'] == edge['to_node']), None)
        
        if from_idx is not None and to_idx is not None:
            from_node = nodes[from_idx]
            to_node = nodes[to_idx]
            
            marker = 'url(#ar)' if edge.get('type') == 'attack' else 'url(#ao)'
            color = '#dc2626' if edge.get('type') == 'attack' else '#ea580c'
            
            svg_parts.append(f'<line x1="{from_node["x"]}" y1="{from_node["y"]}" x2="{to_node["x"]}" y2="{to_node["y"]}" stroke="{color}" stroke-width="2" opacity="0.5" marker-end="{marker}"/>')
    
    # Draw nodes
    for node in nodes:
        sev = node.get('severity', 'MEDIUM')
        color = '#dc2626' if sev == 'CRITICAL' else '#ea580c' if sev == 'HIGH' else '#d97706'
        bg = '#fef2f2' if sev == 'CRITICAL' else '#fff7ed' if sev == 'HIGH' else '#fffbeb'
        filter_attr = 'filter="url(#sh1)"' if sev == 'CRITICAL' else ''
        
        # Escape strings for HTML
        title = node.get('title', '').replace('"', '&quot;').replace('<', '&lt;')
        evidence = node.get('verbatim_evidence', '').replace('"', '&quot;').replace('<', '&lt;')
        doc = node.get('doc_source', '').replace('"', '&quot;')
        impact = node.get('business_impact', '').replace('"', '&quot;')
        ref = node.get('technique_id', '')
        
        svg_parts.append(f'''
<g class="ap-node" transform="translate({node['x']},{node['y']})" style="cursor:pointer" {filter_attr} 
   data-title="{title}" data-sev="{sev}" data-doc="{doc}" 
   data-evidence="{evidence[:200]}" data-impact="{impact[:200]}" data-ref="{ref}">
  <circle r="{node['radius']}" fill="white" stroke="{color}" stroke-width="2.5"/>
  <circle r="{node['radius']-7}" fill="{bg}"/>
  <text y="1" text-anchor="middle" dominant-baseline="middle" font-size="17">{node.get('icon', '⚡')}</text>
</g>''')
    
    svg_parts.append('</svg>')
    return ''.join(svg_parts)
