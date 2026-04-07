/**
 * ReportViewer.tsx  v4.0 — Professional Enterprise Edition
 */
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";

interface Finding {
  id: string; title: string;
  severity: "CRITICAL"|"HIGH"|"MEDIUM"|"LOW";
  risk_score: number; priority: string; owner: string; timeline: string;
  tactic: string; tactic_id?: string; technique_id: string;
  likelihood?: number; impact?: number; doc_source?: string;
  verbatim_evidence?: string; business_impact?: string; mitigation_steps?: string[];
}
interface KillChainPhase {
  phase: string; technique_id?: string; description?: string;
  doc_evidence?: string; detection_window?: string; mitigation?: string; severity?: string;
}
interface KillChain { id?: string; title: string; risk_score: number; phases: KillChainPhase[]; }
interface Recommendation {
  id?: string; title: string; priority: string; addresses_findings?: string[];
  risk_reduction_pct?: number; effort_weeks?: number; owner?: string;
  target_date?: string; steps?: string[];
}
interface StructuredData {
  overall_risk_rating: string; total_findings: number;
  findings_by_severity: {CRITICAL:number;HIGH:number;MEDIUM:number;LOW:number};
  all_findings: Finding[]; all_recommendations?: Recommendation[];
  kill_chains?: KillChain[]; frameworks_used: string[];
  risk_areas_assessed: string[]; assessment_date: string; project_name?: string;
}
interface ActionPlanItem {
  id: string; title?: string; severity?: string; timeline?: string;
  assignee: string; dueDate: string; status: string; notes: string;
}
interface ReportViewerProps {
  assessmentId: number; projectName: string; token: string;
  apiBase?: string; onActionPlanSave?: (items: ActionPlanItem[]) => void;
}

// ── Design tokens ────────────────────────────────────────────────────────────
const NAVY        = "#0B1E3D";
const NAVY_HOVER  = "#152d54";
const BLUE        = "#1D4ED8";
const BLUE_TINT   = "#EFF6FF";
const BLUE_BORDER = "#BFDBFE";
const PAGE_BG     = "#F0F4F9";

const SEV_COLOR: Record<string,string> = {CRITICAL:"#DC2626",HIGH:"#EA580C",MEDIUM:"#D97706",LOW:"#16A34A"};
const SEV_BG:    Record<string,string> = {CRITICAL:"#FEF2F2",HIGH:"#FFF7ED",MEDIUM:"#FFFBEB",LOW:"#F0FDF4"};
const SEV_BORDER:Record<string,string> = {CRITICAL:"#FECACA",HIGH:"#FED7AA",MEDIUM:"#FDE68A",LOW:"#BBF7D0"};

const MITRE_TACTICS = [
  {id:"TA0001",short:"Initial Access"},{id:"TA0002",short:"Execution"},
  {id:"TA0003",short:"Persistence"},{id:"TA0004",short:"Privilege Esc."},
  {id:"TA0005",short:"Defense Evasion"},{id:"TA0006",short:"Cred. Access"},
  {id:"TA0007",short:"Discovery"},{id:"TA0008",short:"Lateral Move."},
  {id:"TA0009",short:"Collection"},{id:"TA0010",short:"Command & Ctrl"},
  {id:"TA0011",short:"Exfiltration"},{id:"TA0012",short:"Impact"},
];

const PHASE_LABELS: Record<string,string> = {
  "Initial Access":"ACC","Execution":"EXEC","Persistence":"PRST",
  "Privilege Escalation":"PRIV","Defense Evasion":"EVDN","Credential Access":"CRED",
  "Discovery":"DISC","Lateral Movement":"LATR","Collection":"COLL",
  "Command and Control":"C2","Exfiltration":"EXFL","Impact":"IMPT",
  "Weaponize":"WPNZ","Deliver":"DLVR","Exploit":"EXPL","Install":"INST","Cover":"COVR","C2":"C2",
};

const NAV_ITEMS = [
  {id:"exec-summary",  faIcon:"fa-chart-line",     label:"Executive Summary"},
  {id:"overview",      faIcon:"fa-layer-group",     label:"Overview & Scorecard"},
  {id:"attck-map",     faIcon:"fa-crosshairs",      label:"MITRE ATT\u0026CK Map"},
  {id:"kill-chain",    faIcon:"fa-link",             label:"Kill Chain Analysis"},
  {id:"findings",      faIcon:"fa-magnifying-glass", label:"All Findings"},
  {id:"risk-matrix",   faIcon:"fa-table-cells",     label:"Risk Priority Matrix"},
  {id:"recommendations",faIcon:"fa-shield-halved",  label:"Recommendations"},
  {id:"action-plan",   faIcon:"fa-list-check",      label:"Action Plan"},
];

const Pill = ({sev}:{sev:string}) => (
  <span style={{display:"inline-flex",alignItems:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:8,fontWeight:800,padding:"2px 8px",borderRadius:4,textTransform:"uppercase",letterSpacing:0.8,whiteSpace:"nowrap",background:SEV_BG[sev]||"#F1F5F9",color:SEV_COLOR[sev]||"#475569",border:`1px solid ${SEV_BORDER[sev]||"#E2E8F0"}`}}>{sev}</span>
);

const SecHeader = ({num,title,sub}:{num:string;title:string;sub:string}) => (
  <div style={{display:"flex",alignItems:"flex-start",gap:16,marginBottom:28}}>
    <div style={{minWidth:40,height:40,background:NAVY,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:"#fff",flexShrink:0,letterSpacing:-0.5}}>{num}</div>
    <div style={{borderLeft:"3px solid "+BLUE,paddingLeft:14}}>
      <div style={{fontSize:19,fontWeight:800,color:"#0F172A",letterSpacing:-0.5,lineHeight:1.2}}>{title}</div>
      <div style={{fontSize:11.5,color:"#64748B",marginTop:4,fontFamily:"'JetBrains Mono',monospace",letterSpacing:0.1}}>{sub}</div>
    </div>
  </div>
);

function matchTacticId(tactic:string):string {
  if(!tactic) return "";
  const t=tactic.toLowerCase();
  if(t.includes("initial")) return "TA0001";
  if(t.includes("execut")) return "TA0002";
  if(t.includes("persist")) return "TA0003";
  if(t.includes("privilege")||t.includes("escalat")) return "TA0004";
  if(t.includes("defense")||t.includes("evasion")) return "TA0005";
  if(t.includes("credential")) return "TA0006";
  if(t.includes("discover")) return "TA0007";
  if(t.includes("lateral")) return "TA0008";
  if(t.includes("collect")) return "TA0009";
  if(t.includes("command")||t.includes("control")||t.includes("c2")) return "TA0010";
  if(t.includes("exfil")) return "TA0011";
  if(t.includes("impact")) return "TA0012";
  return "";
}


// ─── Section: Executive Summary ──────────────────────────────────────────────

