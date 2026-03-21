"""
Interactive Report Generator
Converts structured threat assessment data (parsed from Claude response)
into a fully self-contained interactive HTML report.

Features:
- Light theme (white/light-gray, matches enterprise SaaS aesthetic)
- MITRE ATT&CK heatmap
- Attack path visualizations (SVG)
- Kill chain timeline
- Filterable / sortable findings table
- Risk priority matrix
- Recommendations with P0/P1/P2 tabs
- Action plan builder (add findings, assign owners, set due dates, track status)
- PDF export via jsPDF (loaded from CDN)
- Compliance gap mapping
- Domain rating scorecards
"""

import json
import html
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)


# ─── SEVERITY HELPERS ─────────────────────────────────────────────────────────

SEV_COLOR = {
    "CRITICAL": "#dc2626",
    "HIGH": "#ea580c",
    "MEDIUM": "#d97706",
    "LOW": "#16a34a",
}

SEV_BG = {
    "CRITICAL": "#fef2f2",
    "HIGH": "#fff7ed",
    "MEDIUM": "#fffbeb",
    "LOW": "#f0fdf4",
}

SEV_BORDER = {
    "CRITICAL": "#fecaca",
    "HIGH": "#fed7aa",
    "MEDIUM": "#fde68a",
    "LOW": "#bbf7d0",
}

PRI_CLASS = {"P0": "p0", "P1": "p1", "P2": "p2"}


def _sev_cls(sev: str) -> str:
    m = {"CRITICAL": "c", "HIGH": "h", "MEDIUM": "m", "LOW": "ok"}
    return m.get(sev.upper(), "m")


def _pri_color(pri: str) -> str:
    m = {"P0": "#dc2626", "P1": "#ea580c", "P2": "#d97706"}
    return m.get(pri, "#d97706")


# ─── CSS ──────────────────────────────────────────────────────────────────────

