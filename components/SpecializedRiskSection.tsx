import React from 'react';

interface SpecializedFinding {
  label: string;
  value: string;
  severity: string;
  finding_ref?: string;
}

interface SpecializedRisk {
  domain: string;
  icon: string;
  findings: SpecializedFinding[];
  summary: string;
  grade: string;
}

interface SpecializedRiskSectionProps {
  risks: SpecializedRisk[];
  onFindingClick?: (findingId: string) => void;
}

const SpecializedRiskSection: React.FC<SpecializedRiskSectionProps> = ({ 
  risks = [],
  onFindingClick 
}) => {
  if (!risks || risks.length === 0) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: '#64748b'
      }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎯</div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
          No Specialized Risk Assessments Available
        </div>
        <div style={{ fontSize: '12px', lineHeight: 1.6 }}>
          Specialized risk domain analysis data not found in this report.
        </div>
      </div>
    );
  }

  const getGradeColor = (grade: string) => {
    const level = grade.toUpperCase();
    if (level === 'CRITICAL') return '#dc2626';
    if (level === 'HIGH') return '#ea580c';
    if (level === 'MEDIUM') return '#d97706';
    return '#65a30d';
  };

  const getGradeBg = (grade: string) => {
    const level = grade.toUpperCase();
    if (level === 'CRITICAL') return '#fef2f2';
    if (level === 'HIGH') return '#fff7ed';
    if (level === 'MEDIUM') return '#fffbeb';
    return '#f7fee7';
  };

  const getGradeBorder = (grade: string) => {
    const level = grade.toUpperCase();
    if (level === 'CRITICAL') return '#fecaca';
    if (level === 'HIGH') return '#fed7aa';
    if (level === 'MEDIUM') return '#fde68a';
    return '#d9f99d';
  };

  const getSeverityColor = (severity: string) => {
    const level = severity.toUpperCase();
    if (level === 'CRITICAL') return '#dc2626';
    if (level === 'HIGH') return '#ea580c';
    if (level === 'MEDIUM') return '#d97706';
    return '#65a30d';
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
      gap: '16px',
      padding: '0'
    }}>
      {risks.map((risk, idx) => (
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
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '12px',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', flex: 1 }}>
              <span style={{ fontSize: '24px', lineHeight: 1 }}>
                {risk.icon}
              </span>
              <div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#0f172a',
                  lineHeight: 1.4,
                  marginBottom: '4px'
                }}>
                  {risk.domain}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#64748b',
                  fontFamily: 'JetBrains Mono, monospace'
                }}>
                  {risk.summary} · click items for details
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
              color: getGradeColor(risk.grade),
              background: getGradeBg(risk.grade),
              border: `1px solid ${getGradeBorder(risk.grade)}`,
              whiteSpace: 'nowrap'
            }}>
              {risk.grade.toUpperCase()}
            </div>
          </div>

          {/* Findings */}
          <div style={{
            padding: '14px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            {risk.findings.map((finding, fIdx) => (
              <div
                key={fIdx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  background: '#f8fafc',
                  borderRadius: '6px',
                  cursor: finding.finding_ref && onFindingClick ? 'pointer' : 'default',
                  transition: 'all 0.1s',
                  border: finding.finding_ref ? '1px solid #e2e8f0' : 'none'
                }}
                onClick={() => finding.finding_ref && onFindingClick && onFindingClick(finding.finding_ref)}
                onMouseEnter={(e) => {
                  if (finding.finding_ref && onFindingClick) {
                    e.currentTarget.style.background = '#eff6ff';
                    e.currentTarget.style.borderColor = '#bfdbfe';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <span style={{
                  fontSize: '11px',
                  color: '#334155',
                  fontWeight: 600,
                  flex: 1,
                  fontFamily: 'JetBrains Mono, monospace'
                }}>
                  {finding.label}
                  {finding.finding_ref && (
                    <span style={{
                      fontSize: '9px',
                      color: '#2563eb',
                      marginLeft: '6px',
                      fontWeight: 700
                    }}>
                      ({finding.finding_ref})
                    </span>
                  )}
                </span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: getSeverityColor(finding.severity),
                  fontFamily: 'JetBrains Mono, monospace',
                  marginLeft: '12px'
                }}>
                  {finding.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SpecializedRiskSection;
