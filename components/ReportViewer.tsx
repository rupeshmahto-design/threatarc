/**
 * ReportViewer.tsx
 *
 * Drop-in React component rendered after a threat assessment completes.
 * Shows:
 * - Tabbed view: Interactive Report | Raw Markdown
 * - PDF download button (calls existing /reports/{id}/pdf)
 * - Open in full window button (calls /reports/{id}/interactive)
 * - Action plan save/load from /reports/{id}/action-plan
 *
 * Usage:
 *   <ReportViewer assessmentId={123} projectName="AIOP" token={jwtToken} />
 *
 * Drop into your results page wherever you currently show the markdown output.
 */

import React, { useEffect, useState, useRef, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────────────────

interface Finding {
  id: string;
  title: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  risk_score: number;
  priority: string;
  owner: string;
  timeline: string;
  tactic: string;
  technique_id: string;
}

interface StructuredData {
  overall_risk_rating: string;
  total_findings: number;
  findings_by_severity: { CRITICAL: number; HIGH: number; MEDIUM: number; LOW: number };
  all_findings: Finding[];
  frameworks_used: string[];
  risk_areas_assessed: string[];
  assessment_date: string;
}

interface ReportViewerProps {
  assessmentId: number;
  projectName: string;
  token: string;
  apiBase?: string;
  onActionPlanSave?: (items: ActionPlanItem[]) => void;
}

interface ActionPlanItem {
  id: string;
  assignee: string;
  dueDate: string;
  status: string;
  notes: string;
  title?: string;
  severity?: string;
  timeline?: string;
}

// ── Severity helpers ───────────────────────────────────────────────────────

const SEV_COLORS: Record<string, string> = {
  CRITICAL: "#dc2626",
  HIGH: "#ea580c",
  MEDIUM: "#d97706",
  LOW: "#16a34a",
};
const SEV_BG: Record<string, string> = {
  CRITICAL: "#fef2f2",
  HIGH: "#fff7ed",
  MEDIUM: "#fffbeb",
  LOW: "#f0fdf4",
};
const SEV_BORDER: Record<string, string> = {
  CRITICAL: "#fecaca",
  HIGH: "#fed7aa",
  MEDIUM: "#fde68a",
  LOW: "#bbf7d0",
};

const SeverityPill = ({ sev }: { sev: string }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 9,
      fontWeight: 700,
      padding: "3px 8px",
      borderRadius: 10,
      textTransform: "uppercase",
      letterSpacing: 0.3,
      whiteSpace: "nowrap",
      background: SEV_BG[sev] || "#f1f5f9",
      color: SEV_COLORS[sev] || "#475569",
      border: `1px solid ${SEV_BORDER[sev] || "#e2e8f0"}`,
    }}
  >
    {sev}
  </span>
);

// ── Main Component ─────────────────────────────────────────────────────────