CSS = """
:root {
  --c:#dc2626;--cg:#fef2f2;--cb:#fecaca;--ct:#b91c1c;
  --h:#ea580c;--hg:#fff7ed;--hb:#fed7aa;--ht:#c2410c;
  --m:#d97706;--mg:#fffbeb;--mb:#fde68a;--mt:#b45309;
  --l:#16a34a;--lg:#f0fdf4;--lb:#bbf7d0;--lt:#15803d;
  --a:#2563eb;--ag:#eff6ff;--ab:#bfdbfe;--at:#1d4ed8;
  --bg:#f8f9fb;--white:#fff;--s2:#f1f5f9;--s3:#e2e8f0;
  --bd:#e2e8f0;--bd2:#cbd5e1;
  --t1:#0f172a;--t2:#475569;--t3:#94a3b8;--t4:#cbd5e1;
  --nav-w:224px;
  --shadow-sm:0 1px 3px rgba(15,23,42,.08),0 1px 2px rgba(15,23,42,.06);
  --shadow-md:0 4px 12px rgba(15,23,42,.08),0 2px 4px rgba(15,23,42,.05);
  --shadow-lg:0 12px 32px rgba(15,23,42,.1),0 4px 8px rgba(15,23,42,.06);
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:'Epilogue',sans-serif;background:var(--bg);color:var(--t1);display:flex;min-height:100vh;overflow-x:hidden;-webkit-font-smoothing:antialiased}
/* NAV */
nav{position:fixed;left:0;top:0;bottom:0;width:var(--nav-w);background:var(--white);border-right:1px solid var(--bd);z-index:100;display:flex;flex-direction:column;overflow-y:auto}
.nav-brand{padding:18px 16px 14px;border-bottom:1px solid var(--bd)}
.nav-logo{display:flex;align-items:center;gap:9px}
.nav-logo-icon{width:32px;height:32px;background:linear-gradient(135deg,#2563eb,#7c3aed);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;box-shadow:0 2px 8px rgba(37,99,235,.3)}
.nav-logo-text{font-size:13px;font-weight:800;color:var(--t1)}
.nav-logo-sub{font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--t3);margin-top:1px}
.nav-risk{margin:10px 12px 0;padding:10px 12px;background:var(--cg);border:1px solid var(--cb);border-radius:8px;text-align:center}
.nav-risk-label{font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--ct);text-transform:uppercase;letter-spacing:.8px;font-weight:500}
.nav-risk-val{font-size:18px;font-weight:800;color:var(--c);line-height:1.1;margin-top:2px}
.nav-risk-sub{font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--ct);margin-top:1px}
.nav-sec{padding:14px 16px 4px;font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--t4);text-transform:uppercase;letter-spacing:.8px;font-weight:500}
.nav-item{display:flex;align-items:center;gap:8px;padding:8px 16px;font-size:12px;font-weight:500;color:var(--t2);cursor:pointer;transition:all .15s;text-decoration:none;border-left:2px solid transparent}
.nav-item:hover{background:var(--s2);color:var(--t1)}
.nav-item.active{background:var(--ag);color:var(--a);border-left-color:var(--a)}
.nav-icon{font-size:13px;width:16px;text-align:center;flex-shrink:0}
.nav-cnt{margin-left:auto;font-family:'JetBrains Mono',monospace;font-size:9px;padding:2px 6px;border-radius:8px;font-weight:500}
.nav-cnt.c{background:var(--cg);color:var(--c)}
.nav-cnt.h{background:var(--hg);color:var(--h)}
.nav-cnt.a{background:var(--ag);color:var(--a)}
.nav-cnt.ok{background:var(--lg);color:var(--l)}
.nav-footer{margin-top:auto;padding:12px 16px;border-top:1px solid var(--bd);font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--t3);line-height:1.8}
/* MAIN */
main{margin-left:var(--nav-w);flex:1}
.sec{padding:32px 36px;border-bottom:1px solid var(--bd)}
.sec-h{display:flex;align-items:flex-start;gap:12px;margin-bottom:22px}
.sec-num{font-family:'JetBrains Mono',monospace;font-size:10px;background:var(--ag);color:var(--a);border:1px solid var(--ab);padding:3px 8px;border-radius:5px;white-space:nowrap;margin-top:3px;font-weight:600}
.sec-title{font-size:19px;font-weight:800;color:var(--t1);letter-spacing:-.4px;line-height:1.2}
.sec-sub{font-size:12px;color:var(--t3);margin-top:3px;line-height:1.5}
/* PILLS */
.pill{display:inline-flex;align-items:center;font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:600;padding:3px 8px;border-radius:10px;text-transform:uppercase;letter-spacing:.3px;white-space:nowrap;border:1px solid transparent}
.pill.c{background:var(--cg);color:var(--c);border-color:var(--cb)}
.pill.h{background:var(--hg);color:var(--h);border-color:var(--hb)}
.pill.m{background:var(--mg);color:var(--m);border-color:var(--mb)}
.pill.ok{background:var(--lg);color:var(--l);border-color:var(--lb)}
.pill.a{background:var(--ag);color:var(--a);border-color:var(--ab)}
.tag{font-family:'JetBrains Mono',monospace;font-size:10px;padding:2px 7px;background:var(--s2);color:var(--t2);border-radius:4px;border:1px solid var(--bd);display:inline-block;font-weight:500}
/* CARDS */
.card{background:var(--white);border:1px solid var(--bd);border-radius:12px;box-shadow:var(--shadow-sm);overflow:hidden}
.card-hdr{padding:14px 18px;border-bottom:1px solid var(--bd);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;background:var(--white)}
.card-title{font-size:13px;font-weight:800;color:var(--t1)}
.card-sub{font-size:11px;color:var(--t3);margin-top:2px}
.card-body{padding:20px}
/* ALERT */
.alert{background:var(--cg);border:1px solid var(--cb);border-radius:12px;padding:16px 20px;margin-bottom:20px;display:flex;align-items:flex-start;gap:14px;position:relative;overflow:hidden;box-shadow:var(--shadow-sm)}
.alert::before{content:'';position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--c)}
.alert-icon{font-size:20px;flex-shrink:0;margin-top:1px}
.alert-title{font-size:13px;font-weight:800;color:var(--ct);text-transform:uppercase;letter-spacing:.3px}
.alert-desc{font-size:12px;color:var(--ht);margin-top:3px;line-height:1.65}
.ac-row{display:flex;gap:12px;margin-top:10px;flex-wrap:wrap}
.ac{text-align:center;background:var(--white);border:1px solid var(--cb);border-radius:8px;padding:7px 12px}
.ac-val{font-size:18px;font-weight:800;line-height:1;letter-spacing:-.5px}
.ac-lbl{font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--t3);margin-top:2px;text-transform:uppercase;letter-spacing:.4px}
/* META STRIP */
.meta-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--bd);border:1px solid var(--bd);border-radius:12px;overflow:hidden;margin-bottom:20px;box-shadow:var(--shadow-sm)}
.meta-cell{background:var(--white);padding:12px 14px}
.meta-label{font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--t3);text-transform:uppercase;letter-spacing:.5px;font-weight:500}
.meta-val{font-size:13px;font-weight:600;color:var(--t1);margin-top:3px}
/* DOMAIN GRID */
.domains-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.dc{background:var(--white);border:1px solid var(--bd);border-radius:12px;padding:14px 16px;cursor:pointer;transition:all .18s;position:relative;overflow:hidden;box-shadow:var(--shadow-sm)}
.dc:hover{box-shadow:var(--shadow-md);transform:translateY(-1px);border-color:var(--bd2)}
.dc::after{content:'';position:absolute;bottom:0;left:0;right:0;height:3px}
.dc.c::after{background:var(--c)}.dc.h::after{background:var(--h)}.dc.m::after{background:var(--m)}.dc.ok::after{background:var(--l)}
.dc-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px}
.dc-name{font-size:12px;font-weight:700;color:var(--t1);line-height:1.3}
.dc-issues{font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--t3);margin-top:2px}
.dc-grade{font-size:17px;font-weight:800;width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-family:'JetBrains Mono',monospace}
.dc-grade.c{background:var(--cg);color:var(--c);border:1px solid var(--cb)}
.dc-grade.h{background:var(--hg);color:var(--h);border:1px solid var(--hb)}
.dc-grade.m{background:var(--mg);color:var(--m);border:1px solid var(--mb)}
.dc-grade.ok{background:var(--lg);color:var(--l);border:1px solid var(--lb)}
.dc-bar{height:4px;background:var(--s3);border-radius:2px;margin-bottom:6px}
.dc-fill{height:100%;border-radius:2px;transition:width 1.2s cubic-bezier(.4,0,.2,1)}
.dc-score-row{display:flex;justify-content:space-between}
.dc-score{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--t2);font-weight:500}
/* TABLES */
.tbl-wrap{background:var(--white);border:1px solid var(--bd);border-radius:12px;overflow:hidden;box-shadow:var(--shadow-sm)}
table{width:100%;border-collapse:collapse}
th{padding:10px 14px;font-family:'JetBrains Mono',monospace;font-size:9px;text-transform:uppercase;letter-spacing:.5px;color:var(--t3);text-align:left;border-bottom:1px solid var(--bd);background:var(--s2);cursor:pointer;user-select:none;white-space:nowrap;font-weight:600}
th:hover{color:var(--t2)}
th.sorted{color:var(--a)}
td{padding:11px 14px;border-bottom:1px solid var(--bd);vertical-align:middle;font-size:12px}
tr:last-child td{border-bottom:none}
tr.fr{cursor:pointer;transition:background .1s}
tr.fr:hover td{background:var(--s2)}
tr.tr-planned td{background:#f0fdf4 !important}
.fid{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--a);white-space:nowrap;font-weight:600}
.ftitle{font-weight:700;color:var(--t1);font-size:12px}
.fdoc{font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--t3);margin-top:2px;font-weight:500}
/* FILTER BAR */
.fbar{display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;align-items:center}
.fsearch{flex:1;min-width:180px;background:var(--white);border:1px solid var(--bd2);border-radius:8px;padding:8px 12px;color:var(--t1);font-family:'Epilogue',sans-serif;font-size:12px;outline:none;box-shadow:var(--shadow-sm);transition:border-color .15s}
.fsearch:focus{border-color:var(--a)}
.fsearch::placeholder{color:var(--t3)}
.fbtn{padding:7px 12px;border-radius:8px;border:1px solid var(--bd2);background:var(--white);color:var(--t2);font-size:11px;font-family:'Epilogue',sans-serif;cursor:pointer;transition:all .15s;font-weight:600;box-shadow:var(--shadow-sm)}
.fbtn:hover{background:var(--s2);color:var(--t1)}
.fbtn.fa{background:var(--ag);color:var(--a);border-color:var(--ab)}
.fbtn.fc{background:var(--cg);color:var(--c);border-color:var(--cb)}
.fbtn.fh{background:var(--hg);color:var(--h);border-color:var(--hb)}
.fbtn.fm{background:var(--mg);color:var(--m);border-color:var(--mb)}
.fcount{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--t3);margin-bottom:8px;font-weight:500}
/* KILL CHAIN */
.kc-scroll{overflow-x:auto}
.kc-phases{display:flex;min-width:800px;gap:0;padding:8px 0 4px}
.kc-phase{flex:1;min-width:100px;padding:0 6px;position:relative;text-align:center}
.kc-phase+.kc-phase::before{content:'›';position:absolute;left:-5px;top:20px;color:var(--t3);font-size:17px;line-height:1}
.kc-icon{width:44px;height:44px;border-radius:50%;margin:0 auto 9px;display:flex;align-items:center;justify-content:center;font-size:18px;border:2px solid transparent;cursor:pointer;transition:transform .2s,box-shadow .2s;box-shadow:var(--shadow-sm)}
.kc-icon:hover{transform:scale(1.12);box-shadow:var(--shadow-md)}
.kc-phase-name{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;font-family:'JetBrains Mono',monospace;color:var(--t2)}
.kc-detail{font-size:10px;color:var(--t3);margin-top:4px;line-height:1.5;padding:0 3px}
.kc-doc{font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--a);margin-top:4px;display:block;opacity:.8}
.kc-win{font-family:'JetBrains Mono',monospace;font-size:9px;padding:2px 6px;border-radius:4px;margin-top:4px;display:inline-block;font-weight:600}
.kc-win.c{background:var(--cg);color:var(--c);border:1px solid var(--cb)}
.kc-win.n{background:var(--mg);color:var(--m);border:1px solid var(--mb)}
/* RISK MATRIX */
.risk-matrix{display:grid;grid-template-columns:160px repeat(4,1fr);background:var(--white);border:1px solid var(--bd);border-radius:12px;overflow:hidden;box-shadow:var(--shadow-sm)}
.rm-corner{padding:11px 12px;background:var(--s2);border-right:1px solid var(--bd);border-bottom:1px solid var(--bd);font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--t3);display:flex;align-items:flex-end;font-weight:500}
.rm-ch{padding:10px 6px;background:var(--s2);border-left:1px solid var(--bd);border-bottom:1px solid var(--bd);text-align:center;font-family:'JetBrains Mono',monospace;font-size:9px;text-transform:uppercase;font-weight:600}
.rm-rl{padding:13px 12px;border-right:1px solid var(--bd);border-bottom:1px solid var(--bd);background:var(--white)}
.rm-rt{font-size:11px;font-weight:700;color:var(--t1);line-height:1.3}
.rm-rs{font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--t3);margin-top:2px}
.rm-cell{border-left:1px solid var(--bd);border-bottom:1px solid var(--bd);padding:12px 8px;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;cursor:pointer;transition:background .12s;background:var(--white)}
.rm-cell:hover{background:var(--s2)}
.rm-cnt{font-size:18px;font-weight:800;line-height:1;font-family:'JetBrains Mono',monospace}
.rm-lbl{font-size:9px;font-family:'JetBrains Mono',monospace;color:var(--t3);text-transform:uppercase}
/* RECS */
.rec-tabs{display:flex;gap:5px;margin-bottom:18px;flex-wrap:wrap}
.rtab{padding:7px 14px;border-radius:8px;border:1px solid var(--bd2);background:var(--white);color:var(--t2);font-size:11px;cursor:pointer;transition:all .15s;font-weight:700;box-shadow:var(--shadow-sm);font-family:'Epilogue',sans-serif}
.rtab.rc{background:var(--cg);color:var(--c);border-color:var(--cb)}
.rtab.rh{background:var(--hg);color:var(--h);border-color:var(--hb)}
.rtab.rm{background:var(--mg);color:var(--m);border-color:var(--mb)}
.rtab:not(.rc):not(.rh):not(.rm):hover{background:var(--s2)}
.rec-panel{display:none}.rec-panel.active{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.rec-card{background:var(--white);border:1px solid var(--bd);border-radius:12px;padding:16px;box-shadow:var(--shadow-sm);transition:all .18s}
.rec-card:hover{box-shadow:var(--shadow-md);transform:translateY(-1px)}
.rec-card.p0{border-top:3px solid var(--c)}.rec-card.p1{border-top:3px solid var(--h)}.rec-card.p2{border-top:3px solid var(--m)}
.rec-top{display:flex;align-items:flex-start;gap:9px;margin-bottom:10px}
.rec-badge{font-family:'JetBrains Mono',monospace;font-size:9px;padding:3px 7px;border-radius:4px;font-weight:700;flex-shrink:0;margin-top:2px}
.rec-badge.p0{background:var(--cg);color:var(--c);border:1px solid var(--cb)}
.rec-badge.p1{background:var(--hg);color:var(--h);border:1px solid var(--hb)}
.rec-badge.p2{background:var(--mg);color:var(--m);border:1px solid var(--mb)}
.rec-title{font-size:13px;font-weight:700;color:var(--t1);line-height:1.4}
.rec-steps{list-style:none;display:flex;flex-direction:column;gap:5px;margin-bottom:12px}
.rec-steps li{display:flex;gap:8px;font-size:11px;color:var(--t2);line-height:1.4}
.rec-steps li::before{content:attr(data-n);font-family:'JetBrains Mono',monospace;font-size:8px;background:var(--s2);color:var(--a);width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;border:1px solid var(--ab);font-weight:700}
.rec-foot{display:flex;align-items:center;gap:10px;padding-top:8px;border-top:1px solid var(--bd)}
.rec-effort{font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--t3)}
.rec-bar-row{flex:1;display:flex;align-items:center;gap:7px}
.rec-bar{flex:1;height:4px;background:var(--s3);border-radius:2px}
.rec-fill{height:100%;border-radius:2px;transition:width 1s ease}
.rec-pct{font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700}
/* COMPLIANCE */
.pos-card{background:var(--white);border:1px solid var(--bd);border-radius:12px;padding:18px;box-shadow:var(--shadow-sm)}
.pos-item{margin-bottom:12px}.pos-item:last-child{margin-bottom:0}
.pos-row{display:flex;justify-content:space-between;margin-bottom:4px;align-items:center}
.pos-name{font-size:12px;font-weight:700;color:var(--t1)}
.pos-status{font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:600}
.pos-bar{height:5px;background:var(--s3);border-radius:3px}
.pos-fill{height:100%;border-radius:3px;transition:width 1.2s ease}
/* ACTION PLAN */
.ap-btn{display:inline-flex;align-items:center;gap:5px;padding:4px 9px;border-radius:6px;font-size:10px;font-weight:700;font-family:'JetBrains Mono',monospace;cursor:pointer;transition:all .15s;border:1px solid var(--ab);background:var(--ag);color:var(--a);white-space:nowrap;vertical-align:middle}
.ap-btn:hover{background:var(--a);color:white;border-color:var(--a)}
.ap-btn.in-plan{background:var(--lg);color:var(--l);border-color:var(--lb)}
.ap-btn.in-plan:hover{background:var(--l);color:white;border-color:var(--l)}
.ap-fab{position:fixed;bottom:24px;right:24px;z-index:200;background:var(--a);color:white;border:none;border-radius:14px;padding:10px 18px;font-family:'Epilogue',sans-serif;font-size:13px;font-weight:800;cursor:pointer;box-shadow:0 4px 20px rgba(37,99,235,.4);display:flex;align-items:center;gap:9px;transition:all .2s}
.ap-fab:hover{background:var(--at);transform:translateY(-2px)}
.ap-fab-badge{background:white;color:var(--a);font-size:11px;font-weight:800;width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace}
.ap-fab.hidden{display:none}
.ap-item-card{background:var(--white);border:1px solid var(--bd);border-radius:10px;margin-bottom:10px;overflow:hidden;box-shadow:var(--shadow-sm)}
.ap-item-card.p0-b{border-left:3px solid var(--c)}.ap-item-card.p1-b{border-left:3px solid var(--h)}.ap-item-card.p2-b{border-left:3px solid var(--m)}
.ap-item-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;padding:12px 14px;background:var(--white)}
.ap-item-meta{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;padding:8px 14px 12px;border-top:1px solid var(--bd);background:var(--s2)}
.ap-meta-label{font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--t3);text-transform:uppercase;letter-spacing:.5px;font-weight:600;margin-bottom:2px;display:block}
.ap-meta-input{width:100%;background:var(--white);border:1px solid var(--bd2);border-radius:6px;padding:5px 8px;font-family:'Epilogue',sans-serif;font-size:11px;color:var(--t1);outline:none;transition:border-color .15s;font-weight:500}
.ap-meta-input:focus{border-color:var(--a)}
.ap-meta-input::placeholder{color:var(--t4)}
.ap-steps-mini{padding:8px 14px 10px;background:var(--s2);border-top:1px solid var(--bd);list-style:none;display:flex;flex-direction:column;gap:4px}
.ap-steps-mini li{font-size:11px;color:var(--t2);display:flex;gap:6px;align-items:flex-start;line-height:1.4}
.ap-steps-mini li::before{content:attr(data-n);font-family:'JetBrains Mono',monospace;font-size:8px;background:var(--ag);color:var(--a);min-width:14px;height:14px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;border:1px solid var(--ab);font-weight:700}
.ap-rm{background:none;border:none;cursor:pointer;color:var(--t3);font-size:13px;padding:2px 4px;border-radius:4px;transition:all .15s;flex-shrink:0}
.ap-rm:hover{background:var(--cg);color:var(--c)}
.ap-sum-row{display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap}
.ap-sum-stat{background:var(--white);border:1px solid var(--bd);border-radius:10px;padding:12px 16px;text-align:center;flex:1;min-width:80px;box-shadow:var(--shadow-sm)}
.ap-sum-num{font-size:22px;font-weight:800;line-height:1;letter-spacing:-.5px}
.ap-sum-lbl{font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--t3);margin-top:2px;text-transform:uppercase}
.ap-toolbar{display:flex;gap:9px;margin-bottom:18px;align-items:center;flex-wrap:wrap}
.ap-export-btn{display:flex;align-items:center;gap:6px;padding:9px 16px;background:var(--t1);color:white;border:none;border-radius:8px;font-family:'Epilogue',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .18s;box-shadow:var(--shadow-sm)}
.ap-export-btn:hover{background:#1e293b;transform:translateY(-1px);box-shadow:var(--shadow-md)}
.ap-clear-btn{padding:8px 14px;background:var(--white);border:1px solid var(--bd2);border-radius:8px;font-family:'Epilogue',sans-serif;font-size:12px;font-weight:600;color:var(--t2);cursor:pointer;transition:all .15s}
.ap-clear-btn:hover{background:var(--cg);color:var(--c);border-color:var(--cb)}
.ap-empty{text-align:center;padding:48px 20px;color:var(--t3)}
.ap-empty-icon{font-size:36px;margin-bottom:12px}
.ap-empty-title{font-size:15px;font-weight:700;color:var(--t2);margin-bottom:5px}
.ap-empty-sub{font-size:13px;line-height:1.65}
/* MODAL */
.modal-overlay{position:fixed;inset:0;background:rgba(15,23,42,.4);z-index:1000;display:none;align-items:center;justify-content:center;backdrop-filter:blur(3px)}
.modal-overlay.open{display:flex}
.modal{background:var(--white);border:1px solid var(--bd2);border-radius:16px;max-width:660px;width:92%;max-height:88vh;overflow-y:auto;box-shadow:var(--shadow-lg)}
.modal-head{padding:18px 22px 14px;border-bottom:1px solid var(--bd);display:flex;align-items:flex-start;justify-content:space-between;gap:12px;position:sticky;top:0;background:var(--white);z-index:2}
.modal-close{background:var(--s2);border:1px solid var(--bd);color:var(--t2);width:26px;height:26px;border-radius:50%;cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;transition:all .15s}
.modal-close:hover{background:var(--s3);color:var(--t1)}
.modal-body{padding:16px 22px 22px;display:flex;flex-direction:column;gap:14px}
.mb-title{font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--t3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px;font-weight:600}
.mb-quote{background:var(--s2);border-left:3px solid var(--a);padding:9px 12px;font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--t1);border-radius:0 6px 6px 0;line-height:1.65;font-weight:500}
.mb-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}
.mb-info-item{}
.mb-info-label{font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--t3);text-transform:uppercase;margin-bottom:3px;font-weight:600}
.mb-info-val{font-size:13px;color:var(--t2);font-weight:600}
.mb-steps{list-style:none;display:flex;flex-direction:column;gap:6px}
.mb-steps li{display:flex;gap:9px;font-size:12px;color:var(--t2);line-height:1.5}
.mb-steps li::before{content:attr(data-n);font-family:'JetBrains Mono',monospace;font-size:9px;background:var(--ag);color:var(--a);width:19px;height:19px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;border:1px solid var(--ab);font-weight:700}
/* NODE TOOLTIP */
.node-tip{position:fixed;z-index:999;background:var(--white);border:1px solid var(--bd2);border-radius:10px;padding:12px 14px;max-width:280px;pointer-events:none;display:none;box-shadow:var(--shadow-lg)}
.node-tip.vis{display:block}
.nt-title{font-size:12px;font-weight:800;color:var(--t1);margin-bottom:6px}
.nt-row{display:flex;gap:7px;margin-bottom:3px;font-size:11px;align-items:flex-start}
.nt-label{color:var(--t3);font-family:'JetBrains Mono',monospace;min-width:58px;flex-shrink:0;font-size:9px;text-transform:uppercase;margin-top:1px;font-weight:500}
.nt-val{color:var(--t2);line-height:1.4}
.nt-quote{background:var(--s2);border-left:2px solid var(--a);padding:5px 8px;font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--t1);border-radius:0 4px 4px 0;margin-top:3px;line-height:1.55}
/* AP TABS */
.ap-tabs{display:flex;gap:2px;margin-bottom:16px;background:var(--s2);border-radius:8px;padding:3px;width:fit-content;border:1px solid var(--bd)}
.ap-tab{padding:6px 14px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;transition:all .15s;color:var(--t2);background:transparent}
.ap-tab.active{background:var(--white);color:var(--a);box-shadow:var(--shadow-sm)}
.ap-tab:hover:not(.active){color:var(--t1)}
.ap-panel{display:none}.ap-panel.active{display:block}
/* 2-col layout */
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:14px}
/* Spec cards */
.spec-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.spec-card{background:var(--white);border:1px solid var(--bd);border-radius:12px;overflow:hidden;box-shadow:var(--shadow-sm)}
.spec-hdr{padding:12px 16px;border-bottom:1px solid var(--bd);display:flex;align-items:center;justify-content:space-between;gap:9px;background:var(--s2)}
.spec-title-row{display:flex;align-items:center;gap:8px}
.spec-icon{font-size:16px}
.spec-title{font-size:13px;font-weight:800;color:var(--t1)}
.spec-sub{font-size:10px;color:var(--t3);margin-top:1px}
.spec-item{padding:8px 16px;border-bottom:1px solid rgba(0,0,0,.04);display:flex;justify-content:space-between;align-items:center;gap:10px}
.spec-item:last-child{border-bottom:none}
.spec-item-lbl{font-size:11px;color:var(--t2);font-weight:500}
.spec-item-val{font-family:'JetBrains Mono',monospace;font-size:10px;text-align:right;flex-shrink:0;font-weight:600}
@keyframes fadeUp{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:translateY(0)}}
.fade-in{animation:fadeUp .4s ease forwards;opacity:0}
@media(max-width:1100px){.domains-grid,.spec-grid,.two-col{grid-template-columns:1fr 1fr}.rec-panel.active{grid-template-columns:1fr}.meta-strip{grid-template-columns:1fr 1fr}}
@media(max-width:700px){.domains-grid,.spec-grid,.two-col,.rec-panel.active,.meta-strip{grid-template-columns:1fr}}
"""