const ExecutiveSummary = ({
  data, projectName, onPrint
}: {
  data: StructuredData;
  projectName: string;
  onPrint: () => void;
}) => {
  const overall = data.overall_risk_rating || "HIGH";
  const sev = data.findings_by_severity || {CRITICAL:0,HIGH:0,MEDIUM:0,LOW:0};
  const findings = data.all_findings || [];
  const recs = data.all_recommendations || [];
  const fw = data.frameworks_used || [];
  const ra = data.risk_areas_assessed || [];
  const top5 = [...findings].sort((a,b)=>b.risk_score-a.risk_score).slice(0,5);
  const top3Recs = recs.filter(r=>r.priority==="P0").slice(0,3);
  const totalRisk = sev.CRITICAL*25 + sev.HIGH*15 + sev.MEDIUM*8 + sev.LOW*3;
  const maxPossible = findings.length * 25;
  const riskPct = maxPossible > 0 ? Math.round((totalRisk/maxPossible)*100) : 0;
  const riskDesc = overall==="CRITICAL"?"Immediate executive action required. Critical vulnerabilities present significant business risk.":overall==="HIGH"?"Significant vulnerabilities require urgent attention within 30 days.":"Moderate risk identified. Address findings per the recommended timeline.";

  return (
    <section id="exec-summary" style={{background:"#fff",borderRadius:16,border:"2px solid #1d4ed8",overflow:"hidden",boxShadow:"0 4px 24px rgba(29,78,216,.15)",scrollMarginTop:16}}>
      {/* ── Executive header ─────────────────────────────────────────── */}
      <div style={{background:`linear-gradient(135deg,${NAVY} 0%,#1e3a5f 60%,${BLUE} 100%)`,padding:"28px 32px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:16,borderRadius:"10px 10px 0 0"}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:2.5,fontWeight:600}}>SECURITY EXECUTIVE BRIEFING</div>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,fontWeight:700,padding:"2px 8px",borderRadius:3,background:"#EF4444",color:"#fff",letterSpacing:0.8}}>CONFIDENTIAL</span>
          </div>
          <h1 style={{fontSize:24,fontWeight:900,color:"#fff",letterSpacing:-0.6,lineHeight:1.2,marginBottom:6}}>Threat Assessment Report</h1>
          <div style={{fontSize:13,color:"rgba(255,255,255,.6)",display:"flex",alignItems:"center",gap:8}}>
            <i className="fas fa-building" style={{fontSize:11}}/>
            {projectName}&nbsp;&middot;&nbsp;{data.assessment_date}
          </div>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
          <div style={{background:"rgba(255,255,255,.08)",border:`1px solid ${SEV_BORDER[overall]}`,borderRadius:10,padding:"12px 22px",textAlign:"center",backdropFilter:"blur(4px)"}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:SEV_COLOR[overall],textTransform:"uppercase",fontWeight:700,letterSpacing:1.5,marginBottom:5}}>Overall Risk</div>
            <div style={{fontSize:22,fontWeight:900,color:SEV_COLOR[overall],letterSpacing:-0.5}}>{overall}</div>
          </div>
          <button onClick={onPrint} style={{padding:"10px 16px",borderRadius:8,border:"1px solid rgba(255,255,255,.2)",background:"rgba(255,255,255,.08)",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:7}}>
            <i className="fas fa-print" style={{fontSize:11}}/>Print One-Pager
          </button>
        </div>
      </div>

      <div style={{padding:"24px 32px"}}>
        {/* Risk banner */}
        <div style={{background:SEV_BG[overall],border:`1px solid ${SEV_BORDER[overall]}`,borderLeft:`4px solid ${SEV_COLOR[overall]}`,borderRadius:8,padding:"12px 18px",display:"flex",gap:14,alignItems:"center",marginBottom:24}}>
          <i className={`fas ${overall==="CRITICAL"?"fa-circle-exclamation":overall==="HIGH"?"fa-triangle-exclamation":"fa-info-circle"}`} style={{fontSize:20,color:SEV_COLOR[overall],flexShrink:0}}/>
          <div style={{flex:1}}>
            <div style={{fontSize:12,fontWeight:800,color:SEV_COLOR[overall],marginBottom:3,textTransform:"uppercase",letterSpacing:0.4}}>{overall} Risk &mdash; {overall==="CRITICAL"?"Immediate Executive Action Required":"Urgent Action Required"}</div>
            <div style={{fontSize:12,color:"#475569",lineHeight:1.5}}>{riskDesc}</div>
          </div>
          <div style={{textAlign:"center",flexShrink:0,background:"#fff",border:`1px solid ${SEV_BORDER[overall]}`,borderRadius:10,padding:"8px 16px"}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:28,fontWeight:900,color:SEV_COLOR[overall]}}>{riskPct}%</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#94a3b8",textTransform:"uppercase"}}>Risk Score</div>
          </div>
        </div>

        {/* 4 severity counters */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
          {(["CRITICAL","HIGH","MEDIUM","LOW"] as const).map((s)=>(
            <div key={s} style={{background:SEV_BG[s],border:`1px solid ${SEV_BORDER[s]}`,borderTop:`3px solid ${SEV_COLOR[s]}`,borderRadius:10,padding:"16px",textAlign:"center"}}>
              <div style={{fontSize:28,fontWeight:900,color:SEV_COLOR[s],lineHeight:1,fontFamily:"'JetBrains Mono',monospace"}}>{sev[s]||0}</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:SEV_COLOR[s],textTransform:"uppercase",fontWeight:700,marginTop:4}}>{s}</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#94a3b8",marginTop:2}}>findings</div>
            </div>
          ))}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:24}}>
          {/* Top 5 findings */}
          <div>
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:12}}>
            <i className="fas fa-magnifying-glass" style={{fontSize:10,color:"#94a3b8"}}/>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#94a3b8",textTransform:"uppercase",fontWeight:600,letterSpacing:0.5}}>Top {top5.length} Priority Findings</span>
          </div>
            <div style={{border:"1px solid #e2e8f0",borderRadius:10,overflow:"hidden"}}>
              {top5.length===0?(
                <div style={{padding:"20px",textAlign:"center",color:"#94a3b8",fontSize:12}}>Run a new assessment to populate findings.</div>
              ):top5.map((f,i)=>(
                <div key={f.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderBottom:i<top5.length-1?"1px solid #f1f5f9":"none",background:i%2===0?"#fff":"#f8f9fb",borderLeft:`3px solid ${SEV_COLOR[f.severity]||"#e2e8f0"}`}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#2563eb",fontWeight:700,flexShrink:0,minWidth:36}}>{f.id}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#0f172a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.title}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#94a3b8",marginTop:1}}>{f.tactic||"—"} · {f.technique_id||"—"}</div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:900,color:SEV_COLOR[f.severity]}}>{f.risk_score}<span style={{fontSize:8,color:"#94a3b8"}}>/25</span></div>
                    <Pill sev={f.severity}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {/* Immediate actions */}
            <div>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10}}>
                <i className="fas fa-bolt" style={{fontSize:10,color:"#94a3b8"}}/>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#94a3b8",textTransform:"uppercase",fontWeight:600,letterSpacing:0.5}}>Immediate Actions (0–30 Days)</span>
              </div>
              {top3Recs.length>0?(
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {top3Recs.map((r,i)=>(
                    <div key={r.id||i} style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,padding:"10px 14px",borderLeft:"4px solid #dc2626",display:"flex",gap:10,alignItems:"flex-start"}}>
                      <div style={{width:20,height:20,borderRadius:"50%",background:"#dc2626",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:9,fontWeight:900,flexShrink:0,marginTop:1}}>{i+1}</div>
                      <div>
                        <div style={{fontSize:11,fontWeight:800,color:"#0f172a",marginBottom:2}}>{r.title}</div>
                        {r.risk_reduction_pct&&<div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#16a34a",fontWeight:600}}>↓ {r.risk_reduction_pct}% risk · {r.effort_weeks||"?"}w · {r.owner||"—"}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              ):(
                <div style={{padding:"12px 14px",background:"#f8f9fb",borderRadius:10,border:"1px solid #e2e8f0",textAlign:"center"}}>
                  <div style={{fontSize:11,color:"#94a3b8"}}>No P0 recommendations in this report.</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#64748b",marginTop:4}}>Run a new assessment to generate action items.</div>
                </div>
              )}
            </div>
            {/* Risk distribution */}
            <div style={{padding:"14px 16px",background:"#f8f9fb",borderRadius:10,border:"1px solid #e2e8f0"}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
                <i className="fas fa-chart-pie" style={{fontSize:9,color:"#94a3b8"}}/>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#94a3b8",textTransform:"uppercase",fontWeight:600}}>Risk Distribution</span>
              </div>
              {(["CRITICAL","HIGH","MEDIUM","LOW"] as const).map(s=>{
                const count=sev[s]||0;
                const pct=findings.length>0?Math.round(count/findings.length*100):0;
                return (
                  <div key={s} style={{marginBottom:7}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,fontWeight:700,color:SEV_COLOR[s]}}>{s}</span>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#94a3b8"}}>{count} ({pct}%)</span>
                    </div>
                    <div style={{height:5,background:"#e2e8f0",borderRadius:3}}>
                      <div style={{height:"100%",width:`${pct}%`,background:SEV_COLOR[s],borderRadius:3}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Scope footer */}
        <div style={{background:"linear-gradient(135deg,#f8f9fb,#f1f5f9)",border:"1px solid #e2e8f0",borderRadius:10,padding:"14px 20px",display:"flex",gap:24,flexWrap:"wrap",justifyContent:"space-between"}}>
          {[["Framework",fw.join(", ")||"—"],["Risk Areas",ra.length>0?`${ra.length}: ${ra.slice(0,2).join(", ")}${ra.length>2?"…":""}` :"—"],["Total Findings",`${findings.length}`],["Assessment Date",data.assessment_date||"—"],["Classification","CONFIDENTIAL"],["Generated By","ThreatVision AI"]].map(([label,val])=>(
            <div key={label}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#94a3b8",textTransform:"uppercase",fontWeight:600,marginBottom:3}}>{label}</div>
              <div style={{fontSize:12,fontWeight:700,color:"#0f172a"}}>{val}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const OverviewSection = ({data,projectName}:{data:StructuredData;projectName:string}) => {
  const overall=data.overall_risk_rating||"HIGH";
  const sev=data.findings_by_severity||{CRITICAL:0,HIGH:0,MEDIUM:0,LOW:0};
  const fw=data.frameworks_used||[];
  const ra=data.risk_areas_assessed||[];
  const p0=(data.all_findings||[]).filter(f=>f.priority==="P0").length;
  const gauge={CRITICAL:95,HIGH:70,MEDIUM:45,LOW:20}[overall]||70;
  return (
    <section id="overview" style={SS.section}>
      <SecHeader num="01" title="Overview & Risk Scorecard" sub={`${projectName} · ${data.assessment_date} · ${fw.join(", ")}`}/>
      <div style={{display:"flex",gap:20,flexWrap:"wrap",marginBottom:24}}>
        <div style={{background:SEV_BG[overall],border:`1px solid ${SEV_BORDER[overall]}`,borderRadius:16,padding:"24px 32px",display:"flex",flexDirection:"column",alignItems:"center",minWidth:160}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:SEV_COLOR[overall],textTransform:"uppercase",fontWeight:700,letterSpacing:1,marginBottom:8}}>Overall Rating</div>
          <div style={{fontSize:32,fontWeight:900,color:SEV_COLOR[overall],letterSpacing:-1}}>{overall}</div>
          <div style={{width:120,height:6,background:"#e2e8f0",borderRadius:3,marginTop:12,overflow:"hidden"}}>
            <div style={{width:`${gauge}%`,height:"100%",background:SEV_COLOR[overall],borderRadius:3}}/>
          </div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#94a3b8",marginTop:8}}>{data.total_findings} total findings</div>
        </div>
        <div style={{display:"flex",gap:8,flex:1,flexWrap:"wrap",alignItems:"stretch"}}>
          {(["CRITICAL","HIGH","MEDIUM","LOW"] as const).map(s=>(
            <div key={s} style={{flex:"1 1 80px",background:"#fff",border:`1px solid ${SEV_BORDER[s]}`,borderTop:`3px solid ${SEV_COLOR[s]}`,borderRadius:12,padding:"14px 12px",textAlign:"center"}}>
              <div style={{fontSize:28,fontWeight:900,color:SEV_COLOR[s],lineHeight:1}}>{sev[s]||0}</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#94a3b8",marginTop:4,textTransform:"uppercase"}}>{s}</div>
            </div>
          ))}
          <div style={{flex:"1 1 80px",background:"#fff",border:"1px solid #bfdbfe",borderTop:"3px solid #2563eb",borderRadius:12,padding:"14px 12px",textAlign:"center"}}>
            <div style={{fontSize:28,fontWeight:900,color:"#2563eb",lineHeight:1}}>{p0}</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#94a3b8",marginTop:4,textTransform:"uppercase"}}>P0 Immediate</div>
          </div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:1,background:"#e2e8f0",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden",marginBottom:24}}>
        {[["Project",projectName],["Frameworks",fw.join(", ")||"—"],["Risk Areas",`${ra.length} assessed`],["Date",data.assessment_date||"—"]].map(([label,val])=>(
          <div key={label} style={{background:"#fff",padding:"12px 16px"}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#94a3b8",textTransform:"uppercase",fontWeight:600,marginBottom:4}}>{label}</div>
            <div style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>{val}</div>
          </div>
        ))}
      </div>
      {/* Tactic scorecards */}
      <div style={{marginTop:8}}>
        <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:12}}>
          <i className="fas fa-shield-halved" style={{fontSize:10,color:"#94a3b8"}}/>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#94a3b8",textTransform:"uppercase",fontWeight:600,letterSpacing:0.5}}>Security Posture by Tactic</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:10}}>
          {Object.entries(
            (data.all_findings||[]).reduce((acc:{[k:string]:{worst:string;count:number}},f)=>{
              const t=f.tactic||"General";
              if(!acc[t]) acc[t]={worst:"LOW",count:0};
              acc[t].count++;
              if(f.severity==="CRITICAL") acc[t].worst="CRITICAL";
              else if(f.severity==="HIGH" && acc[t].worst!=="CRITICAL") acc[t].worst="HIGH";
              else if(f.severity==="MEDIUM" && !["CRITICAL","HIGH"].includes(acc[t].worst)) acc[t].worst="MEDIUM";
              return acc;
            },{})
          ).slice(0,8).map(([tactic,info])=>{
            const infoTyped = info as {worst:string;count:number};
            const grade=infoTyped.worst==="CRITICAL"?"D":infoTyped.worst==="HIGH"?"C":infoTyped.worst==="MEDIUM"?"B":"A";
            const gc=SEV_COLOR[infoTyped.worst]||"#16a34a";
            const gb=SEV_BG[infoTyped.worst]||"#f0fdf4";
            const gborder=SEV_BORDER[infoTyped.worst]||"#bbf7d0";
            return (
              <div key={tactic} style={{background:gb,border:`1px solid ${gborder}`,borderRadius:10,padding:"12px 14px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#0f172a",lineHeight:1.3,flex:1,marginRight:6,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tactic}</div>
                  <div style={{width:26,height:26,borderRadius:7,background:gc,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:900,flexShrink:0}}>{grade}</div>
                </div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:gc,fontWeight:700,textTransform:"uppercase"}}>{infoTyped.worst}</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#94a3b8",marginTop:2}}>{infoTyped.count} finding{infoTyped.count!==1?"s":""}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const AttckMapSection = ({findings,frameworks,onFindingClick}:{findings:Finding[];frameworks:string[];onFindingClick:(f:Finding)=>void}) => {
  const byTactic = useMemo(()=>{
    const map:Record<string,Finding[]>={};
    findings.forEach(f=>{
      const tid=f.tactic_id||matchTacticId(f.tactic);
      if(tid){map[tid]=map[tid]||[];map[tid].push(f);}
    });
    return map;
  },[findings]);
  const covered=Object.keys(byTactic).length;
  const isMitre=frameworks.some(fw=>fw.toUpperCase().includes("MITRE"));
  const tactics=isMitre?MITRE_TACTICS:Array.from(new Map(findings.map(f=>[f.tactic_id||`T-${(f.tactic||"").slice(0,4).toUpperCase()}`,{id:f.tactic_id||`T-${(f.tactic||"").slice(0,4).toUpperCase()}`,short:(f.tactic||"General").slice(0,16)}])).values());

  return (
    <section id="attck-map" style={SS.section}>
      <SecHeader num="02" title="ATT&CK Coverage Map" sub="Techniques identified from your report · Click any cell to open the related finding"/>
      <div style={{overflowX:"auto",paddingBottom:8}}>
        <div style={{display:"flex",gap:8,minWidth:900}}>
          {tactics.map(tactic=>{
            const cells=byTactic[tactic.id]||[];
            return (
              <div key={tactic.id} style={{flex:1,minWidth:90,display:"flex",flexDirection:"column",gap:6}}>
                <div style={{background:"#0f172a",color:"white",borderRadius:8,padding:"8px 6px",textAlign:"center"}}>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"rgba(255,255,255,.55)",marginBottom:2,fontWeight:500}}>{tactic.id}</div>
                  <div style={{fontSize:10,fontWeight:700,lineHeight:1.3}}>{tactic.short}</div>
                </div>
                {cells.length===0?(
                  <div style={{background:"#f1f5f9",borderRadius:7,padding:"7px 8px",textAlign:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#cbd5e1"}}>No findings</div>
                ):cells.slice(0,3).map(f=>(
                  <div key={f.id} onClick={()=>onFindingClick(f)} title={f.title} style={{background:SEV_BG[f.severity],border:`1px solid ${SEV_BORDER[f.severity]}`,borderRadius:7,padding:"7px 8px",cursor:"pointer"}}
                    onMouseOver={e=>{(e.currentTarget as HTMLElement).style.transform="translateY(-2px)";(e.currentTarget as HTMLElement).style.boxShadow="0 4px 12px rgba(15,23,42,.12)"}}
                    onMouseOut={e=>{(e.currentTarget as HTMLElement).style.transform="";(e.currentTarget as HTMLElement).style.boxShadow=""}}
                  >
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,display:"block",marginBottom:2,fontWeight:600,color:SEV_COLOR[f.severity]}}>{f.technique_id||f.id}</span>
                    <span style={{fontSize:10,fontWeight:700,color:"#0f172a",display:"block",lineHeight:1.3,marginBottom:3}}>{f.title.slice(0,28)}{f.title.length>28?"…":""}</span>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,fontWeight:600,color:SEV_COLOR[f.severity]}}>Score: {f.risk_score}/25</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#94a3b8",marginTop:10,textAlign:"right",display:"flex",alignItems:"center",justifyContent:"flex-end",gap:6}}>
        <i className="fas fa-arrows-left-right" style={{fontSize:9}}/>Scroll to view all {tactics.length} tactics&nbsp;&nbsp;|&nbsp;&nbsp;{covered}/{tactics.length} covered&nbsp;&nbsp;|&nbsp;&nbsp;<i className="fas fa-arrow-pointer" style={{fontSize:9}}/>Click cell to open finding
      </div>
    </section>
  );
};

const AttackPathSVG = ({kc}:{kc:KillChain}) => {
  const phases=kc.phases||[];
  if(!phases.length) return null;
  const nodeR=36,gap=110,startX=60;
  const svgW=Math.max(700,startX*2+phases.length*(nodeR*2+gap));
  const score=kc.risk_score||20;
  const scoreColor=score>=20?"#dc2626":score>=12?"#ea580c":"#d97706";
  return (
    <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"16px 20px",boxShadow:"0 1px 3px rgba(15,23,42,.06)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12,flexWrap:"wrap",gap:8}}>
        <div>
          <div style={{fontSize:13,fontWeight:800,color:"#0f172a"}}>{kc.title}</div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#94a3b8",marginTop:2}}>{phases.length} phases sourced directly from your uploaded documentation</div>
        </div>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:20,background:score>=20?"#fef2f2":"#fff7ed",color:scoreColor,border:`1px solid ${score>=20?"#fecaca":"#fed7aa"}`}}>CRITICAL · SCORE {score}/25</span>
      </div>
      <div style={{overflowX:"auto"}}>
        <svg width="100%" viewBox={`0 0 ${svgW} 200`} xmlns="http://www.w3.org/2000/svg" style={{minWidth:700}}>
          <defs>
            <marker id="rv-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M2 1L8 5L2 9" fill="none" stroke={scoreColor} strokeWidth="1.5" strokeLinecap="round"/>
            </marker>
          </defs>
          {phases.map((ph,i)=>{
            const cx=startX+nodeR+i*(nodeR*2+gap),cy=90;
            const sev=(ph.severity||"HIGH");
            const stroke=SEV_COLOR[sev]||scoreColor;
            const fill=SEV_BG[sev]||"#fff7ed";
            const label=PHASE_LABELS[ph.phase]||ph.phase.slice(0,4).toUpperCase();
            const nameShort=ph.phase.slice(0,12)+(ph.phase.length>12?"…":"");
            const techShort=(ph.technique_id||"").slice(0,10);
            const detShort=(ph.detection_window||"").slice(0,14);
            return (
              <g key={i}>
                {i>0&&<line x1={startX+nodeR+(i-1)*(nodeR*2+gap)+nodeR} y1={cy} x2={cx-nodeR-4} y2={cy} stroke={stroke} strokeWidth="1.5" opacity="0.6" markerEnd="url(#rv-arr)"/>}
                <circle cx={cx} cy={cy} r={nodeR} fill="white" stroke={stroke} strokeWidth="2"/>
                <circle cx={cx} cy={cy} r={nodeR-6} fill={fill}/>
                <text x={cx} y={cy+4} textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono, monospace" fontWeight="800" fill={stroke}>{label}</text>
                <text x={cx} y={cy+nodeR+16} textAnchor="middle" fill={stroke} fontSize="9" fontFamily="JetBrains Mono, monospace" fontWeight="600">{nameShort}</text>
                {techShort&&<text x={cx} y={cy+nodeR+27} textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono, monospace">{techShort}</text>}
                {detShort&&<text x={cx} y={cy+nodeR+38} textAnchor="middle" fill={stroke} fontSize="8" fontFamily="JetBrains Mono, monospace" fontWeight="600">{detShort}</text>}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

const KillChainSection = ({killChains}:{killChains:KillChain[]}) => {
  const [active,setActive]=useState(0);
  if(!killChains||!killChains.length) return (
    <section id="kill-chain" style={SS.section}>
      <SecHeader num="03" title="Kill Chain Analysis" sub="No attack scenarios for this assessment"/>
      <div style={{padding:40,textAlign:"center",color:"#94a3b8",fontSize:13,display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
        <i className="fas fa-link" style={{fontSize:24,color:"#CBD5E1"}}/>
        <span>No kill chain data. Run a new assessment.</span>
      </div>
    </section>
  );
  const kc=killChains[active];
  return (
    <section id="kill-chain" style={SS.section}>
      <SecHeader num="03" title="Kill Chain Analysis" sub="Attack scenario phases — sourced directly from document evidence"/>
      {killChains.length>1&&(
        <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
          {killChains.slice(0,3).map((k,i)=>(
            <button key={i} onClick={()=>setActive(i)} style={{padding:"6px 14px",borderRadius:8,border:"1px solid #cbd5e1",background:active===i?"#0f172a":"#fff",color:active===i?"#fff":"#475569",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
              Scenario {i+1}: {k.title.slice(0,40)}{k.title.length>40?"…":""} ({k.risk_score}/25)
            </button>
          ))}
        </div>
      )}
      <AttackPathSVG kc={kc}/>
      <div style={{marginTop:20}}>
        <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10}}>
          <i className="fas fa-list-check" style={{fontSize:9,color:"#94a3b8"}}/>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#94a3b8",textTransform:"uppercase",letterSpacing:0.5,fontWeight:600}}>Phase-by-Phase Analysis with Detection Windows</span>
        </div>
        <div style={{border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden",boxShadow:"0 1px 3px rgba(15,23,42,.06)"}}>
          {(kc.phases||[]).map((ph,i)=>{
            const det=ph.detection_window||"";
            const detColor=det.toLowerCase().match(/second|minute|real-time|immediate/)?"#dc2626":det.toLowerCase().match(/hour|day/)?"#ea580c":"#16a34a";
            return (
              <div key={i} style={{display:"flex",borderBottom:i<kc.phases.length-1?"1px solid #f1f5f9":"none"}}
                onMouseOver={e=>(e.currentTarget.style.background="#f8f9fb")}
                onMouseOut={e=>(e.currentTarget.style.background="")}>
                <div style={{width:40,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,color:"#94a3b8",flexShrink:0,borderRight:"1px solid #f1f5f9",background:"#f8f9fb"}}>{String(i+1).padStart(2,"0")}</div>
                <div style={{width:52,display:"flex",alignItems:"center",justifyContent:"center",borderRight:"1px solid #f1f5f9",flexShrink:0}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,fontWeight:800,padding:"2px 4px",borderRadius:3,background:SEV_BG[ph.severity||"HIGH"],color:SEV_COLOR[ph.severity||"HIGH"],border:`1px solid ${SEV_BORDER[ph.severity||"HIGH"]}`}}>{PHASE_LABELS[ph.phase]||ph.phase.slice(0,4).toUpperCase()}</span>
                </div>
                <div style={{flex:1,padding:"10px 14px"}}>
                  <div style={{fontSize:12,fontWeight:800,color:"#0f172a",marginBottom:2}}>{ph.phase}</div>
                  {ph.technique_id&&<div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#2563eb",fontWeight:600,marginBottom:4}}>{ph.technique_id}</div>}
                  <div style={{fontSize:11,color:"#475569",lineHeight:1.5,marginBottom:ph.doc_evidence?5:0}}>{ph.description}</div>
                  {ph.doc_evidence&&<div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#64748b",background:"#f1f5f9",padding:"3px 7px",borderRadius:4,borderLeft:"2px solid #2563eb",display:"inline-block",marginBottom:4}}>{ph.doc_evidence}</div>}
                  {ph.mitigation&&<div style={{fontSize:10,color:"#475569"}}>↳ {ph.mitigation}</div>}
                </div>
                <div style={{width:110,flexShrink:0,padding:"10px 12px",borderLeft:"1px solid #f1f5f9",display:"flex",flexDirection:"column",gap:4,justifyContent:"center"}}>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#94a3b8",textTransform:"uppercase",fontWeight:600}}>Detection</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,fontWeight:700,color:detColor}}>{det||"—"}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const FindingsSection = ({findings,onFindingClick}:{findings:Finding[];onFindingClick:(f:Finding)=>void}) => {
  const [filter,setFilter]=useState("ALL");
  const [search,setSearch]=useState("");
  const [sortCol,setSortCol]=useState(5);
  const [sortAsc,setSortAsc]=useState(false);
  const sevCount={CRITICAL:0,HIGH:0,MEDIUM:0,LOW:0} as Record<string,number>;
  findings.forEach(f=>{sevCount[f.severity]=(sevCount[f.severity]||0)+1;});
  const filtered=useMemo(()=>{
    let list=findings;
    if(filter!=="ALL") list=list.filter(f=>f.severity===filter);
    if(search){const q=search.toLowerCase();list=list.filter(f=>f.title.toLowerCase().includes(q)||(f.technique_id||"").toLowerCase().includes(q)||(f.owner||"").toLowerCase().includes(q)||(f.tactic||"").toLowerCase().includes(q)||f.id.toLowerCase().includes(q));}
    const cols=["id","title","tactic","technique_id","severity","risk_score","owner","timeline"];
    return [...list].sort((a,b)=>{const av=(a as any)[cols[sortCol]]??"";const bv=(b as any)[cols[sortCol]]??"";const cmp=String(av).localeCompare(String(bv),undefined,{numeric:true});return sortAsc?cmp:-cmp;});
  },[findings,filter,search,sortCol,sortAsc]);
  return (
    <section id="findings" style={SS.section}>
      <SecHeader num="04" title={`All Findings — ${findings.length} Total`} sub="Click any row for evidence, scores &amp; mitigation steps  ·  Sort by column  ·  Filter by severity"/>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12,alignItems:"center"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search findings, techniques, owners…" style={{flex:1,minWidth:200,padding:"8px 12px",border:"1px solid #e2e8f0",borderRadius:8,fontFamily:"inherit",fontSize:12,outline:"none",background:"#f8f9fb"}}/>
        {(["ALL","CRITICAL","HIGH","MEDIUM","LOW"] as const).map(s=>(
          <button key={s} onClick={()=>setFilter(s)} style={{padding:"7px 12px",borderRadius:8,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit",border:filter===s?"none":"1px solid #e2e8f0",background:filter===s?(SEV_COLOR[s]||"#0f172a"):"#fff",color:filter===s?"#fff":"#475569"}}>
            {s==="ALL"?`All (${findings.length})`:`${s} (${sevCount[s]||0})`}
          </button>
        ))}
      </div>
      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#64748b",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span>Showing {filtered.length} of {findings.length} findings</span><span style={{color:"#94a3b8",display:"flex",alignItems:"center",gap:5}}><i className="fas fa-arrow-pointer" style={{fontSize:9}}/>Click any row to view detail</span></div>
      <div style={{border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden",boxShadow:"0 1px 3px rgba(15,23,42,.06)"}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr style={{background:"#f1f5f9"}}>
                {["ID","Finding","Tactic","Technique","Severity","Score","Owner","Timeline"].map((h,i)=>(
                  <th key={h} onClick={()=>{if(sortCol===i)setSortAsc(a=>!a);else{setSortCol(i);setSortAsc(false);}}} style={{padding:"9px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:9,textTransform:"uppercase",letterSpacing:0.5,color:sortCol===i?"#2563eb":"#94a3b8",textAlign:"left",fontWeight:600,whiteSpace:"nowrap",cursor:"pointer",userSelect:"none"}}>
                    {h} {sortCol===i?(sortAsc?"↑":"↓"):"↕"}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((f,i)=>(
                <tr key={f.id} onClick={()=>onFindingClick(f)}
                  style={{background:"#fff",cursor:"pointer",transition:"background .1s",borderLeft:`4px solid ${SEV_COLOR[f.severity]||"#e2e8f0"}`}}
                  onMouseOver={e=>{e.currentTarget.style.background=SEV_BG[f.severity]||"#eff6ff";}}
                  onMouseOut={e=>{e.currentTarget.style.background="#fff";}}>
                  <td style={{padding:"12px 12px",whiteSpace:"nowrap"}}>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#2563eb",fontWeight:800}}>{f.id}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#94a3b8",marginTop:2}}>{f.priority}</div>
                  </td>
                  <td style={{padding:"12px 12px",maxWidth:260}}>
                    <div style={{fontWeight:800,fontSize:12,color:"#0f172a",lineHeight:1.3,marginBottom:3}}>{f.title}</div>
                    {f.verbatim_evidence&&<div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#64748b",fontStyle:"italic",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:240}}>"{f.verbatim_evidence.slice(0,60)}{f.verbatim_evidence.length>60?"…":""}"</div>}
                  </td>
                  <td style={{padding:"12px 12px"}}>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#475569",fontWeight:600,background:"#f1f5f9",padding:"2px 6px",borderRadius:4,display:"inline-block",whiteSpace:"nowrap"}}>{f.tactic||"—"}</div>
                  </td>
                  <td style={{padding:"12px 12px"}}>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#2563eb",fontWeight:700,background:"#eff6ff",padding:"2px 6px",borderRadius:4,border:"1px solid #bfdbfe",display:"inline-block"}}>{f.technique_id||"—"}</div>
                  </td>
                  <td style={{padding:"12px 12px"}}><Pill sev={f.severity}/></td>
                  <td style={{padding:"12px 12px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{width:32,height:32,borderRadius:"50%",background:SEV_BG[f.severity],border:`2px solid ${SEV_COLOR[f.severity]}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:900,color:SEV_COLOR[f.severity],flexShrink:0}}>{f.risk_score}</div>
                      <div style={{flex:1,minWidth:40}}>
                        <div style={{height:4,background:"#f1f5f9",borderRadius:2,overflow:"hidden"}}>
                          <div style={{height:"100%",width:`${(f.risk_score/25)*100}%`,background:SEV_COLOR[f.severity],borderRadius:2}}/>
                        </div>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:"#94a3b8",marginTop:1}}>/25</div>
                      </div>
                    </div>
                  </td>
                  <td style={{padding:"12px 12px",fontSize:11,color:"#475569",fontWeight:600}}>{f.owner||"—"}</td>
                  <td style={{padding:"12px 12px"}}>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,fontWeight:700,
                      color:f.timeline&&(f.timeline.includes("0-30")||f.timeline.includes("Immediate"))?"#dc2626":f.timeline&&f.timeline.includes("30-90")?"#ea580c":"#d97706",
                      background:f.timeline&&(f.timeline.includes("0-30")||f.timeline.includes("Immediate"))?"#fef2f2":f.timeline&&f.timeline.includes("30-90")?"#fff7ed":"#fffbeb",
                      padding:"3px 7px",borderRadius:6,border:"1px solid #fde68a",whiteSpace:"nowrap",display:"inline-block"}}>{f.timeline||"—"}</div>
                  </td>
                </tr>
                            ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

const RiskMatrixSection = ({findings}:{findings:Finding[]}) => {
  const GRID=[5,4,3,2,1];
  const cellF=(l:number,imp:number)=>findings.filter(f=>(f.likelihood||3)===l&&(f.impact||3)===imp);
  const cellC=(l:number,imp:number)=>{const s=l*imp;if(s>=20)return{bg:"#fef2f2",b:"#fecaca",c:"#dc2626"};if(s>=12)return{bg:"#fff7ed",b:"#fed7aa",c:"#ea580c"};if(s>=6)return{bg:"#fffbeb",b:"#fde68a",c:"#d97706"};return{bg:"#f0fdf4",b:"#bbf7d0",c:"#16a34a"};};
  return (
    <section id="risk-matrix" style={SS.section}>
      <SecHeader num="05" title="Risk Priority Matrix" sub="Findings plotted by Likelihood × Impact"/>
      <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:320}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <div style={{width:30}}/>
            {[1,2,3,4,5].map(i=><div key={i} style={{flex:1,textAlign:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#94a3b8",fontWeight:600}}>I={i}</div>)}
          </div>
          {GRID.map(l=>(
            <div key={l} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <div style={{width:30,fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#94a3b8",fontWeight:600,textAlign:"right"}}>L={l}</div>
              {[1,2,3,4,5].map(imp=>{
                const cell=cellF(l,imp);const {bg,b,c}=cellC(l,imp);
                return (
                  <div key={imp} style={{flex:1,aspectRatio:"1",background:bg,border:`1px solid ${b}`,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",minHeight:40,flexDirection:"column"}}>
                    {cell.length>0?(<><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:900,color:c}}>{cell.length}</div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:"#94a3b8"}}>{l*imp}</div></>):(<div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#e2e8f0"}}>{l*imp}</div>)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div style={{minWidth:160}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#94a3b8",textTransform:"uppercase",fontWeight:600,marginBottom:12}}>Risk Zones</div>
          {[{label:"CRITICAL (20-25)",bg:"#fef2f2",b:"#fecaca",c:"#dc2626"},{label:"HIGH (12-19)",bg:"#fff7ed",b:"#fed7aa",c:"#ea580c"},{label:"MEDIUM (6-11)",bg:"#fffbeb",b:"#fde68a",c:"#d97706"},{label:"LOW (1-5)",bg:"#f0fdf4",b:"#bbf7d0",c:"#16a34a"}].map(z=>(
            <div key={z.label} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <div style={{width:16,height:16,background:z.bg,border:`1px solid ${z.b}`,borderRadius:4}}/>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:600,color:z.c}}>{z.label}</div>
            </div>
          ))}
          <div style={{marginTop:16,padding:"10px 14px",background:"#f8f9fb",borderRadius:8,border:"1px solid #e2e8f0"}}>
            {(["CRITICAL","HIGH","MEDIUM","LOW"] as const).map(s=>{
              const count=findings.filter(f=>f.severity===s).length;
              const pct=findings.length>0?Math.round(count/findings.length*100):0;
              return (
                <div key={s} style={{marginBottom:6}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,fontWeight:700,color:SEV_COLOR[s]}}>{s}</span>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#94a3b8"}}>{count}</span>
                  </div>
                  <div style={{height:4,background:"#f1f5f9",borderRadius:2}}>
                    <div style={{height:"100%",width:`${pct}%`,background:SEV_COLOR[s],borderRadius:2}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const RecCard = ({rec}:{rec:Recommendation}) => {
  const [open,setOpen]=useState(false);
  const pc={P0:"#dc2626",P1:"#ea580c",P2:"#d97706"}[rec.priority]||"#64748b";
  const pb={P0:"#fef2f2",P1:"#fff7ed",P2:"#fffbeb"}[rec.priority]||"#f1f5f9";
  return (
    <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,borderLeft:`4px solid ${pc}`,boxShadow:"0 1px 3px rgba(15,23,42,.06)",overflow:"hidden"}}>
      <div onClick={()=>setOpen(o=>!o)} style={{padding:"14px 18px",cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:6,background:pb,color:pc,flexShrink:0}}>{rec.priority}</span>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:800,color:"#0f172a"}}>{rec.title}</div>
          <div style={{fontSize:11,color:"#64748b",marginTop:2}}>
            {rec.risk_reduction_pct&&<span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:600,color:"#16a34a"}}>{rec.risk_reduction_pct}% risk reduction</span>}
            {rec.effort_weeks&&<span style={{color:"#94a3b8"}}> · {rec.effort_weeks}w effort</span>}
            {rec.owner&&<span style={{color:"#94a3b8"}}> · {rec.owner}</span>}
          </div>
        </div>
        <i className={`fas ${open?"fa-chevron-up":"fa-chevron-down"}`} style={{color:"#94a3b8",fontSize:11}}/>
      </div>
      {open&&(rec.steps||[]).length>0&&(
        <div style={{padding:"0 18px 14px",borderTop:"1px solid #f1f5f9"}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#94a3b8",textTransform:"uppercase",fontWeight:600,margin:"12px 0 8px"}}>Implementation Steps</div>
          <ol style={{margin:0,paddingLeft:18}}>
            {(rec.steps||[]).map((s,i)=><li key={i} style={{fontSize:12,color:"#475569",marginBottom:5,lineHeight:1.5}}>{s}</li>)}
          </ol>
          {(rec.addresses_findings||[]).length>0&&(
            <div style={{marginTop:10,display:"flex",gap:6,flexWrap:"wrap"}}>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#94a3b8",fontWeight:600}}>Addresses:</span>
              {rec.addresses_findings!.map(fid=><span key={fid} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,fontWeight:700,color:"#2563eb",background:"#eff6ff",padding:"2px 6px",borderRadius:4,border:"1px solid #bfdbfe"}}>{fid}</span>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const RecommendationsSection = ({recs}:{recs:Recommendation[]}) => {
  const [ap,setAp]=useState("P0");
  const p0=recs.filter(r=>r.priority==="P0"),p1=recs.filter(r=>r.priority==="P1"),p2=recs.filter(r=>r.priority==="P2");
  const shown=ap==="P0"?p0:ap==="P1"?p1:p2;
  return (
    <section id="recommendations" style={SS.section}>
      <SecHeader num="06" title="Prioritized Recommendations" sub="Ordered by risk reduction potential · Click to expand steps"/>
      <div style={{display:"flex",gap:6,marginBottom:16}}>
        {[["P0",p0.length,"#dc2626"],["P1",p1.length,"#ea580c"],["P2",p2.length,"#d97706"]].map(([pri,count,color])=>(
          <button key={pri as string} onClick={()=>setAp(pri as string)} style={{padding:"8px 16px",borderRadius:8,border:"1px solid #e2e8f0",background:ap===pri?color as string:"#fff",color:ap===pri?"#fff":"#475569",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
            {pri} — {count} item{(count as number)!==1?"s":""}
          </button>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {shown.length===0&&<div style={{padding:32,textAlign:"center",color:"#94a3b8",fontSize:13,display:"flex",flexDirection:"column",alignItems:"center",gap:10}}><i className="fas fa-shield-halved" style={{fontSize:24,color:"#CBD5E1"}}/><span>No {ap} recommendations generated.</span></div>}
        {shown.map((r,i)=><RecCard key={r.id||i} rec={r}/>)}
      </div>
    </section>
  );
};

const ActionPlanSection = ({findings,items,setItems,onSave,saving,saved}:{findings:Finding[];items:ActionPlanItem[];setItems:React.Dispatch<React.SetStateAction<ActionPlanItem[]>>;onSave:()=>void;saving:boolean;saved:boolean}) => {
  const p0p1=findings.filter(f=>f.priority==="P0"||f.priority==="P1");
  const toggle=(f:Finding,checked:boolean)=>{
    if(checked)setItems(prev=>[...prev.filter(a=>a.id!==f.id),{id:f.id,title:f.title,severity:f.severity,timeline:f.timeline,assignee:f.owner||"",dueDate:"",status:"Open",notes:""}]);
    else setItems(prev=>prev.filter(a=>a.id!==f.id));
  };
  const update=(id:string,field:keyof ActionPlanItem,value:string)=>setItems(prev=>prev.map(a=>a.id===id?{...a,[field]:value}:a));
  const sc:Record<string,string>={"Open":"#dc2626","In Progress":"#ea580c","Complete":"#16a34a","Deferred":"#94a3b8"};
  return (
    <section id="action-plan" style={SS.section}>
      <SecHeader num="07" title="Action Plan Builder" sub="Select findings  ·  Assign owners  ·  Set due dates  ·  Track status"/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{fontSize:13,color:"#475569"}}><strong>{items.length}</strong> item{items.length!==1?"s":""} in action plan</div>
        <button onClick={onSave} disabled={saving} style={{padding:"8px 18px",borderRadius:8,border:"none",background:saved?"#16a34a":"#2563eb",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
          {saving?<><i className="fas fa-circle-notch fa-spin" style={{fontSize:11}}/>Saving…</>:saved?<><i className="fas fa-check" style={{fontSize:11}}/>Saved!</>:<><i className="fas fa-floppy-disk" style={{fontSize:11}}/>Save Action Plan</>}
        </button>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {p0p1.map(f=>{
          const ex=items.find(a=>a.id===f.id);
          const pc=f.priority==="P0"?"#dc2626":"#ea580c";
          return (
            <div key={f.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,borderLeft:`4px solid ${pc}`,boxShadow:"0 1px 2px rgba(15,23,42,.04)"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px"}}>
                <input type="checkbox" checked={!!ex} onChange={e=>toggle(f,e.target.checked)} style={{width:16,height:16,cursor:"pointer",accentColor:"#2563eb"}}/>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#2563eb",fontWeight:700}}>{f.id}</span>
                <Pill sev={f.severity}/>
                <span style={{fontSize:13,fontWeight:700,color:"#0f172a",flex:1}}>{f.title}</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#94a3b8"}}>{f.timeline}</span>
                {ex&&<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:10,color:sc[ex.status]||"#94a3b8",background:"#f8f9fb",border:"1px solid #e2e8f0"}}>{ex.status}</span>}
              </div>
              {ex&&(
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,padding:"0 16px 14px",borderTop:"1px solid #f8f9fb"}}>
                  {[{l:"Assignee",f:"assignee" as keyof ActionPlanItem,p:f.owner,t:"text"},{l:"Due Date",f:"dueDate" as keyof ActionPlanItem,p:"",t:"date"}].map(({l,f:field,p,t})=>(
                    <div key={field}>
                      <label style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#94a3b8",textTransform:"uppercase",fontWeight:600,display:"block",marginBottom:4,marginTop:10}}>{l}</label>
                      <input type={t} value={ex[field] as string} placeholder={p} onChange={e=>update(f.id,field,e.target.value)} style={{width:"100%",background:"#f8f9fb",border:"1px solid #e2e8f0",borderRadius:6,padding:"6px 8px",fontFamily:"inherit",fontSize:11,color:"#0f172a",outline:"none",boxSizing:"border-box"}}/>
                    </div>
                  ))}
                  <div>
                    <label style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#94a3b8",textTransform:"uppercase",fontWeight:600,display:"block",marginBottom:4,marginTop:10}}>Status</label>
                    <select value={ex.status} onChange={e=>update(f.id,"status",e.target.value)} style={{width:"100%",background:"#f8f9fb",border:"1px solid #e2e8f0",borderRadius:6,padding:"6px 8px",fontFamily:"inherit",fontSize:11,color:"#0f172a",outline:"none"}}>
                      {["Open","In Progress","Complete","Deferred"].map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div style={{gridColumn:"1 / -1"}}>
                    <label style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#94a3b8",textTransform:"uppercase",fontWeight:600,display:"block",marginBottom:4}}>Notes</label>
                    <input value={ex.notes} placeholder="Add notes or blockers…" onChange={e=>update(f.id,"notes",e.target.value)} style={{width:"100%",background:"#f8f9fb",border:"1px solid #e2e8f0",borderRadius:6,padding:"6px 8px",fontFamily:"inherit",fontSize:11,color:"#0f172a",outline:"none",boxSizing:"border-box"}}/>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

const FindingModal = ({finding,onClose,onAddToActionPlan}:{finding:Finding;onClose:()=>void;onAddToActionPlan:(f:Finding)=>void}) => (
  <div onClick={e=>{if(e.target===e.currentTarget)onClose();}} style={{position:"fixed",inset:0,background:"rgba(15,23,42,.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20}}>
    <div style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:600,maxHeight:"85vh",overflow:"auto",boxShadow:"0 24px 64px rgba(15,23,42,.25)"}}>
      <div style={{padding:"20px 24px 16px",borderBottom:"1px solid #f1f5f9",position:"sticky",top:0,background:"#fff",zIndex:1}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#2563eb",fontWeight:700}}>{finding.id}</span>
            <Pill sev={finding.severity}/>
          </div>
          <button onClick={onClose} style={{width:28,height:28,borderRadius:8,border:"1px solid #e2e8f0",background:"#f8f9fb",cursor:"pointer",fontSize:12,color:"#475569",display:"flex",alignItems:"center",justifyContent:"center"}}><i className="fas fa-xmark"/></button>
        </div>
        <h3 style={{fontSize:16,fontWeight:800,color:"#0f172a",marginTop:8,lineHeight:1.3}}>{finding.title}</h3>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#94a3b8",marginTop:4}}>{finding.tactic} · {finding.technique_id} · {finding.doc_source}</div>
      </div>
      <div style={{padding:"20px 24px"}}>
        {finding.verbatim_evidence&&(
          <div style={{marginBottom:20}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#94a3b8",textTransform:"uppercase",fontWeight:600,marginBottom:8}}>Document Evidence</div>
            <div style={{background:"#f8f9fb",border:"1px solid #e2e8f0",borderLeft:"3px solid #2563eb",borderRadius:8,padding:"12px 16px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#475569",lineHeight:1.6}}>"{finding.verbatim_evidence}"</div>
          </div>
        )}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12,marginBottom:20}}>
          {[["Likelihood",`${finding.likelihood||"—"} / 5`],["Impact",`${finding.impact||"—"} / 5`],["Risk Score",`${finding.risk_score} / 25`],["Priority",finding.priority]].map(([l,v])=>(
            <div key={l} style={{background:"#f8f9fb",borderRadius:8,padding:"10px 12px",border:"1px solid #e2e8f0"}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#94a3b8",textTransform:"uppercase",fontWeight:600,marginBottom:4}}>{l}</div>
              <div style={{fontSize:15,fontWeight:900,color:SEV_COLOR[finding.severity]||"#475569"}}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
          {[["Owner",finding.owner||"—"],["Timeline",finding.timeline||"—"]].map(([l,v])=>(
            <div key={l} style={{background:"#f8f9fb",borderRadius:8,padding:"10px 12px",border:"1px solid #e2e8f0"}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#94a3b8",textTransform:"uppercase",fontWeight:600,marginBottom:4}}>{l}</div>
              <div style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>{v}</div>
            </div>
          ))}
        </div>
        {finding.business_impact&&(
          <div style={{marginBottom:20}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#94a3b8",textTransform:"uppercase",fontWeight:600,marginBottom:8}}>Business Impact</div>
            <p style={{fontSize:13,color:"#475569",lineHeight:1.6,margin:0}}>{finding.business_impact}</p>
          </div>
        )}
        {(finding.mitigation_steps||[]).length>0&&(
          <div style={{marginBottom:20}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#94a3b8",textTransform:"uppercase",fontWeight:600,marginBottom:8}}>Recommended Mitigation Steps</div>
            <ol style={{margin:0,paddingLeft:18}}>
              {(finding.mitigation_steps||[]).map((s,i)=><li key={i} style={{fontSize:12,color:"#475569",marginBottom:6,lineHeight:1.5}}>{s}</li>)}
            </ol>
          </div>
        )}
        <button onClick={()=>{onAddToActionPlan(finding);onClose();}} style={{width:"100%",padding:"12px",borderRadius:8,border:"none",background:BLUE,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <i className="fas fa-plus" style={{fontSize:11}}/>Add to Action Plan
        </button>
      </div>
    </div>
  </div>
);

const SS:Record<string,React.CSSProperties> = {
  section:{background:"#ffffff",borderRadius:12,border:"1px solid #E2E8F0",padding:"32px",boxShadow:"0 2px 10px rgba(11,30,61,.07)",scrollMarginTop:16},
};

// ─── Main Component ────────────────────────────────────────────────────────────

const ReportViewer:React.FC<ReportViewerProps> = ({assessmentId,projectName,token,apiBase="",onActionPlanSave}) => {
  const [structured,setStructured]=useState<StructuredData|null>(null);
  const [rawMarkdown,setRawMarkdown]=useState("");
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState<string|null>(null);
  const [pdfLoading,setPdfLoading]=useState(false);
  const [actionPlanItems,setActionPlanItems]=useState<ActionPlanItem[]>([]);
  const [apSaving,setApSaving]=useState(false);
  const [apSaved,setApSaved]=useState(false);
  const [activeSection,setActiveSection]=useState("exec-summary");
  const [selectedFinding,setSelectedFinding]=useState<Finding|null>(null);
  const [activeView,setActiveView]=useState<"report"|"raw">("report");
  const [printMode,setPrintMode]=useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const tok=token||localStorage.getItem("token")||localStorage.getItem("access_token")||"";
  const headers={Authorization:`Bearer ${tok}`,"Content-Type":"application/json"};

  useEffect(()=>{
    if(!assessmentId) return;
    setLoading(true);
    Promise.all([
      fetch(`${apiBase}/reports/${assessmentId}/structured`,{headers}).then(r=>r.json()),
      fetch(`${apiBase}/reports/${assessmentId}`,{headers}).then(r=>r.json()),
      fetch(`${apiBase}/reports/${assessmentId}/action-plan`,{headers}).then(r=>r.json()),
    ])
    .then(([sr,rr,ar])=>{setStructured(sr.structured||null);setRawMarkdown(rr.report||"");setActionPlanItems(ar.items||[]);})
    .catch(e=>setError(`Failed to load report: ${e.message}`))
    .finally(()=>{
      setLoading(false);
      setActiveSection("exec-summary");
      // Always start at top so Executive Summary is visible first
      setTimeout(()=>{
        if(scrollContainerRef.current){
          scrollContainerRef.current.scrollTop=0;
        }
      }, 150);
    });
  },[assessmentId]);

  useEffect(()=>{
    // Delay observer setup so it doesn't override the initial exec-summary scroll
    let obs:IntersectionObserver;
    const timer=setTimeout(()=>{
      const root=scrollContainerRef.current||null;
      if(!root) return;
      obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)setActiveSection(e.target.id);}),{root,threshold:0.2,rootMargin:"-5% 0px -60% 0px"});
      NAV_ITEMS.forEach(item=>{const el=document.getElementById(item.id);if(el)obs.observe(el);});
    },600);
    return ()=>{clearTimeout(timer);obs?.disconnect();};
  },[structured]);

  const downloadPdf=useCallback(async()=>{
    setPdfLoading(true);
    try{
      const resp=await fetch(`${apiBase}/reports/${assessmentId}/pdf`,{headers});
      if(!resp.ok) throw new Error("PDF generation failed");
      const blob=await resp.blob();
      const url=URL.createObjectURL(blob);
      const a=document.createElement("a");a.href=url;
      a.download=`Threat_Assessment_${projectName.replace(/\s+/g,"_")}_${new Date().toISOString().slice(0,10)}.pdf`;
      a.click();URL.revokeObjectURL(url);
    }catch(e:any){alert(`PDF download failed: ${e.message}`);}
    finally{setPdfLoading(false);}
  },[assessmentId,projectName]);

  const saveActionPlan=useCallback(async()=>{
    setApSaving(true);
    try{
      await fetch(`${apiBase}/reports/${assessmentId}/action-plan`,{method:"POST",headers,body:JSON.stringify({items:actionPlanItems})});
      setApSaved(true);setTimeout(()=>setApSaved(false),2500);
      onActionPlanSave?.(actionPlanItems);
    }catch(e:any){alert(`Save failed: ${e.message}`);}
    finally{setApSaving(false);}
  },[assessmentId,actionPlanItems]);

  const printExecSummary = useCallback(() => {
    const el = document.getElementById("exec-summary");
    if (!el) return;
    const w = window.open("", "_blank", "width=900,height=700");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>${projectName} — Executive Summary</title>
      <link href="https://fonts.googleapis.com/css2?family=Epilogue:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Epilogue',sans-serif;background:#fff;padding:0;}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}</style>
      </head><body>${el.outerHTML}</body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 800);
  }, [projectName]);

  const addToActionPlan=useCallback((f:Finding)=>{
    setActionPlanItems(prev=>[...prev.filter(a=>a.id!==f.id),{id:f.id,title:f.title,severity:f.severity,timeline:f.timeline,assignee:f.owner||"",dueDate:"",status:"Open",notes:""}]);
    const container=scrollContainerRef.current;
    const el=document.getElementById("action-plan");
    if(container&&el){
      const containerRect=container.getBoundingClientRect();
      const elRect=el.getBoundingClientRect();
      const offset=elRect.top-containerRect.top+container.scrollTop-16;
      container.scrollTo({top:offset,behavior:"smooth"});
    }
  },[]);

  if(loading) return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"80px 20px",background:"#F0F4F9",borderRadius:12,border:"1px solid #E2E8F0"}}>
      <div style={{width:36,height:36,border:"3px solid #E2E8F0",borderTop:`3px solid ${BLUE}`,borderRadius:"50%",animation:"rv-spin 0.8s linear infinite"}}/>
      <p style={{color:"#475569",fontSize:13,marginTop:16,fontFamily:"'JetBrains Mono',monospace",letterSpacing:0.3}}>Loading assessment report…</p>
      <style>{`@keyframes rv-spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );

  if(error) return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"40px 20px",background:"#FEF2F2",borderRadius:12,border:"1px solid #FECACA"}}>
      <i className="fas fa-triangle-exclamation" style={{fontSize:20,color:"#DC2626"}}/>
      <p style={{color:"#DC2626",fontSize:13,marginTop:10,fontWeight:600}}>{error}</p>
    </div>
  );

  const overall=structured?.overall_risk_rating||"HIGH";
  const sev=structured?.findings_by_severity||{CRITICAL:0,HIGH:0,MEDIUM:0,LOW:0};
  const findings=structured?.all_findings||[];
  const recs=structured?.all_recommendations||[];
  const killChains=structured?.kill_chains||[];
  const fw=structured?.frameworks_used||[];

  return (
    <div style={{fontFamily:"'Epilogue','Inter',sans-serif",background:PAGE_BG}}>
      <style>{`@keyframes rv-spin{to{transform:rotate(360deg);}}*{box-sizing:border-box;}@media print{nav,button,.no-print{display:none!important;}}`}</style>

      {/* ── Action bar (slim — title already shown by parent) ──────────── */}
      <div style={{background:`${NAVY}`,borderRadius:"12px 12px 0 0",padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        {/* Left: project meta */}
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:3,background:"#EF4444",color:"#fff",letterSpacing:0.8}}>CONFIDENTIAL</span>
          <span style={{fontSize:12,color:"rgba(255,255,255,.6)"}}>{projectName}&nbsp;&middot;&nbsp;<span style={{color:SEV_COLOR[overall]||"#EA580C",fontWeight:700}}>{overall} RISK</span>&nbsp;&middot;&nbsp;{findings.length} findings</span>
        </div>
        {/* Right: severity chips + actions */}
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <div style={{display:"flex",gap:4,marginRight:4}}>
            {(["CRITICAL","HIGH","MEDIUM","LOW"] as const).map(s=>(
              <div key={s} style={{textAlign:"center",padding:"3px 9px",borderRadius:6,background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.12)"}}>
                <div style={{fontSize:13,fontWeight:900,color:SEV_COLOR[s],lineHeight:1}}>{sev[s]||0}</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:"rgba(255,255,255,.45)",textTransform:"uppercase",marginTop:1}}>{s.slice(0,4)}</div>
              </div>
            ))}
          </div>
          <button onClick={()=>setActiveView(v=>v==="report"?"raw":"report")} style={{padding:"7px 13px",borderRadius:7,border:"1px solid rgba(255,255,255,.2)",background:"rgba(255,255,255,.08)",color:"rgba(255,255,255,.85)",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:6}}>
            <i className={`fas ${activeView==="report"?"fa-code":"fa-chart-bar"}`} style={{fontSize:11}}/>
            {activeView==="report"?"Raw Markdown":"Interactive Report"}
          </button>
          <button onClick={downloadPdf} disabled={pdfLoading} style={{padding:"7px 15px",borderRadius:7,border:"none",background:BLUE,color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:6,opacity:pdfLoading?0.7:1}}>
            <i className={`fas ${pdfLoading?"fa-circle-notch fa-spin":"fa-download"}`} style={{fontSize:11}}/>
            {pdfLoading?"Generating PDF…":"Download PDF"}
          </button>
        </div>
      </div>

      {activeView==="raw"?(
        <div style={{background:"#0F172A",maxHeight:"80vh",overflow:"auto",borderRadius:"0 0 12px 12px"}}>
          <pre style={{padding:28,margin:0,color:"#E2E8F0",fontSize:12,lineHeight:1.7,fontFamily:"'JetBrains Mono',monospace",whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{rawMarkdown}</pre>
        </div>
      ):(
        <div style={{display:"flex",background:PAGE_BG}}>
          {/* ── Left sidebar ────────────────────────────────────────────── */}
          <nav style={{width:220,flexShrink:0,background:NAVY,padding:"20px 0",position:"sticky",top:64,height:"calc(100vh - 210px)",overflowY:"auto",display:"flex",flexDirection:"column"}}>
            {/* Section label */}
            <div style={{padding:"0 16px 14px",fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"rgba(255,255,255,.3)",textTransform:"uppercase",fontWeight:600,letterSpacing:1.2}}>Report Sections</div>
            {NAV_ITEMS.map(item=>{
              const isActive=activeSection===item.id;
              return (
              <a key={item.id} href={`#${item.id}`}
                onClick={e=>{
  e.preventDefault();
  const container=scrollContainerRef.current;
  const el=document.getElementById(item.id);
  if(container){
    if(item.id==="exec-summary"){
      container.scrollTo({top:0,behavior:"smooth"});
    } else if(el){
      const containerRect=container.getBoundingClientRect();
      const elRect=el.getBoundingClientRect();
      const offset=elRect.top-containerRect.top+container.scrollTop-16;
      container.scrollTo({top:offset,behavior:"smooth"});
    }
  }
  setActiveSection(item.id);
}}
                style={{display:"flex",alignItems:"center",gap:10,padding:"9px 16px 9px 0",fontSize:12,fontWeight:600,textDecoration:"none",transition:"all .12s",color:isActive?"#fff":"rgba(255,255,255,.5)",background:isActive?"rgba(29,78,216,.25)":"transparent",borderLeft:isActive?`3px solid ${BLUE}`:"3px solid transparent",paddingLeft:13}}>
                <i className={`fas ${item.faIcon}`} style={{fontSize:12,width:16,textAlign:"center",color:isActive?BLUE:"rgba(255,255,255,.35)",flexShrink:0}}/>
                <span style={{flex:1,fontSize:11.5}}>{item.label}</span>
                {item.id==="findings"&&findings.length>0&&<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,fontWeight:700,padding:"1px 6px",borderRadius:3,background:"rgba(220,38,38,.3)",color:"#FCA5A5",border:"1px solid rgba(220,38,38,.4)",marginRight:8}}>{findings.length}</span>}
                {item.id==="action-plan"&&actionPlanItems.length>0&&<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,fontWeight:700,padding:"1px 6px",borderRadius:3,background:"rgba(29,78,216,.4)",color:"#93C5FD",border:"1px solid rgba(29,78,216,.5)",marginRight:8}}>{actionPlanItems.length}</span>}
                {item.id==="recommendations"&&recs.length>0&&<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,fontWeight:700,padding:"1px 6px",borderRadius:3,background:"rgba(22,163,74,.25)",color:"#86EFAC",border:"1px solid rgba(22,163,74,.4)",marginRight:8}}>{recs.length}</span>}
              </a>
            );})}
            {/* Sidebar footer */}
            <div style={{marginTop:"auto",padding:"16px",borderTop:"1px solid rgba(255,255,255,.06)"}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"rgba(255,255,255,.25)",lineHeight:1.8,letterSpacing:0.2}}>
                {projectName}<br/>{structured?.assessment_date}<br/>{fw.slice(0,2).join(" · ")}<br/>ThreatVision AI
              </div>
            </div>
          </nav>

          {/* ── Main content ─────────────────────────────────────────────── */}
          <div ref={scrollContainerRef} style={{flex:1,padding:"20px 24px",overflowY:"auto",display:"flex",flexDirection:"column",gap:20,maxHeight:"calc(100vh - 210px)"}}>
            {structured?(
              <>
                <ExecutiveSummary data={structured} projectName={projectName} onPrint={printExecSummary}/>
                <OverviewSection data={structured} projectName={projectName}/>
                <AttckMapSection findings={findings} frameworks={fw} onFindingClick={setSelectedFinding}/>
                <KillChainSection killChains={killChains}/>
                <FindingsSection findings={findings} onFindingClick={setSelectedFinding}/>
                <RiskMatrixSection findings={findings}/>
                <RecommendationsSection recs={recs}/>
                <ActionPlanSection findings={findings} items={actionPlanItems} setItems={setActionPlanItems} onSave={saveActionPlan} saving={apSaving} saved={apSaved}/>
              </>
            ):(
              <div style={{padding:48,textAlign:"center",color:"#94a3b8",fontSize:13,background:"#fff",borderRadius:12,border:"1px solid #E2E8F0",display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
                <i className="fas fa-file-circle-question" style={{fontSize:28,color:"#CBD5E1"}}/>
                <span>No structured data available. Run a new assessment with the latest prompt version.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedFinding&&<FindingModal finding={selectedFinding} onClose={()=>setSelectedFinding(null)} onAddToActionPlan={addToActionPlan}/>}
    </div>
  );
};

export default ReportViewer;