const ReportViewer: React.FC<ReportViewerProps> = ({
  assessmentId,
  projectName,
  token,
  apiBase = "",
  onActionPlanSave,
}) => {
  const [activeTab, setActiveTab] = useState<"interactive" | "summary" | "raw">("interactive");
  const [structured, setStructured] = useState<StructuredData | null>(null);
  const [rawMarkdown, setRawMarkdown] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [actionPlanItems, setActionPlanItems] = useState<ActionPlanItem[]>([]);
  const [apSaving, setApSaving] = useState(false);
  const [apSaved, setApSaved] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  // Load structured data + raw report + saved action plan
  useEffect(() => {
    if (!assessmentId) return;
    setLoading(true);

    Promise.all([
      fetch(`${apiBase}/reports/${assessmentId}/structured`, { headers }).then((r) => r.json()),
      fetch(`${apiBase}/reports/${assessmentId}`, { headers }).then((r) => r.json()),
      fetch(`${apiBase}/reports/${assessmentId}/action-plan`, { headers }).then((r) => r.json()),
    ])
      .then(([structuredResp, reportResp, apResp]) => {
        setStructured(structuredResp.structured || null);
        setRawMarkdown(reportResp.report || "");
        setActionPlanItems(apResp.items || []);
      })
      .catch((e) => setError(`Failed to load report: ${e.message}`))
      .finally(() => setLoading(false));
  }, [assessmentId]);

  // Download PDF
  const downloadPdf = useCallback(async () => {
    setPdfLoading(true);
    try {
      const resp = await fetch(`${apiBase}/reports/${assessmentId}/pdf`, { headers });
      if (!resp.ok) throw new Error("PDF generation failed");
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Threat_Assessment_${projectName.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      alert(`PDF download failed: ${e.message}`);
    } finally {
      setPdfLoading(false);
    }
  }, [assessmentId, projectName]);

  // Save action plan
  const saveActionPlan = useCallback(async () => {
    setApSaving(true);
    try {
      await fetch(`${apiBase}/reports/${assessmentId}/action-plan`, {
        method: "POST",
        headers,
        body: JSON.stringify({ items: actionPlanItems }),
      });
      setApSaved(true);
      setTimeout(() => setApSaved(false), 2500);
      onActionPlanSave?.(actionPlanItems);
    } catch (e: any) {
      alert(`Save failed: ${e.message}`);
    } finally {
      setApSaving(false);
    }
  }, [assessmentId, actionPlanItems]);

  const openFullWindow = () => {
    window.open(`${apiBase}/reports/${assessmentId}/interactive`, "_blank");
  };

  // ── Render ──────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={styles.loadingBox}>
        <div style={styles.spinner} />
        <p style={{ color: "#64748b", fontSize: 14, marginTop: 12 }}>
          Loading interactive report…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorBox}>
        <span style={{ fontSize: 24 }}>⚠️</span>
        <p style={{ color: "#dc2626", fontSize: 13, marginTop: 8 }}>{error}</p>
      </div>
    );
  }

  const overall = structured?.overall_risk_rating || "HIGH";
  const totalFindings = structured?.total_findings || 0;
  const sev = structured?.findings_by_severity || { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };

  return (
    <div style={styles.container}>
      {/* ── Header bar ── */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>
            🛡 Threat Assessment Report
          </h2>
          <p style={styles.subtitle}>
            {projectName} ·{" "}
            <span style={{ color: SEV_COLORS[overall] || "#ea580c", fontWeight: 700 }}>
              {overall}
            </span>{" "}
            · {totalFindings} findings
          </p>
        </div>
        <div style={styles.headerActions}>
          <button onClick={openFullWindow} style={styles.btnSecondary}>
            ↗ Full Screen
          </button>
          <button onClick={downloadPdf} disabled={pdfLoading} style={styles.btnPdf}>
            {pdfLoading ? "⏳ Generating…" : "⬇ Download PDF"}
          </button>
        </div>
      </div>

      {/* ── Summary stats ── */}
      <div style={styles.statsRow}>
        {(["CRITICAL", "HIGH", "MEDIUM", "LOW"] as const).map((s) => (
          <div key={s} style={{ ...styles.statCard, borderTop: `3px solid ${SEV_COLORS[s]}` }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: SEV_COLORS[s], lineHeight: 1 }}>
              {sev[s] || 0}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#94a3b8", marginTop: 3, textTransform: "uppercase" }}>
              {s}
            </div>
          </div>
        ))}
        <div style={{ ...styles.statCard, borderTop: "3px solid #2563eb" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#2563eb", lineHeight: 1 }}>
            {structured?.all_findings?.filter((f) => f.priority === "P0").length || 0}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#94a3b8", marginTop: 3, textTransform: "uppercase" }}>
            P0 Immediate
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={styles.tabBar}>
        {(["interactive", "summary", "raw"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.tab,
              ...(activeTab === tab ? styles.tabActive : {}),
            }}
          >
            {tab === "interactive" ? "📊 Interactive Report" : tab === "summary" ? "📋 Findings Summary" : "📄 Raw Report"}
          </button>
        ))}
      </div>

      {/* ── Tab: Interactive (iframe) ── */}
      {activeTab === "interactive" && (
        <div style={styles.iframeWrapper}>
          <iframe
            ref={iframeRef}
            src={`${apiBase}/reports/${assessmentId}/interactive`}
            style={styles.iframe}
            title="Interactive Threat Assessment Report"
            sandbox="allow-scripts allow-same-origin allow-downloads allow-popups"
          />
        </div>
      )}

      {/* ── Tab: Findings Summary ── */}
      {activeTab === "summary" && structured && (
        <div style={styles.summaryWrapper}>
          <div style={styles.summaryHeader}>
            <p style={{ fontSize: 13, color: "#475569" }}>
              <strong>{totalFindings}</strong> findings across{" "}
              <strong>{(structured.frameworks_used || []).join(", ")}</strong>
            </p>
          </div>

          {/* Quick findings table */}
          <div style={styles.tableWrap}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f1f5f9" }}>
                  {["ID", "Finding", "Tactic", "Technique", "Severity", "Score", "Owner", "Timeline"].map((h) => (
                    <th key={h} style={styles.th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(structured.all_findings || []).map((f, i) => (
                  <tr
                    key={f.id}
                    style={{ background: i % 2 === 0 ? "#ffffff" : "#f8f9fb" }}
                  >
                    <td style={{ ...styles.td, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#2563eb", fontWeight: 700 }}>
                      {f.id}
                    </td>
                    <td style={{ ...styles.td, maxWidth: 220 }}>
                      <div style={{ fontWeight: 700, fontSize: 12, color: "#0f172a" }}>{f.title}</div>
                    </td>
                    <td style={{ ...styles.td, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#475569" }}>
                      {f.tactic || "—"}
                    </td>
                    <td style={{ ...styles.td, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
                      {f.technique_id || "—"}
                    </td>
                    <td style={styles.td}>
                      <SeverityPill sev={f.severity} />
                    </td>
                    <td style={{ ...styles.td, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 800, color: SEV_COLORS[f.severity] }}>
                      {f.risk_score}
                    </td>
                    <td style={{ ...styles.td, fontSize: 12, color: "#475569" }}>{f.owner}</td>
                    <td style={{ ...styles.td, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#dc2626", fontWeight: 600 }}>
                      {f.timeline}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Inline Action Plan builder */}
          <div style={{ marginTop: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>
                📋 Quick Action Plan Builder
              </h3>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={saveActionPlan} disabled={apSaving} style={styles.btnSave}>
                  {apSaving ? "Saving…" : apSaved ? "✓ Saved!" : "💾 Save Action Plan"}
                </button>
              </div>
            </div>
            {(structured.all_findings || [])
              .filter((f) => f.priority === "P0" || f.priority === "P1")
              .map((f) => {
                const existing = actionPlanItems.find((a) => a.id === f.id);
                return (
                  <div
                    key={f.id}
                    style={{
                      ...styles.apCard,
                      borderLeft: `3px solid ${f.priority === "P0" ? "#dc2626" : "#ea580c"}`,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#2563eb", fontWeight: 700 }}>
                        {f.id}
                      </span>
                      <SeverityPill sev={f.severity} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", flex: 1 }}>{f.title}</span>
                      <label style={styles.apCheckLabel}>
                        <input
                          type="checkbox"
                          checked={!!existing}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setActionPlanItems((prev) => [
                                ...prev.filter((a) => a.id !== f.id),
                                { id: f.id, assignee: f.owner || "", dueDate: "", status: "Open", notes: "", title: f.title, severity: f.severity, timeline: f.timeline },
                              ]);
                            } else {
                              setActionPlanItems((prev) => prev.filter((a) => a.id !== f.id));
                            }
                          }}
                        />
                        <span style={{ fontSize: 12, color: "#475569", marginLeft: 5 }}>Include</span>
                      </label>
                    </div>
                    {existing && (
                      <div style={styles.apMeta}>
                        <div>
                          <label style={styles.apLabel}>Assignee</label>
                          <input
                            style={styles.apInput}
                            value={existing.assignee}
                            placeholder={f.owner}
                            onChange={(e) =>
                              setActionPlanItems((prev) =>
                                prev.map((a) => (a.id === f.id ? { ...a, assignee: e.target.value } : a))
                              )
                            }
                          />
                        </div>
                        <div>
                          <label style={styles.apLabel}>Due Date</label>
                          <input
                            type="date"
                            style={styles.apInput}
                            value={existing.dueDate}
                            onChange={(e) =>
                              setActionPlanItems((prev) =>
                                prev.map((a) => (a.id === f.id ? { ...a, dueDate: e.target.value } : a))
                              )
                            }
                          />
                        </div>
                        <div>
                          <label style={styles.apLabel}>Status</label>
                          <select
                            style={styles.apInput}
                            value={existing.status}
                            onChange={(e) =>
                              setActionPlanItems((prev) =>
                                prev.map((a) => (a.id === f.id ? { ...a, status: e.target.value } : a))
                              )
                            }
                          >
                            <option>Open</option>
                            <option>In Progress</option>
                            <option>Complete</option>
                            <option>Deferred</option>
                          </select>
                        </div>
                        <div style={{ gridColumn: "1 / -1" }}>
                          <label style={styles.apLabel}>Notes</label>
                          <input
                            style={styles.apInput}
                            value={existing.notes}
                            placeholder="Add notes or blockers…"
                            onChange={(e) =>
                              setActionPlanItems((prev) =>
                                prev.map((a) => (a.id === f.id ? { ...a, notes: e.target.value } : a))
                              )
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            {actionPlanItems.length > 0 && (
              <div style={{ marginTop: 12, padding: "10px 14px", background: "#f0fdf4", borderRadius: 8, border: "1px solid #bbf7d0", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 13, color: "#15803d", fontWeight: 600 }}>
                  ✓ {actionPlanItems.length} item{actionPlanItems.length !== 1 ? "s" : ""} in action plan
                </span>
                <button onClick={saveActionPlan} style={{ ...styles.btnSave, marginLeft: "auto" }}>
                  {apSaving ? "Saving…" : apSaved ? "✓ Saved!" : "💾 Save"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Tab: Raw ── */}
      {activeTab === "raw" && (
        <div style={styles.rawWrapper}>
          <pre style={styles.rawPre}>{rawMarkdown}</pre>
        </div>
      )}
    </div>
  );
};

// ── Styles ─────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: "#f8f9fb",
    borderRadius: 16,
    border: "1px solid #e2e8f0",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(15,23,42,.08)",
    fontFamily: "'Epilogue', 'Inter', sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: "20px 24px 16px",
    background: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    flexWrap: "wrap",
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 800,
    color: "#0f172a",
    letterSpacing: -0.4,
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 4,
  },
  headerActions: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  btnSecondary: {
    padding: "8px 14px",
    borderRadius: 8,
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#475569",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  btnPdf: {
    padding: "8px 16px",
    borderRadius: 8,
    border: "none",
    background: "#0f172a",
    color: "#ffffff",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 1px 3px rgba(15,23,42,.2)",
  },
  btnSave: {
    padding: "7px 14px",
    borderRadius: 8,
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  statsRow: {
    display: "flex",
    gap: 1,
    background: "#e2e8f0",
    borderBottom: "1px solid #e2e8f0",
  },
  statCard: {
    flex: 1,
    textAlign: "center",
    padding: "12px 8px",
    background: "#ffffff",
  },
  tabBar: {
    display: "flex",
    background: "#f1f5f9",
    borderBottom: "1px solid #e2e8f0",
    padding: "6px 16px 0",
    gap: 2,
  },
  tab: {
    padding: "8px 14px",
    border: "1px solid transparent",
    borderBottom: "none",
    background: "transparent",
    color: "#64748b",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    borderRadius: "8px 8px 0 0",
    fontFamily: "inherit",
    transition: "all .15s",
  },
  tabActive: {
    background: "#ffffff",
    color: "#2563eb",
    borderColor: "#e2e8f0",
    borderBottomColor: "#ffffff",
  },
  iframeWrapper: {
    background: "#ffffff",
    height: "100vh",
    maxHeight: "85vh",
    overflow: "hidden",
  },
  iframe: {
    width: "100%",
    height: "100%",
    border: "none",
    display: "block",
  },
  loadingBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    background: "#f8f9fb",
    borderRadius: 16,
  },
  spinner: {
    width: 36,
    height: 36,
    border: "3px solid #e2e8f0",
    borderTop: "3px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  errorBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 20px",
    background: "#fef2f2",
    borderRadius: 12,
    border: "1px solid #fecaca",
  },
  summaryWrapper: {
    padding: "24px 24px",
    background: "#ffffff",
    overflowY: "auto",
    maxHeight: "80vh",
  },
  summaryHeader: {
    marginBottom: 16,
    padding: "12px 16px",
    background: "#f8f9fb",
    borderRadius: 8,
    border: "1px solid #e2e8f0",
  },
  tableWrap: {
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(15,23,42,.06)",
  },
  th: {
    padding: "9px 12px",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 9,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
    color: "#94a3b8",
    textAlign: "left" as const,
    fontWeight: 600,
    whiteSpace: "nowrap" as const,
  },
  td: {
    padding: "10px 12px",
    borderTop: "1px solid #f1f5f9",
    verticalAlign: "middle" as const,
    fontSize: 12,
  },
  apCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    padding: "12px 14px",
    marginBottom: 8,
    boxShadow: "0 1px 2px rgba(15,23,42,.04)",
  },
  apMeta: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 8,
    marginTop: 8,
    paddingTop: 10,
    borderTop: "1px solid #f1f5f9",
  },
  apLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 9,
    color: "#94a3b8",
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
    fontWeight: 600,
    display: "block",
    marginBottom: 3,
  },
  apInput: {
    width: "100%",
    background: "#f8f9fb",
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    padding: "5px 8px",
    fontFamily: "inherit",
    fontSize: 11,
    color: "#0f172a",
    outline: "none",
  },
  apCheckLabel: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    flexShrink: 0,
  },
  rawWrapper: {
    background: "#0f172a",
    maxHeight: "80vh",
    overflow: "auto",
  },
  rawPre: {
    padding: 24,
    margin: 0,
    color: "#e2e8f0",
    fontSize: 12,
    lineHeight: 1.65,
    fontFamily: "'JetBrains Mono', monospace",
    whiteSpace: "pre-wrap" as const,
    wordBreak: "break-word" as const,
  },
};

// Add CSS animation for spinner
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
}

export default ReportViewer;