# ─── JAVASCRIPT ───────────────────────────────────────────────────────────────

def _build_js(data: Dict[str, Any]) -> str:
    """Build the main JS block with injected data."""
    findings_json = json.dumps(data.get("all_findings", []))
    recs_json = json.dumps(data.get("all_recommendations", []))
    kill_chains_json = json.dumps(data.get("kill_chains", []))
    overall = data.get("overall_risk_rating", "HIGH")
    project_name = html.escape(data.get("project_name", "Project"))
    frameworks = json.dumps(data.get("frameworks_used", []))
    risk_areas = json.dumps(data.get("risk_areas_assessed", []))
    assessment_date = html.escape(data.get("assessment_date", ""))

    return f"""
const FD = {findings_json};
const RECS = {recs_json};
const KCS = {kill_chains_json};
const META = {{
  overall: "{overall}",
  project: {json.dumps(project_name)},
  frameworks: {frameworks},
  risk_areas: {risk_areas},
  assessment_date: "{assessment_date}"
}};

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {{
  buildFindings();
  buildRecs();
  buildKillChain();
  renderDomainBars();
  initScroll();
  initBars();
  initTooltips();
  renderActionPlan();
  setTimeout(()=>document.querySelectorAll('#overview [data-w]').forEach(b=>{{b.style.width=b.dataset.w+'%';}}), 400);
}});

// ── SEVERITY HELPERS ──
const SC={{CRITICAL:'c',HIGH:'h',MEDIUM:'m',LOW:'ok'}};
const SCOL={{CRITICAL:'var(--c)',HIGH:'var(--h)',MEDIUM:'var(--m)',LOW:'var(--l)'}};
const PBC={{P0:'p0',P1:'p1',P2:'p2'}};

// ── BUILD FINDINGS TABLE ──
function buildFindings(){{
  const tb=document.getElementById('ftbody');
  if(!tb)return;
  FD.forEach(f=>{{
    const sc=f.L??f.likelihood??3,si=f.I??f.impact??3,score=f.risk_score||(sc*si);
    const sc2=SC[f.severity]||'m';
    const tl=f.timeline||'';
    const tl2=tl.includes('0–30')||tl.includes('0-30')?'c':tl.includes('30–90')||tl.includes('30-90')?'h':'m';
    const tr=document.createElement('tr');tr.className='fr';tr.id=`row-${{f.id}}`;
    tr.dataset.sev=f.severity;tr.dataset.s=`${{f.id}} ${{f.title}} ${{f.tactic||''}} ${{f.technique_id||''}} ${{f.owner||''}}`.toLowerCase();
    tr.innerHTML=`
      <td><span class="fid">${{f.id}}</span></td>
      <td style="max-width:220px"><div class="ftitle">${{esc(f.title)}}</div><div class="fdoc">${{esc((f.doc_source||'').split(' — ')[0])}}</div></td>
      <td><span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--t2)">${{esc(f.tactic||'')}}</span></td>
      <td><span class="tag">${{esc(f.technique_id||'—')}}</span></td>
      <td><span class="pill ${{sc2}}">${{f.severity}}</span></td>
      <td><span style="font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:800;color:var(--${{sc2==='c'?'c':sc2==='h'?'h':'m'}})">${{sc}}×${{si}}=${{score}}</span></td>
      <td style="font-size:12px;color:var(--t2);font-weight:500">${{esc(f.owner||'')}}</td>
      <td style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:600;color:var(--${{tl2}})">${{esc(tl)}}</td>
      <td onclick="event.stopPropagation()"><button class="ap-btn" id="apbtn-${{f.id}}" onclick="toggleAP('${{f.id}}')">+ Add to Plan</button></td>`;
    tr.onclick=()=>openModal(f);
    tb.appendChild(tr);
  }});
}}

// ── FILTER / SORT ──
function filterF(){{
  const sv=document.getElementById('fsearch').value.toLowerCase();
  const ab=document.querySelector('.fbtn.fc,.fbtn.fh,.fbtn.fm');
  const sf=ab?ab.textContent.trim().toUpperCase().split(' ')[0]:'ALL';
  let n=0;
  document.querySelectorAll('#ftbody tr.fr').forEach(r=>{{
    const ok=(!sv||r.dataset.s.includes(sv))&&(sf==='ALL'||r.dataset.sev===sf);
    r.style.display=ok?'':'none';if(ok)n++;
  }});
  document.getElementById('fcount').textContent=`Showing ${{n}} of ${{FD.length}} findings`;
}}
function setF(b,f){{
  document.querySelectorAll('.fbtn').forEach(x=>x.classList.remove('fa','fc','fh','fm'));
  if(f==='ALL')b.classList.add('fa');else if(f==='CRITICAL')b.classList.add('fc');else if(f==='HIGH')b.classList.add('fh');else b.classList.add('fm');
  filterF();
}}
let _sd={{}};
function sortT(c){{
  const tb=document.getElementById('ftbody');
  const rows=[...tb.querySelectorAll('tr.fr')];_sd[c]=!_sd[c];
  rows.sort((a,b)=>{{const aT=a.cells[c].textContent.trim(),bT=b.cells[c].textContent.trim();return _sd[c]?aT.localeCompare(bT):bT.localeCompare(aT);}});
  rows.forEach(r=>tb.appendChild(r));
  document.querySelectorAll('th').forEach((t,i)=>t.classList.toggle('sorted',i===c));
}}

// ── BUILD RECS ──
function buildRecs(){{
  ['p0','p1','p2'].forEach(p=>{{
    const el=document.getElementById(`rp-${{p}}`);if(!el)return;
    const priority=p.toUpperCase();
    const fc=p==='p0'?'var(--c)':p==='p1'?'var(--h)':'var(--m)';
    RECS.filter(r=>(r.priority||'').toLowerCase()===p).forEach(r=>{{
      const card=document.createElement('div');card.className=`rec-card ${{p}}`;
      card.innerHTML=`
        <div class="rec-top">
          <span class="rec-badge ${{p}}">${{r.id}}</span>
          <div class="rec-title">${{esc(r.title)}}</div>
        </div>
        <ul class="rec-steps">${{(r.steps||[]).map((s,i)=>`<li data-n="${{i+1}}">${{esc(s)}}</li>`).join('')}}</ul>
        <div class="rec-foot">
          <span class="rec-effort">⏱ ${{r.effort_weeks||'?'}} weeks · ${{esc(r.owner||'')}}</span>
          <div class="rec-bar-row">
            <div class="rec-bar"><div class="rec-fill" data-w="${{r.risk_reduction_pct||50}}" style="background:${{fc}};width:0%"></div></div>
            <span class="rec-pct" style="color:${{fc}}">${{r.risk_reduction_pct||50}}% ↓</span>
          </div>
        </div>`;
      el.appendChild(card);
    }});
    if(el.children.length===0){{
      el.innerHTML=`<div style="color:var(--t3);font-size:13px;padding:20px;text-align:center;font-family:'JetBrains Mono',monospace">No ${{priority}} recommendations</div>`;
    }}
  }});
}}

// ── FRAMEWORK-AWARE PHASE ICONS ──
// Covers MITRE ATT&CK, STRIDE, PASTA, OCTAVE, VAST, and Custom frameworks.
// The phase name comes from Claude's structured output — it uses the correct
// terminology for whichever framework was selected by the user.
const PHASE_ICONS = {{
  // ── MITRE ATT&CK (12 tactics) ──
  'Reconnaissance':'🔍',
  'Initial Access':'📧',
  'Execution':'💥',
  'Persistence':'🧠',
  'Privilege Escalation':'⬆️',
  'Defense Evasion':'🛡️',
  'Credential Access':'🔑',
  'Discovery':'🗺',
  'Lateral Movement':'↔️',
  'Collection':'📦',
  'Command and Control':'📡',
  'Exfiltration':'🚀',
  'Impact':'💥',
  // ── MITRE kill chain aliases ──
  'Weaponization':'🔧',
  'Delivery':'📤',
  'Installation':'⚙️',
  'Actions on Objectives':'🎯',
  // ── STRIDE (6 categories) ──
  'Spoofing':'🎭',
  'Spoofing Identity':'🎭',
  'Tampering':'✂️',
  'Tampering with Data':'✂️',
  'Repudiation':'🚫',
  'Information Disclosure':'👁',
  'Denial of Service':'🔴',
  'Elevation of Privilege':'⬆️',
  // ── PASTA (7 stages) ──
  'Define Objectives':'🎯',
  'Define Technical Scope':'🗺',
  'Application Decomposition':'🔩',
  'Threat Analysis':'🧐',
  'Vulnerability Analysis':'🔎',
  'Attack Modeling':'⚔️',
  'Risk & Impact Analysis':'📊',
  'Risk and Impact Analysis':'📊',
  // ── OCTAVE (3 phases) ──
  'Build Asset-Based Threat Profiles':'📋',
  'Identify Infrastructure Vulnerabilities':'🏗',
  'Develop Security Strategy and Plans':'📝',
  // ── VAST ──
  'Application Threat Models':'📱',
  'Operational Threat Models':'⚙️',
  'Infrastructure Models':'🏛',
  // ── GENERIC fallbacks ──
  'Assessment':'📋',
  'Analysis':'🔬',
  'Identification':'🔍',
  'Mitigation':'🛡',
  'Response':'🚨',
  'Recovery':'🔄',
  'Prevention':'🔒',
  'Detection':'👁',
  'Remediation':'🔧',
  'Review':'📝',
}};

// ── FRAMEWORK SECTION LABELS ──
// Maps the framework name to human-readable labels for section 03
function getFrameworkSectionLabel(frameworks){{
  const fw=(frameworks||[]).join(' ').toUpperCase();
  if(fw.includes('MITRE'))return{{title:'Kill Chain Analysis',sub:'Attack scenario phases — sourced from document evidence',icon:'⛓'}};
  if(fw.includes('STRIDE'))return{{title:'STRIDE Threat Category Analysis',sub:'Six threat categories: Spoofing · Tampering · Repudiation · Info Disclosure · DoS · Elevation',icon:'🎭'}};
  if(fw.includes('PASTA'))return{{title:'PASTA Attack Simulation Stages',sub:'Seven-stage process for attack simulation and threat analysis',icon:'🍝'}};
  if(fw.includes('OCTAVE'))return{{title:'OCTAVE Phase Analysis',sub:'Operationally Critical Threat, Asset, and Vulnerability Evaluation',icon:'🔬'}};
  if(fw.includes('VAST'))return{{title:'VAST Threat Model Analysis',sub:'Visual, Agile, and Simple threat modeling phases',icon:'📐'}};
  return{{title:'Threat Scenario Analysis',sub:'Attack phases and threat categories from document evidence',icon:'🔍'}};
}}

// ── FRAMEWORK-AWARE SECTION TITLE ──
// Update section 03 heading dynamically based on selected framework
function updateFrameworkSectionTitle(){{
  const labels=getFrameworkSectionLabel(META.frameworks);
  const titleEl=document.getElementById('sec03-title');
  const subEl=document.getElementById('sec03-sub');
  const iconEl=document.getElementById('sec03-icon');
  const navLabel=document.getElementById('nav-sec03-label');
  const navIcon=document.getElementById('nav-sec03-icon');
  const cardTitle=document.getElementById('kc-card-title');
  if(titleEl)titleEl.textContent=labels.title;
  if(subEl)subEl.textContent=labels.sub;
  if(iconEl)iconEl.textContent=labels.icon+' ';
  if(navLabel)navLabel.textContent=labels.title.split(' ')[0]+' Analysis';
  if(navIcon)navIcon.textContent=labels.icon;
  if(cardTitle&&!cardTitle.textContent.trim())cardTitle.textContent=labels.title;

  // Update findings table column headers per framework
  const fw=(META.frameworks||[]).join(' ').toUpperCase();
  const colTactic=document.getElementById('col-tactic');
  const colTech=document.getElementById('col-technique');
  if(colTactic&&colTech){{
    if(fw.includes('MITRE')){{colTactic.textContent='Tactic';colTech.textContent='Technique ID';}}
    else if(fw.includes('STRIDE')){{colTactic.textContent='STRIDE Category';colTech.textContent='Category Ref';}}
    else if(fw.includes('PASTA')){{colTactic.textContent='PASTA Stage';colTech.textContent='Stage Ref';}}
    else if(fw.includes('OCTAVE')){{colTactic.textContent='OCTAVE Phase';colTech.textContent='Phase Ref';}}
    else if(fw.includes('VAST')){{colTactic.textContent='Threat Type';colTech.textContent='Model Ref';}}
    else{{colTactic.textContent='Category';colTech.textContent='Ref ID';}}
  }}
}}

// ── BUILD THREAT PHASES (works for all frameworks) ──
function buildKillChain(){{
  updateFrameworkSectionTitle();
  if(!KCS.length){{
    // No kill chains in structured data — build from findings grouped by tactic
    const el=document.getElementById('kc-phases');if(!el)return;
    const byTactic={{}};
    FD.forEach(f=>{{
      const t=f.tactic||'General';
      byTactic[t]=byTactic[t]||[];
      byTactic[t].push(f);
    }});
    if(Object.keys(byTactic).length===0){{
      el.innerHTML='<div style="color:var(--t3);font-size:13px;padding:20px;text-align:center;font-family:JetBrains Mono,monospace">No scenario phases available for this assessment</div>';
      return;
    }}
    Object.entries(byTactic).forEach(([tactic, findings])=>{{
      const worstSev=findings.some(f=>f.severity==='CRITICAL')?'CRITICAL':findings.some(f=>f.severity==='HIGH')?'HIGH':'MEDIUM';
      const isHigh=worstSev==='CRITICAL'||worstSev==='HIGH';
      const icon=PHASE_ICONS[tactic]||'▶️';
      const div=document.createElement('div');div.className='kc-phase';
      div.innerHTML=`
        <div class="kc-icon" style="background:${{isHigh?'var(--cg)':'var(--ag)'}};border:2px solid ${{isHigh?'var(--cb)':'var(--ab)'}}">${{icon}}</div>
        <div class="kc-phase-name">${{esc(tactic)}}</div>
        <div class="kc-detail">${{findings.length}} finding${{findings.length!==1?'s':''}} · ${{esc(worstSev)}}</div>
        <span class="kc-doc">${{esc(findings.map(f=>f.id).join(', '))}}</span>
        <span class="kc-win ${{isHigh?'c':'n'}}">${{esc(worstSev)}}</span>`;
      el.appendChild(div);
    }});
    return;
  }}

  // Kill chain data present — render it
  const kc=KCS[0];
  const el=document.getElementById('kc-phases');if(!el)return;
  (kc.phases||[]).forEach(ph=>{{
    const icon=PHASE_ICONS[ph.phase]||'▶️';
    const isHigh=(ph.risk_score||0)>=16||ph.severity==='CRITICAL'||ph.severity==='HIGH';
    const div=document.createElement('div');div.className='kc-phase';
    div.innerHTML=`
      <div class="kc-icon" style="background:${{isHigh?'var(--cg)':'var(--ag)'}};border:2px solid ${{isHigh?'var(--cb)':'var(--ab)'}}">${{icon}}</div>
      <div class="kc-phase-name">${{esc(ph.phase)}}</div>
      <div class="kc-detail">${{esc(ph.description||'')}}</div>
      <span class="kc-doc">${{esc(ph.technique_id||ph.stage_id||'')}}</span>
      <span class="kc-win ${{isHigh?'c':'n'}}">${{esc(ph.detection_window||ph.detection_opportunity||'')}}</span>`;
    el.appendChild(div);
  }});
}}

// ── MODAL ──
let _mfid=null;
function openModal(f){{
  _mfid=f.id;
  const sc=(f.L??f.likelihood??3)*(f.I??f.impact??3);
  const sc2=SC[f.severity]||'m';
  document.getElementById('mId').textContent=f.id;
  const p=document.getElementById('mPill');p.textContent=f.severity;p.className=`pill ${{sc2}}`;
  document.getElementById('mTitle').textContent=f.title;
  document.getElementById('mTech').textContent=`${{f.tactic||''}} · ${{f.technique_id||''}} · ${{f.doc_source||''}}`;
  document.getElementById('mEv').textContent=f.verbatim_evidence||f.doc_source||'No direct evidence recorded';
  document.getElementById('mL').textContent=`${{f.L??f.likelihood??3}} / 5`;
  document.getElementById('mI').textContent=`${{f.I??f.impact??3}} / 5`;
  document.getElementById('mSc').innerHTML=`<strong style="color:var(--${{sc2}})">${{sc}} / 25</strong>`;
  document.getElementById('mPr').textContent=f.priority||'P1';
  document.getElementById('mOw').textContent=f.owner||'';
  document.getElementById('mTi').innerHTML=`<span style="color:var(--${{(f.timeline||'').includes('0')?'c':'h'}})">${{esc(f.timeline||'')}}</span>`;
  document.getElementById('mBi').textContent=f.business_impact||'';
  document.getElementById('mSt').innerHTML=(f.mitigation_steps||[]).map((s,i)=>`<li data-n="${{i+1}}">${{esc(s)}}</li>`).join('');
  const inPlan=actionPlan.has(f.id);
  const mb=document.getElementById('mApBtn');
  mb.textContent=inPlan?'✓ In Action Plan':'+ Add to Action Plan';
  mb.className=`ap-btn${{inPlan?' in-plan':''}}`;
  document.getElementById('mOverlay').classList.add('open');
}}
function closeM(e){{if(e.target===document.getElementById('mOverlay'))document.getElementById('mOverlay').classList.remove('open');}}

// ── TABS ──
function swapRec(b,p){{
  document.querySelectorAll('.rtab').forEach(t=>t.classList.remove('rc','rh','rm'));
  document.querySelectorAll('.rec-panel').forEach(t=>t.classList.remove('active'));
  const c=p==='rp-p0'?'rc':p==='rp-p1'?'rh':'rm';
  b.classList.add(c);document.getElementById(p).classList.add('active');
}}

// ── SCROLL NAV ──
function initScroll(){{
  const secs=document.querySelectorAll('.sec');
  const navs=document.querySelectorAll('.nav-item');
  secs.forEach(s=>new IntersectionObserver(es=>{{
    es.forEach(e=>{{if(e.isIntersecting){{navs.forEach(n=>n.classList.remove('active'));const a=document.querySelector(`.nav-item[href="#${{e.target.id}}"]`);if(a)a.classList.add('active');}}}});
  }},{{threshold:0.25}}).observe(s));
}}

// ── BARS ──
function initBars(){{
  document.querySelectorAll('.sec').forEach(s=>new IntersectionObserver(es=>{{
    es.forEach(e=>{{if(e.isIntersecting)e.target.querySelectorAll('[data-w]').forEach(b=>{{b.style.width=b.dataset.w+'%';}});}});
  }},{{threshold:0.05}}).observe(s));
}}

function renderDomainBars(){{
  document.querySelectorAll('.dc-fill').forEach(el=>{{
    setTimeout(()=>{{el.style.width=el.dataset.w+'%';}},400);
  }});
}}

// ── NODE TOOLTIPS ──
function initTooltips(){{
  const tt=document.getElementById('nodeTip');if(!tt)return;
  document.querySelectorAll('.ap-node').forEach(n=>{{
    n.addEventListener('mouseenter',()=>{{
      document.getElementById('ntT').textContent=n.dataset.title||'';
      const sv=document.getElementById('ntS');sv.textContent=n.dataset.sev||'';
      sv.style.color=n.dataset.sev==='CRITICAL'?'var(--c)':n.dataset.sev==='HIGH'?'var(--h)':'var(--t2)';
      document.getElementById('ntD').textContent=n.dataset.doc||'';
      document.getElementById('ntE').textContent=n.dataset.evidence||'';
      document.getElementById('ntI').textContent=n.dataset.impact||'';
      document.getElementById('ntR').textContent=n.dataset.ref||'';
      tt.classList.add('vis');
    }});
    n.addEventListener('mousemove',e=>{{
      const x=e.clientX+14,y=e.clientY-14;
      tt.style.left=(x+tt.offsetWidth>window.innerWidth?x-tt.offsetWidth-28:x)+'px';
      tt.style.top=(y+tt.offsetHeight>window.innerHeight?y-tt.offsetHeight:y)+'px';
    }});
    n.addEventListener('mouseleave',()=>tt.classList.remove('vis'));
    n.addEventListener('click',()=>{{
      if(n.dataset.ref){{const f=FD.find(x=>x.technique_id===n.dataset.ref||x.id===n.dataset.ref);if(f){{tt.classList.remove('vis');openModal(f);}}}}
    }});
  }});
}}

// ── ACTION PLAN ──
const actionPlan=new Map();
function toggleAP(id){{
  if(!id)return;
  if(actionPlan.has(id)){{actionPlan.delete(id);}}
  else{{const f=FD.find(x=>x.id===id);if(f)actionPlan.set(id,{{assignee:f.owner||'',dueDate:'',notes:'',status:'Open',addedAt:new Date().toISOString()}});}}
  refreshAPButtons(id);renderActionPlan();updateAPNav();
}}
function refreshAPButtons(id){{
  const inPlan=actionPlan.has(id);
  const rb=document.getElementById(`apbtn-${{id}}`);
  if(rb){{rb.textContent=inPlan?'✓ In Plan':'+ Add to Plan';rb.className=`ap-btn${{inPlan?' in-plan':''}}`; }}
  const row=document.getElementById(`row-${{id}}`);
  if(row){{if(inPlan)row.classList.add('tr-planned');else row.classList.remove('tr-planned');}}
  if(_mfid===id){{const mb=document.getElementById('mApBtn');if(mb){{mb.textContent=inPlan?'✓ In Action Plan':'+ Add to Action Plan';mb.className=`ap-btn${{inPlan?' in-plan':''}}`;}}}}
}}
function updateAPNav(){{
  const n=actionPlan.size;
  const nb=document.getElementById('navApCount');if(nb){{nb.textContent=n;nb.style.display=n>0?'flex':'none';}}
  const fab=document.getElementById('apFab');if(fab)fab.classList.toggle('hidden',n===0);
  const fc=document.getElementById('fabCount');if(fc)fc.textContent=n;
}}
function updateMeta(id,field,val){{if(actionPlan.has(id)){{const m=actionPlan.get(id);m[field]=val;}}}}
function clearAll(){{
  if(!confirm(`Remove all ${{actionPlan.size}} items from the Action Plan?`))return;
  [...actionPlan.keys()].forEach(id=>refreshAPButtons(id));
  actionPlan.clear();renderActionPlan();updateAPNav();
}}
function renderActionPlan(){{
  const empty=document.getElementById('apEmpty');const content=document.getElementById('apContent');const list=document.getElementById('apList');const summary=document.getElementById('apSummary');const ts=document.getElementById('apTimestamp');
  if(!empty)return;
  if(actionPlan.size===0){{empty.style.display='';content.style.display='none';return;}}
  empty.style.display='none';content.style.display='';
  if(ts)ts.textContent=`Generated ${{new Date().toLocaleDateString('en-AU',{{day:'numeric',month:'short',year:'numeric'}})}}`;
  const items=[...actionPlan.keys()].map(id=>FD.find(f=>f.id===id)).filter(Boolean);
  const byPri={{P0:0,P1:0,P2:0}};const bySev={{CRITICAL:0,HIGH:0,MEDIUM:0}};
  items.forEach(f=>{{byPri[f.priority]=(byPri[f.priority]||0)+1;bySev[f.severity]=(bySev[f.severity]||0)+1;}});
  if(summary)summary.innerHTML=`
    <div class="ap-sum-stat"><div class="ap-sum-num">${{actionPlan.size}}</div><div class="ap-sum-lbl">Total</div></div>
    <div class="ap-sum-stat"><div class="ap-sum-num" style="color:var(--c)">${{byPri.P0||0}}</div><div class="ap-sum-lbl">P0 Critical</div></div>
    <div class="ap-sum-stat"><div class="ap-sum-num" style="color:var(--h)">${{byPri.P1||0}}</div><div class="ap-sum-lbl">P1 High</div></div>
    <div class="ap-sum-stat"><div class="ap-sum-num" style="color:var(--m)">${{byPri.P2||0}}</div><div class="ap-sum-lbl">P2 Medium</div></div>
    <div class="ap-sum-stat"><div class="ap-sum-num" style="color:var(--c)">${{bySev.CRITICAL||0}}</div><div class="ap-sum-lbl">Critical Sev.</div></div>
    <div class="ap-sum-stat"><div class="ap-sum-num" style="color:var(--h)">${{bySev.HIGH||0}}</div><div class="ap-sum-lbl">High Sev.</div></div>`;
  items.sort((a,b)=>{{const po={{P0:0,P1:1,P2:2}};return(po[a.priority]-po[b.priority])||((b.risk_score||9)-(a.risk_score||9));}});
  list.innerHTML='';
  items.forEach(f=>{{
    const meta=actionPlan.get(f.id);const sc2=SC[f.severity]||'m';
    const pb=f.priority==='P0'?'p0-b':f.priority==='P1'?'p1-b':'p2-b';
    const card=document.createElement('div');card.className=`ap-item-card ${{pb}}`;card.id=`apcard-${{f.id}}`;
    card.innerHTML=`
      <div class="ap-item-head">
        <div style="flex:1">
          <div style="display:flex;align-items:center;gap:7px;margin-bottom:4px">
            <span class="fid">${{f.id}}</span><span class="pill ${{sc2}}">${{f.severity}}</span>
            <span style="font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--t3);font-weight:600">${{f.technique_id||''}} · L${{f.likelihood??3}}×I${{f.impact??3}}=${{f.risk_score||9}}</span>
          </div>
          <div style="font-size:13px;font-weight:700;color:var(--t1);line-height:1.3;margin-bottom:2px">${{esc(f.title)}}</div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--t3)">${{esc(f.tactic||'')}}</div>
        </div>
        <button class="ap-rm" onclick="toggleAP('${{f.id}}')" title="Remove">✕</button>
      </div>
      <div class="ap-item-meta">
        <div><span class="ap-meta-label">Assigned To</span><input class="ap-meta-input" placeholder="${{f.owner||'Team'}}" value="${{esc(meta.assignee||'')}}" oninput="updateMeta('${{f.id}}','assignee',this.value)"></div>
        <div><span class="ap-meta-label">Due Date</span><input class="ap-meta-input" type="date" value="${{meta.dueDate||''}}" oninput="updateMeta('${{f.id}}','dueDate',this.value)"></div>
        <div><span class="ap-meta-label">Status</span>
          <select class="ap-meta-input" oninput="updateMeta('${{f.id}}','status',this.value)">
            <option ${{(!meta.status||meta.status==='Open')?'selected':''}}>Open</option>
            <option ${{meta.status==='In Progress'?'selected':''}}>In Progress</option>
            <option ${{meta.status==='Complete'?'selected':''}}>Complete</option>
            <option ${{meta.status==='Deferred'?'selected':''}}>Deferred</option>
          </select>
        </div>
        <div style="grid-column:1/-1"><span class="ap-meta-label">Notes</span><input class="ap-meta-input" placeholder="Add notes or blockers…" value="${{esc(meta.notes||'')}}" oninput="updateMeta('${{f.id}}','notes',this.value)"></div>
      </div>
      <ul class="ap-steps-mini">${{(f.mitigation_steps||[]).map((s,i)=>`<li data-n="${{i+1}}">${{esc(s)}}</li>`).join('')}}</ul>`;
    list.appendChild(card);
  }});
}}
// ── PDF EXPORT ──
async function exportPDF(){{
  if(actionPlan.size===0){{alert('Add items to the Action Plan first.');return;}}
  const btn=document.getElementById('exportBtn');btn.textContent='⏳ Generating PDF…';btn.disabled=true;
  try{{
    const{{jsPDF}}=window.jspdf;const doc=new jsPDF({{orientation:'portrait',unit:'mm',format:'a4'}});
    const W=doc.internal.pageSize.getWidth();const H=doc.internal.pageSize.getHeight();const m=18;let y=m;
    doc.setFillColor(15,23,42);doc.rect(0,0,W,40,'F');
    doc.setFillColor(37,99,235);doc.rect(0,0,4,40,'F');
    doc.setTextColor(255,255,255);doc.setFont('helvetica','bold');doc.setFontSize(17);
    doc.text('Threat Assessment — Action Plan',m,17);
    doc.setFont('helvetica','normal');doc.setFontSize(9);doc.setTextColor(148,163,184);
    doc.text(`${{META.project}} · Generated by ThreatVision AI`,m,25);
    doc.text(`Date: ${{new Date().toLocaleDateString('en-AU',{{day:'numeric',month:'long',year:'numeric'}})}} · Items: ${{actionPlan.size}}`,m,32);
    y=50;
    const items=[...actionPlan.keys()].map(id=>FD.find(f=>f.id===id)).filter(Boolean);
    items.sort((a,b)=>{{const po={{P0:0,P1:1,P2:2}};return(po[a.priority]-po[b.priority])||((b.risk_score||9)-(a.risk_score||9));}});
    const p0=items.filter(f=>f.priority==='P0').length;const p1=items.filter(f=>f.priority==='P1').length;
    doc.setFillColor(239,246,255);doc.roundedRect(m,y,W-m*2,20,2,2,'F');
    doc.setDrawColor(191,219,254);doc.roundedRect(m,y,W-m*2,20,2,2,'S');
    doc.setFont('helvetica','bold');doc.setFontSize(8);doc.setTextColor(37,99,235);
    doc.text('EXECUTIVE SUMMARY',m+3,y+7);
    doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(71,85,105);
    const cols=[`Total: ${{actionPlan.size}}`,`P0 Critical: ${{p0}}`,`P1 High: ${{p1}}`,`Framework: ${{(META.frameworks||[]).join(', ')||'MITRE ATT&CK'}}`];
    const cw=(W-m*2)/cols.length;
    cols.forEach((t,i)=>doc.text(t,m+3+i*cw,y+14));
    y+=28;
    doc.autoTable({{startY:y,margin:{{left:m,right:m}},
      head:[['ID','Finding','Severity','Score','Owner','Timeline','Assignee','Due Date','Status']],
      body:items.map(f=>{{const mt=actionPlan.get(f.id)||{{}};return[f.id,f.title,f.severity,`${{f.risk_score||9}}/25`,f.owner||'',f.timeline||'',mt.assignee||f.owner||'',mt.dueDate?new Date(mt.dueDate).toLocaleDateString('en-AU'):'—',mt.status||'Open']}}),
      headStyles:{{fillColor:[15,23,42],textColor:255,fontStyle:'bold',fontSize:7.5}},
      bodyStyles:{{fontSize:7.5,cellPadding:2}},
      columnStyles:{{0:{{cellWidth:12,fontStyle:'bold'}},1:{{cellWidth:44}},2:{{cellWidth:14}},3:{{cellWidth:12}},4:{{cellWidth:18}},5:{{cellWidth:14}},6:{{cellWidth:18}},7:{{cellWidth:16}},8:{{cellWidth:14}}}},
      didParseCell:(d)=>{{if(d.section==='body'){{const f=items[d.row.index];if(!f)return;if(d.column.index===2){{const cl=f.severity==='CRITICAL'?[220,38,38]:f.severity==='HIGH'?[234,88,12]:[217,119,6];d.cell.styles.textColor=cl;d.cell.styles.fontStyle='bold';}}if(d.row.index%2===0)d.cell.styles.fillColor=[248,249,251];}}}},
    }});
    y=doc.lastAutoTable.finalY+12;
    items.forEach(f=>{{
      const mt=actionPlan.get(f.id)||{{}};
      if(y>H-50){{doc.addPage();y=m;}}
      const sc2=f.severity==='CRITICAL'?[220,38,38]:f.severity==='HIGH'?[234,88,12]:[217,119,6];
      doc.setFillColor(248,249,251);doc.roundedRect(m,y,W-m*2,12,2,2,'F');
      doc.setDrawColor(226,232,240);doc.roundedRect(m,y,W-m*2,12,2,2,'S');
      doc.setFillColor(...sc2);doc.rect(m,y,3,12,'F');
      doc.setFont('helvetica','bold');doc.setFontSize(9);doc.setTextColor(15,23,42);
      doc.text(`${{f.id}}  ${{f.title}}`,m+5,y+5);
      doc.setFont('helvetica','normal');doc.setFontSize(7.5);doc.setTextColor(148,163,184);
      doc.text(`${{f.tactic||''}} · ${{f.technique_id||''}} · ${{f.timeline||''}} · Assignee: ${{mt.assignee||f.owner||''}} · Status: ${{mt.status||'Open'}}`,m+5,y+10);
      y+=15;
      if(f.verbatim_evidence&&f.verbatim_evidence.length>10){{
        doc.setFillColor(239,246,255);doc.roundedRect(m,y,W-m*2,10,1,1,'F');
        doc.setFont('helvetica','bolditalic');doc.setFontSize(7.5);doc.setTextColor(37,99,235);doc.text('Evidence:',m+3,y+4);
        doc.setFont('helvetica','italic');doc.setTextColor(71,85,105);
        const ev=doc.splitTextToSize(f.verbatim_evidence.slice(0,160),W-m*2-24);
        doc.text(ev[0]||'',m+20,y+4);if(ev[1])doc.text(ev[1],m+3,y+8);
        y+=14;
      }}
      if((f.mitigation_steps||[]).length){{
        doc.setFont('helvetica','bold');doc.setFontSize(7.5);doc.setTextColor(71,85,105);doc.text('Mitigation Steps:',m,y);y+=4;
        f.mitigation_steps.forEach((s,si)=>{{
          if(y>H-18){{doc.addPage();y=m;}}
          doc.setFillColor(...sc2);doc.circle(m+2,y+1.5,1.3,'F');
          doc.setFont('helvetica','normal');doc.setFontSize(7.5);doc.setTextColor(71,85,105);
          const ls=doc.splitTextToSize(s,W-m*2-7);doc.text(ls,m+6,y+2);
          y+=ls.length*4+2;
        }});
      }}
      if(mt.notes){{
        doc.setFillColor(255,251,235);doc.roundedRect(m,y,W-m*2,8,1,1,'F');
        doc.setFont('helvetica','bold');doc.setFontSize(7.5);doc.setTextColor(180,83,9);doc.text('Notes: ',m+3,y+5.5);
        doc.setFont('helvetica','normal');doc.setTextColor(71,85,105);doc.text(mt.notes.slice(0,120),m+16,y+5.5);
        y+=12;
      }}
      y+=6;
    }});
    const pc=doc.internal.getNumberOfPages();
    for(let i=1;i<=pc;i++){{
      doc.setPage(i);doc.setFillColor(248,249,251);doc.rect(0,H-9,W,9,'F');
      doc.setFont('helvetica','normal');doc.setFontSize(7);doc.setTextColor(148,163,184);
      doc.text(`AIOP Threat Assessment — Action Plan · ThreatVision AI · Confidential`,m,H-4);
      doc.text(`Page ${{i}} of ${{pc}}`,W-m,H-4,{{align:'right'}});
    }}
    doc.save(`Action_Plan_${{META.project.replace(/\\s+/g,'_')}}_${{new Date().toISOString().slice(0,10)}}.pdf`);
  }}catch(err){{console.error(err);alert('PDF generation failed.');}}
  finally{{btn.innerHTML='⬇ Export Action Plan as PDF';btn.disabled=false;}}
}}
function printPlan(){{window.print();}}
function esc(s){{const d=document.createElement('div');d.textContent=String(s||'');return d.innerHTML;}}
"""


