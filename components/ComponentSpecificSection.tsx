import React from 'react';

interface ComponentAnalysis {
  component: string;
  doc_source: string;
  verbatim_quote: string;
  critical_threats: string;
  risk_level: string;
  mitigation_priority: string;
  finding_refs?: string[];
}

interface ComponentSpecificSectionProps {
  components: ComponentAnalysis[];
  onFindingClick?: (findingId: string) => void;
}

const ComponentSpecificSection: React.FC<ComponentSpecificSectionProps> = ({ 
  components = [],
  onFindingClick 
}) => {
  if (!components || components.length === 0) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: '#64748b'
      }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>📦</div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
          No Component Analysis Available
        </div>
        <div style={{ fontSize: '12px', lineHeight: 1.6 }}>
          Component-specific threat analysis data not found in this report.
        </div>
      </div>
    );
  }

  const getRiskColor = (riskLevel: string) => {
    const level = riskLevel.toUpperCase();
    if (level === 'CRITICAL') return '#dc2626';
    if (level === 'HIGH') return '#ea580c';
    if (level === 'MEDIUM') return '#d97706';
    return '#65a30d';
  };

  const getRiskBg = (riskLevel: string) => {
    const level = riskLevel.toUpperCase();
    if (level === 'CRITICAL') return '#fef2f2';
    if (level === 'HIGH') return '#fff7ed';
    if (level === 'MEDIUM') return '#fffbeb';
    return '#f7fee7';
  };

  const getRiskBorder = (riskLevel: string) => {
    const level = riskLevel.toUpperCase();
    if (level === 'CRITICAL') return '#fecaca';
    if (level === 'HIGH') return '#fed7aa';
    if (level === 'MEDIUM') return '#fde68a';
    return '#d9f99d';
  };

  const getComponentIcon = (component: string) => {
    const name = component.toLowerCase();
    if (name.includes('api') || name.includes('gateway')) return '🚪';
    if (name.includes('database') || name.includes('db')) return '🗄️';
    if (name.includes('auth') || name.includes('login')) return '🔐';
    if (name.includes('frontend') || name.includes('ui')) return '🖥️';
    if (name.includes('backend') || name.includes('server')) return '⚙️';
    if (name.includes('network') || name.includes('firewall')) return '🌐';
    if (name.includes('storage') || name.includes('s3')) return '💾';
    return '📦';
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '16px',
      padding: '0'
    }}>
      {components.map((comp, idx) => (
        <div
          key={idx}
          style={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {/* Header */}
          <div style={{
            padding: '16px 18px',
            background: 'white',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flex: 1 }}>
              <span style={{ fontSize: '26px', lineHeight: 1 }}>
                {getComponentIcon(comp.component)}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#0f172a',
                  lineHeight: 1.4,
                  marginBottom: '4px'
                }}>
                  {comp.component}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#64748b',
                  fontFamily: 'JetBrains Mono, monospace'
                }}>
                  {comp.doc_source.split(':')[0] || 'Document Evidence'}
                </div>
              </div>
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '5px 11px',
              borderRadius: '6px',
              fontSize: '10px',
              fontWeight: 700,
              fontFamily: 'JetBrains Mono, monospace',
              color: getRiskColor(comp.risk_level),
              background: getRiskBg(comp.risk_level),
              border: `1px solid ${getRiskBorder(comp.risk_level)}`,
              whiteSpace: 'nowrap'
            }}>
              {comp.risk_level.toUpperCase()}
            </div>
          </div>

          {/* Evidence Quote */}
          <div style={{
            padding: '12px 18px',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '9px',
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: 600,
              marginBottom: '7px'
            }}>
              Document Evidence
            </div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              color: '#475569',
              lineHeight: 1.6,
              fontWeight: 500,
              fontStyle: 'italic'
            }}>
              "{comp.verbatim_quote}"
            </div>
          </div>

          {/* Threats */}
          <div style={{
            padding: '14px 18px',
            background: 'white'
          }}>
            {comp.critical_threats.split(',').map((threat, tIdx) => (
              <div
                key={tIdx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: tIdx < comp.critical_threats.split(',').length - 1 ? '1px solid #f1f5f9' : 'none'
                }}
              >
                <span style={{
                  fontSize: '12px',
                  color: '#334155',
                  fontWeight: 500,
                  flex: 1
                }}>
                  {threat.trim()}
                </span>
                <span style={{
                  fontSize: '11px',
                  color: getRiskColor(comp.risk_level),
                  fontWeight: 600,
                  fontFamily: 'JetBrains Mono, monospace',
                  marginLeft: '12px'
                }}>
                  → {comp.risk_level.toUpperCase()}
                </span>
              </div>
            ))}
          </div>

          {/* Mitigation */}
          <div style={{
            padding: '12px 18px',
            background: '#f0fdf4',
            borderTop: '1px solid #bbf7d0',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px'
          }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '10px',
              color: '#15803d',
              fontWeight: 600,
              minWidth: '80px'
            }}>
              Mitigation:
            </div>
            <div style={{
              fontSize: '11px',
              color: '#166534',
              lineHeight: 1.6,
              flex: 1
            }}>
              {comp.mitigation_priority}
            </div>
          </div>

          {/* Finding References */}
          {comp.finding_refs && comp.finding_refs.length > 0 && onFindingClick && (
            <div style={{ padding: '12px 18px', background: 'white', borderTop: '1px solid #e2e8f0' }}>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '9px',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontWeight: 600,
                marginBottom: '8px'
              }}>
                Related Findings:
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {comp.finding_refs.map((fid) => (
                  <button
                    key={fid}
                    onClick={() => onFindingClick(fid)}
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '10px',
                      fontWeight: 700,
                      color: '#2563eb',
                      background: '#eff6ff',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid #bfdbfe',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#2563eb';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#eff6ff';
                      e.currentTarget.style.color = '#2563eb';
                    }}
                  >
                    {fid} →
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ComponentSpecificSection;