# ─── HTML BUILDER ────────────────────────────────────────────────────────────

def _domain_card(name: str, score: float, issues: int, severity: str) -> str:
    cls = _sev_cls(severity)
    grade = "D" if score < 4 else "C" if score < 6 else "B" if score < 8 else "A"
    pct = int(score * 10)
    color = SEV_COLOR.get(severity, "#d97706")
    trend = "↓ CRITICAL" if severity == "CRITICAL" else f"↓ {severity}" if severity in ["HIGH", "MEDIUM"] else "↑ Good"
    return f"""
<div class="dc {cls}">
  <div class="dc-top">
    <div><div class="dc-name">{html.escape(name)}</div><div class="dc-issues">{issues} finding{'s' if issues != 1 else ''}</div></div>
    <div class="dc-grade {cls}">{grade}</div>
  </div>
  <div class="dc-bar"><div class="dc-fill" data-w="{pct}" style="background:{color};width:0%"></div></div>
  <div class="dc-score-row"><span class="dc-score">{score:.1f} / 10.0</span><span style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:600;color:{color}">{trend}</span></div>
</div>"""


def _compute_domains(data: Dict[str, Any]) -> list:
    """Derive domain scores from findings."""
    findings = data.get("all_findings", [])
    tactic_counts: Dict[str, list] = {}
    for f in findings:
        tactic = f.get("tactic", "General") or "General"
        tactic_counts.setdefault(tactic, [])
        tactic_counts[tactic].append(f.get("severity", "MEDIUM"))

    domains = []
    for tactic, sevs in list(tactic_counts.items())[:8]:
        worst = "LOW"
        for s in sevs:
            if s == "CRITICAL":
                worst = "CRITICAL"
                break
            elif s == "HIGH":
                worst = "HIGH"
            elif s == "MEDIUM" and worst == "LOW":
                worst = "MEDIUM"
        score_map = {"CRITICAL": 2.5, "HIGH": 4.5, "MEDIUM": 6.5, "LOW": 8.5}
        domains.append((tactic, score_map.get(worst, 6.0), len(sevs), worst))
    # If we have less than 4, pad with generic ones
    while len(domains) < 4:
        domains.append(("Network Security", 7.5, 0, "LOW"))
    return domains[:8]


def generate_html(data: Dict[str, Any], project_name: str = "") -> str:
    """
    Generate the complete self-contained interactive HTML report.
    
    Args:
        data: Structured assessment data (from report_parser.parse_assessment_response)
        project_name: Display name for the project
    
    Returns:
        Complete HTML string ready to serve or store
    """
    if project_name:
        data["project_name"] = project_name

    overall = data.get("overall_risk_rating", "HIGH")
    overall_cls = _sev_cls(overall)
    findings = data.get("all_findings", [])
    recs = data.get("all_recommendations", [])
    sev = data.get("findings_by_severity", {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0})
    fw = data.get("frameworks_used", ["MITRE ATT&CK"])
    ra = data.get("risk_areas_assessed", [])
    adate = data.get("assessment_date", "")
    pname = html.escape(data.get("project_name", project_name or "Project"))

    domains = _compute_domains(data)
    domain_cards_html = "".join(_domain_card(d[0], d[1], d[2], d[3]) for d in domains)

    # Findings table
    findings_count = len(findings)
    crit_count = sev.get("CRITICAL", 0)
    high_count = sev.get("HIGH", 0)
    med_count = sev.get("MEDIUM", 0)
    total_recs = len(recs)
    p0_recs = len([r for r in recs if r.get("priority") == "P0"])
    p1_recs = len([r for r in recs if r.get("priority") == "P1"])
    p2_recs = len([r for r in recs if r.get("priority") == "P2"])

    # Matrix data
    matrix_high_c = sev.get("CRITICAL", 0)
    matrix_high_h = sev.get("HIGH", 0)

    # Kill chain title
    kcs = data.get("kill_chains", [])
    kc_title = kcs[0].get("title", "Primary Attack Scenario") if kcs else "Attack Scenario — Based on Document Evidence"
    kc_sub = f"Risk score: {kcs[0].get('risk_score', 20)}/25 — {len(kcs[0].get('phases', []))} phases" if kcs else "See findings for full detail"

    # Compliance rows
    comp_rows = ""
    for f in findings[:6]:  # Show top 6
        sc2 = _sev_cls(f.get("severity", "MEDIUM"))
        tl = f.get("timeline", "30–90 days")
        comp_rows += f"""<tr>
          <td><span class="fid">{html.escape(f.get('id',''))}</span></td>
          <td><span class="ftitle">{html.escape(f.get('title',''))}</span></td>
          <td><span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--t2)">{html.escape(f.get('tactic',''))}</span></td>
          <td style="font-size:11px;color:var(--t2)">{html.escape(f.get('business_impact','')[:80])}</td>
          <td><span class="pill {sc2}">{html.escape(tl)}</span></td>
        </tr>"""

    js_code = _build_js(data)

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{pname} — Threat Assessment Report</title>
<link href="https://fonts.googleapis.com/css2?family=Epilogue:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js"></script>
<style>{CSS}</style>
</head>
<body>

<nav>
  <div class="nav-brand">
    <div class="nav-logo">
      <div class="nav-logo-icon">🛡</div>
      <div>
        <div class="nav-logo-text">ThreatVision AI</div>
        <div class="nav-logo-sub">Powered by Claude Sonnet</div>
      </div>
    </div>
    <div class="nav-risk">
      <div class="nav-risk-label">Overall Rating</div>
      <div class="nav-risk-val" style="color:var(--{overall_cls})">{overall}</div>
      <div class="nav-risk-sub">{findings_count} total findings</div>
    </div>
  </div>
  <div class="nav-sec">Report Sections</div>
  <a class="nav-item active" href="#overview"><span class="nav-icon">📋</span>Overview<span class="nav-cnt c">{findings_count}</span></a>
  <a class="nav-item" href="#findings"><span class="nav-icon">🔍</span>All Findings<span class="nav-cnt c">{findings_count}</span></a>
  <a class="nav-item" href="#kill-chain"><span class="nav-icon" id="nav-sec03-icon">⛓</span><span id="nav-sec03-label">Threat Phases</span></a>
  <a class="nav-item" href="#matrix"><span class="nav-icon">📊</span>Risk Matrix</a>
  <a class="nav-item" href="#recommendations"><span class="nav-icon">✅</span>Recommendations<span class="nav-cnt ok">{total_recs}</span></a>
  <a class="nav-item" href="#compliance"><span class="nav-icon">📜</span>Compliance</a>
  <a class="nav-item" href="#action-plan"><span class="nav-icon">📋</span>Action Plan<span class="nav-cnt a" id="navApCount" style="display:none">0</span></a>
  <div class="nav-footer">
    {html.escape(pname)}<br>
    {html.escape(adate)}<br>
    {html.escape(', '.join(fw[:2]))}<br>
    Generated by ThreatVision AI
  </div>
</nav>

<main>

<!-- OVERVIEW -->
<section class="sec fade-in" id="overview" style="background:var(--white)">
  <div class="sec-h">
    <span class="sec-num">01</span>
    <div>
      <div class="sec-title">Overview &amp; Risk Scorecard</div>
      <div class="sec-sub">{html.escape(pname)} · Assessment Date: {html.escape(adate)} · Framework: {html.escape(', '.join(fw))}</div>
    </div>
  </div>
  <div class="alert">
    <div class="alert-icon">⚠️</div>
    <div>
      <div class="alert-title">Overall Risk Rating: {overall} — {"Immediate Action Required" if overall == "CRITICAL" else "Review Required"}</div>
      <div class="alert-desc">Comprehensive threat assessment generated for {html.escape(pname)} using {html.escape(', '.join(fw))} framework(s). {len(ra)} specialized risk area(s) assessed: {html.escape(', '.join(ra[:4]))}{"…" if len(ra) > 4 else ""}.</div>
      <div class="ac-row">
        <div class="ac"><div class="ac-val" style="color:var(--c)">{crit_count}</div><div class="ac-lbl">P0 Critical</div></div>
        <div class="ac"><div class="ac-val" style="color:var(--h)">{high_count}</div><div class="ac-lbl">P1 High</div></div>
        <div class="ac"><div class="ac-val" style="color:var(--m)">{med_count}</div><div class="ac-lbl">P2 Medium</div></div>
        <div class="ac"><div class="ac-val" style="color:var(--t2)">{findings_count}</div><div class="ac-lbl">Total Findings</div></div>
        <div class="ac"><div class="ac-val" style="color:var(--a)">{total_recs}</div><div class="ac-lbl">Recommendations</div></div>
        <div class="ac"><div class="ac-val" style="color:var(--a)">{len(fw)}</div><div class="ac-lbl">Frameworks</div></div>
      </div>
    </div>
  </div>
  <div class="meta-strip">
    <div class="meta-cell"><div class="meta-label">Project</div><div class="meta-val">{pname}</div></div>
    <div class="meta-cell"><div class="meta-label">Frameworks</div><div class="meta-val">{html.escape(', '.join(fw))}</div></div>
    <div class="meta-cell"><div class="meta-label">Risk Areas</div><div class="meta-val">{len(ra)} assessed</div></div>
    <div class="meta-cell"><div class="meta-label">Assessment Date</div><div class="meta-val">{html.escape(adate)}</div></div>
  </div>
  <div class="domains-grid">{domain_cards_html}</div>
</section>

<!-- FINDINGS -->
<section class="sec" id="findings">
  <div class="sec-h">
    <span class="sec-num">02</span>
    <div>
      <div class="sec-title">All Findings — {findings_count} Total</div>
      <div class="sec-sub">Click any row to open full detail · Sort by column · Filter by severity · Add to Action Plan</div>
    </div>
  </div>
  <div class="fbar">
    <input class="fsearch" id="fsearch" placeholder="Search findings, techniques, owners…" oninput="filterF()">
    <button class="fbtn fa" onclick="setF(this,'ALL')">All ({findings_count})</button>
    <button class="fbtn" onclick="setF(this,'CRITICAL')">Critical ({crit_count})</button>
    <button class="fbtn" onclick="setF(this,'HIGH')">High ({high_count})</button>
    <button class="fbtn" onclick="setF(this,'MEDIUM')">Medium ({med_count})</button>
  </div>
  <div class="fcount" id="fcount">Showing {findings_count} of {findings_count} findings</div>
  <div class="tbl-wrap">
    <table id="ftable">
      <thead><tr>
        <th onclick="sortT(0)">ID ↕</th><th onclick="sortT(1)">Finding ↕</th>
        <th onclick="sortT(2)"><span id="col-tactic">Category</span> ↕</th>
        <th onclick="sortT(3)"><span id="col-technique">Ref ID</span> ↕</th>
        <th onclick="sortT(4)">Severity ↕</th><th onclick="sortT(5)">L×I ↕</th>
        <th onclick="sortT(6)">Owner ↕</th><th onclick="sortT(7)">Timeline ↕</th>
        <th>Action Plan</th>
      </tr></thead>
      <tbody id="ftbody"></tbody>
    </table>
  </div>
</section>

<!-- KILL CHAIN / THREAT PHASES — title updated dynamically per framework -->
<section class="sec" id="kill-chain">
  <div class="sec-h">
    <span class="sec-num">03</span>
    <div>
      <div class="sec-title"><span id="sec03-icon">⛓ </span><span id="sec03-title">Threat Phase Analysis</span></div>
      <div class="sec-sub" id="sec03-sub">Attack scenario phases — sourced from document evidence · Updated per selected framework</div>
    </div>
  </div>
  <div class="card">
    <div class="card-hdr">
      <div><div class="card-title" id="kc-card-title">{html.escape(kc_title)}</div><div class="card-sub">{html.escape(kc_sub)}</div></div>
      <span class="pill {overall_cls}">{overall} Risk</span>
    </div>
    <div class="card-body">
      <div class="kc-scroll"><div class="kc-phases" id="kc-phases"></div></div>
    </div>
  </div>
</section>

<!-- RISK MATRIX -->
<section class="sec" id="matrix">
  <div class="sec-h">
    <span class="sec-num">04</span>
    <div>
      <div class="sec-title">Risk Priority Matrix</div>
      <div class="sec-sub">Likelihood × Impact · Critical = 16–25 · High = 9–15 · Medium = 6–11</div>
    </div>
  </div>
  <div class="risk-matrix">
    <div class="rm-corner">Asset Value ↓ / Severity →</div>
    <div class="rm-ch" style="color:var(--l)">LOW<br><span style="font-size:8px;font-weight:400">CVSS 0–3.9</span></div>
    <div class="rm-ch" style="color:var(--m)">MEDIUM<br><span style="font-size:8px;font-weight:400">CVSS 4–6.9</span></div>
    <div class="rm-ch" style="color:var(--h)">HIGH<br><span style="font-size:8px;font-weight:400">CVSS 7–8.9</span></div>
    <div class="rm-ch" style="color:var(--c)">CRITICAL<br><span style="font-size:8px;font-weight:400">CVSS 9–10</span></div>
    <div class="rm-rl"><div class="rm-rt">Critical Systems &amp; Sensitive Data</div><div class="rm-rs">HIGH asset value</div></div>
    <div class="rm-cell" style="border-bottom:1px solid var(--bd)"><span class="rm-cnt" style="color:var(--l)">{max(0, med_count - 5)}</span><span class="rm-lbl">Issues</span></div>
    <div class="rm-cell" style="border-bottom:1px solid var(--bd);background:#fffbeb"><span class="rm-cnt" style="color:var(--h)">{high_count}</span><span class="rm-lbl">Issues</span></div>
    <div class="rm-cell" style="border-bottom:1px solid var(--bd);background:#fef9f5"><span class="rm-cnt" style="color:var(--c)">0</span><span class="rm-lbl">Issues</span></div>
    <div class="rm-cell" style="border-bottom:1px solid var(--bd);background:#fef2f2"><span class="rm-cnt" style="color:var(--c)">{crit_count}</span><span class="rm-lbl">Issues</span></div>
    <div class="rm-rl"><div class="rm-rt">Supporting Systems</div><div class="rm-rs">MEDIUM asset value</div></div>
    <div class="rm-cell" style="border-bottom:1px solid var(--bd)"><span class="rm-cnt" style="color:var(--l)">3</span><span class="rm-lbl">Issues</span></div>
    <div class="rm-cell" style="border-bottom:1px solid var(--bd)"><span class="rm-cnt" style="color:var(--m)">{max(0, med_count)}</span><span class="rm-lbl">Issues</span></div>
    <div class="rm-cell" style="border-bottom:1px solid var(--bd)"><span class="rm-cnt" style="color:var(--t3)">0</span><span class="rm-lbl">Issues</span></div>
    <div class="rm-cell" style="border-bottom:1px solid var(--bd)"><span class="rm-cnt" style="color:var(--t3)">0</span><span class="rm-lbl">Issues</span></div>
    <div class="rm-rl"><div class="rm-rt">Logging &amp; Peripherals</div><div class="rm-rs">LOW asset value</div></div>
    <div class="rm-cell"><span class="rm-cnt" style="color:var(--l)">2</span><span class="rm-lbl">Issues</span></div>
    <div class="rm-cell"><span class="rm-cnt" style="color:var(--m)">1</span><span class="rm-lbl">Issues</span></div>
    <div class="rm-cell"><span class="rm-cnt" style="color:var(--t3)">0</span><span class="rm-lbl">Issues</span></div>
    <div class="rm-cell"><span class="rm-cnt" style="color:var(--t3)">0</span><span class="rm-lbl">Issues</span></div>
  </div>
</section>

<!-- RECOMMENDATIONS -->
<section class="sec" id="recommendations">
  <div class="sec-h">
    <span class="sec-num">05</span>
    <div>
      <div class="sec-title">Prioritized Recommendations — {total_recs} Total</div>
      <div class="sec-sub">P0: {p0_recs} critical (0–30 days) · P1: {p1_recs} high (30–90 days) · P2: {p2_recs} medium (90–180 days)</div>
    </div>
  </div>
  <div class="rec-tabs">
    <button class="rtab rc" onclick="swapRec(this,'rp-p0')">P0 Critical — 0–30 Days ({p0_recs})</button>
    <button class="rtab" onclick="swapRec(this,'rp-p1')">P1 High — 30–90 Days ({p1_recs})</button>
    <button class="rtab" onclick="swapRec(this,'rp-p2')">P2 Medium — 90–180 Days ({p2_recs})</button>
  </div>
  <div class="rec-panel active" id="rp-p0"></div>
  <div class="rec-panel" id="rp-p1"></div>
  <div class="rec-panel" id="rp-p2"></div>
</section>

<!-- COMPLIANCE -->
<section class="sec" id="compliance">
  <div class="sec-h">
    <span class="sec-num">06</span>
    <div>
      <div class="sec-title">Key Findings Summary</div>
      <div class="sec-sub">Top findings with business impact and remediation timeline</div>
    </div>
  </div>
  <div class="tbl-wrap">
    <table>
      <thead><tr><th>ID</th><th>Finding</th><th>Tactic</th><th>Business Impact</th><th>Timeline</th></tr></thead>
      <tbody>{comp_rows}</tbody>
    </table>
  </div>
</section>

<!-- ACTION PLAN -->
<section class="sec" id="action-plan" style="background:var(--white)">
  <div class="sec-h">
    <span class="sec-num">07</span>
    <div>
      <div class="sec-title">Action Plan</div>
      <div class="sec-sub">Select findings using "+ Add to Plan" · Assign owners &amp; due dates · Track status · Export as PDF</div>
    </div>
  </div>
  <div id="apEmpty" class="ap-empty">
    <div class="ap-empty-icon">📋</div>
    <div class="ap-empty-title">No items in your Action Plan yet</div>
    <div class="ap-empty-sub">Browse the findings table above and click <strong>"+ Add to Plan"</strong> on any finding to add it here.</div>
  </div>
  <div id="apContent" style="display:none">
    <div class="ap-sum-row" id="apSummary"></div>
    <div class="ap-toolbar">
      <button class="ap-export-btn" onclick="exportPDF()" id="exportBtn">⬇ Export Action Plan as PDF</button>
      <button class="ap-export-btn" onclick="printPlan()" style="background:#475569">🖨 Print</button>
      <button class="ap-clear-btn" onclick="clearAll()">✕ Clear All</button>
      <span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--t3);margin-left:auto" id="apTimestamp"></span>
    </div>
    <div id="apList"></div>
  </div>
</section>

</main>

<!-- FLOATING FAB -->
<button class="ap-fab hidden" id="apFab" onclick="document.getElementById('action-plan').scrollIntoView({{behavior:'smooth'}})">
  <span>📋 Action Plan</span>
  <span class="ap-fab-badge" id="fabCount">0</span>
</button>

<!-- NODE TOOLTIP -->
<div class="node-tip" id="nodeTip">
  <div class="nt-title" id="ntT"></div>
  <div class="nt-row"><span class="nt-label">Severity</span><span class="nt-val" id="ntS"></span></div>
  <div class="nt-row"><span class="nt-label">Source</span><span class="nt-val" id="ntD" style="font-size:10px"></span></div>
  <div class="nt-row" style="flex-direction:column"><span class="nt-label" style="margin-bottom:3px">Evidence</span><div class="nt-quote" id="ntE"></div></div>
  <div class="nt-row"><span class="nt-label">Impact</span><span class="nt-val" id="ntI" style="font-size:11px"></span></div>
  <div class="nt-row"><span class="nt-label">Technique</span><span class="nt-val" id="ntR" style="color:var(--a);font-weight:700"></span></div>
</div>

<!-- FINDING MODAL -->
<div class="modal-overlay" id="mOverlay" onclick="closeM(event)">
  <div class="modal">
    <div class="modal-head">
      <div>
        <div style="display:flex;align-items:center;gap:9px;margin-bottom:5px"><span class="fid" id="mId"></span><span class="pill" id="mPill"></span></div>
        <div style="font-size:16px;font-weight:800;color:var(--t1);line-height:1.3;letter-spacing:-.3px" id="mTitle"></div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--t3);margin-top:4px;font-weight:500" id="mTech"></div>
      </div>
      <button class="modal-close" onclick="document.getElementById('mOverlay').classList.remove('open')">✕</button>
    </div>
    <div class="modal-body">
      <div><div class="mb-title">Document Evidence</div><div class="mb-quote" id="mEv"></div></div>
      <div class="mb-info-grid">
        <div class="mb-info-item"><div class="mb-info-label">Likelihood</div><div class="mb-info-val" id="mL"></div></div>
        <div class="mb-info-item"><div class="mb-info-label">Impact</div><div class="mb-info-val" id="mI"></div></div>
        <div class="mb-info-item"><div class="mb-info-label">Risk Score</div><div class="mb-info-val" id="mSc"></div></div>
        <div class="mb-info-item"><div class="mb-info-label">Priority</div><div class="mb-info-val" id="mPr"></div></div>
        <div class="mb-info-item"><div class="mb-info-label">Owner</div><div class="mb-info-val" id="mOw"></div></div>
        <div class="mb-info-item"><div class="mb-info-label">Timeline</div><div class="mb-info-val" id="mTi"></div></div>
      </div>
      <div><div class="mb-title">Business Impact</div><div style="font-size:12px;color:var(--t2);line-height:1.65" id="mBi"></div></div>
      <div><div class="mb-title">Mitigation Steps</div><ul class="mb-steps" id="mSt"></ul></div>
      <button class="ap-btn" id="mApBtn" onclick="toggleAP(_mfid)" style="width:100%;justify-content:center;padding:10px;font-size:12px;margin-top:4px">+ Add to Action Plan</button>
    </div>
  </div>
</div>

<script>{js_code}</script>
</body>
</html>"""


# ─── CONVENIENCE WRAPPER ──────────────────────────────────────────────────────

def generate_from_raw_response(
    raw_response: str,
    project_name: str = "",
    frameworks: list = None,
    risk_areas: list = None,
) -> tuple:
    """
    One-shot: parse Claude response → generate interactive HTML.
    
    Returns:
        (structured_data, markdown_body, interactive_html)
    """
    from report_parser import parse_assessment_response
    
    data, markdown = parse_assessment_response(
        raw_response, project_name, frameworks, risk_areas
    )
    html_report = generate_html(data, project_name)
    
    logger.info(f"✅ Interactive report generated: {len(html_report):,} chars")
    return data, markdown, html_report
