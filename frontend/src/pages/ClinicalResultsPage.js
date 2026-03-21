import React from "react";
import Navbar from "../components/Navbar";
import "./ClinicalResultsPage.css";

const RISK_META = {
  low:      { label:"Low indicators",        emoji:"✅", barColor:"var(--success)", bg:"var(--success-light)", textColor:"var(--success)" },
  moderate: { label:"Moderate indicators",   emoji:"⚠️", barColor:"var(--warning)", bg:"var(--warning-light)", textColor:"var(--warning)" },
  high:     { label:"High indicators",       emoji:"🔴", barColor:"var(--danger)",  bg:"var(--danger-light)",  textColor:"var(--danger)"  },
  very_high:{ label:"Very high indicators",  emoji:"🔴", barColor:"var(--danger)",  bg:"var(--danger-light)",  textColor:"var(--danger)"  },
};

function RadarChart({ domains }) {
  if (!domains || domains.length === 0) return null;
  const cx = 220, cy = 220, r = 155;
  const n  = domains.length;
  const angleFor = i => (Math.PI * 2 * i) / n - Math.PI / 2;
  const ptFor    = (i, radius) => ({
    x: cx + radius * Math.cos(angleFor(i)),
    y: cy + radius * Math.sin(angleFor(i)),
  });
  const rings = [20, 40, 60, 80, 100];
  const dataPoints = domains.map((d, i) => ptFor(i, ((d.score || 0) / 100) * r));
  const dataPath   = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + " Z";

  return (
    <svg viewBox="0 0 440 440" width="100%" style={{ maxWidth:420, display:"block", margin:"0 auto" }}>
      {rings.map(pct => {
        const pts  = domains.map((_, i) => ptFor(i, (pct / 100) * r));
        const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + " Z";
        return <path key={pct} d={path} fill="none" stroke="var(--border)" strokeWidth="1" />;
      })}
      {domains.map((_, i) => {
        const pt = ptFor(i, r);
        return <line key={i} x1={cx} y1={cy} x2={pt.x.toFixed(1)} y2={pt.y.toFixed(1)} stroke="var(--border)" strokeWidth="1" />;
      })}
      <path d={dataPath} fill="rgba(26,110,245,0.15)" stroke="#1a6ef5" strokeWidth="2.5" strokeLinejoin="round" />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="5" fill={domains[i].color || "#1a6ef5"} stroke="white" strokeWidth="2" />
      ))}
      {domains.map((d, i) => {
        const angle  = angleFor(i);
        const lx     = cx + (r + 34) * Math.cos(angle);
        const ly     = cy + (r + 34) * Math.sin(angle);
        const anchor = lx < cx - 10 ? "end" : lx > cx + 10 ? "start" : "middle";
        return (
          <g key={i}>
            <text x={lx.toFixed(1)} y={(ly - 8).toFixed(1)} textAnchor={anchor} fontSize="13" fontWeight="600" fill={d.color || "#1a6ef5"} fontFamily="DM Sans,sans-serif">{d.icon}</text>
            <text x={lx.toFixed(1)} y={(ly + 8).toFixed(1)} textAnchor={anchor} fontSize="11" fill="var(--text-secondary)" fontFamily="DM Sans,sans-serif">{d.score}%</text>
          </g>
        );
      })}
      <text x={cx} y={cy - 8} textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--text-primary)" fontFamily="DM Serif Display,serif">
        {Math.round(domains.reduce((s, d) => s + (d.score || 0), 0) / domains.length)}%
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="11" fill="var(--text-muted)" fontFamily="DM Sans,sans-serif">overall</text>
    </svg>
  );
}

export default function ClinicalResultsPage({ goTo, results }) {
  if (!results) return null;

  // Destructure once — safely
  const overallScore = results.overallScore  || 0;
  const riskLevel    = results.riskLevel     || "low";
  const riskMeta     = results.riskMeta      || {};
  const domains      = results.domains       || [];
  const devAnswers   = results.devAnswers     || [];
  const disclaimer   = results.disclaimer    || "";

  const meta = RISK_META[riskLevel] || RISK_META.low;

  // Safety: if domains is still empty show a debug view
  if (domains.length === 0) {
    return (
      <div className="cr">
        <Navbar currentPage="clinical" goTo={goTo} />
        <div className="container cr__body" style={{ paddingTop:60 }}>
          <h2>No domain data received</h2>
          <p className="text-secondary mt-8">Raw result from backend:</p>
          <pre style={{ fontSize:"0.75rem", marginTop:16, background:"var(--surface)", padding:16, borderRadius:8, overflow:"auto", whiteSpace:"pre-wrap" }}>
            {JSON.stringify(results, null, 2)}
          </pre>
          <button className="btn btn--ghost mt-24" onClick={() => goTo("clinical")}>← Try again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cr">
      <Navbar currentPage="clinical" goTo={goTo} />

      <div className="container cr__body">

        {/* ── Hero result card ── */}
        <div className="cr__hero card card--elevated animate-in" style={{ borderTop:`4px solid ${meta.barColor}` }}>
          <div className="card__body">
            <div className="cr__hero-top">
              <div>
                <p className="cr__hero-label">Full Clinical Assessment Result</p>
                <h1 className="cr__hero-title">{meta.emoji} {meta.label}</h1>
                <p className="cr__hero-score">Overall score: <strong>{overallScore}%</strong></p>
              </div>
              <div className="cr__risk-pill" style={{ background: meta.bg, color: meta.textColor }}>
                {riskLevel.replace("_", " ")} risk
              </div>
            </div>

            {/* Score track */}
            <div className="cr__score-track mt-20">
              <div className="cr__score-fill" style={{ width:`${overallScore}%`, background: meta.barColor }} />
            </div>
            <div className="cr__zone-labels">
              <span style={{ color:"var(--success)" }}>Low (0–30%)</span>
              <span style={{ color:"var(--warning)" }}>Moderate (31–55%)</span>
              <span style={{ color:"var(--danger)" }}>High (56–75%)</span>
              <span style={{ color:"var(--danger)" }}>Very High (76%+)</span>
            </div>
          </div>
        </div>

        {/* ── Recommendation ── */}
        <div className="card animate-in animate-in--delay-1">
          <div className="card__body">
            <h3>Clinical recommendation</h3>
            <p className="text-secondary mt-8" style={{ lineHeight:1.7 }}>
              {riskMeta.recommendation || "Please consult a qualified healthcare professional for a formal evaluation."}
            </p>
          </div>
        </div>

        {/* ── Radar + domain breakdown ── */}
        <div className="cr__analysis animate-in animate-in--delay-2">

          {/* Radar */}
          <div className="card cr__radar-card">
            <div className="card__body">
              <h3 className="cr__section-title">Domain radar</h3>
              <p className="text-muted mt-4" style={{ fontSize:"0.8rem", marginBottom:16 }}>
                Each axis shows % score for that domain (0 = low, 100 = very high)
              </p>
              <RadarChart domains={domains} />
              <div className="cr__radar-legend">
                {domains.map(d => (
                  <div key={d.key} className="cr__legend-item">
                    <span className="cr__legend-dot" style={{ background: d.color }} />
                    <span>{d.icon} {d.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Domain list */}
          <div className="cr__domains-col">
            <h3 className="cr__section-title">Domain breakdown</h3>
            <div className="cr__domain-list">
              {[...domains].sort((a, b) => b.score - a.score).map((d, i) => (
                <div key={d.key} className={`card animate-in animate-in--delay-${Math.min(i+1,4)}`}>
                  <div className="card__body cr__domain-body">
                    <div className="cr__domain-top">
                      <span className="cr__domain-icon">{d.icon}</span>
                      <div className="cr__domain-info">
                        <div className="cr__domain-label">{d.label}</div>
                        <div className="cr__domain-basis">{d.clinicalBasis}</div>
                      </div>
                      <div className="cr__domain-score" style={{ color: d.score >= 56 ? "var(--danger)" : d.score >= 31 ? "var(--warning)" : "var(--success)" }}>
                        {d.score}%
                      </div>
                    </div>
                    <div className="cr__domain-bar">
                      <div className="cr__domain-bar-fill" style={{ width:`${d.score}%`, background: d.color }} />
                    </div>
                    <p className="cr__domain-desc">{d.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Highly endorsed items ── */}
        {domains.some(d => (d.responses || []).some(r => r.scorePct >= 75)) && (
          <div className="animate-in animate-in--delay-3">
            <h3 className="cr__section-title">Highly endorsed items</h3>
            <p className="text-secondary mt-4" style={{ fontSize:"0.875rem", marginBottom:16 }}>
              Questions where you responded "Often" or "Always" — the strongest individual indicators.
            </p>
            <div className="cr__flagged">
              {domains
                .flatMap(d => (d.responses || [])
                  .filter(r => r.scorePct >= 75)
                  .map(r => ({ ...r, domainLabel: d.label, domainIcon: d.icon, domainColor: d.color }))
                )
                .sort((a, b) => b.scorePct - a.scorePct)
                .map((r, i) => (
                  <div key={i} className="card">
                    <div className="card__body cr__flagged-body">
                      <div className="cr__flagged-meta">
                        <span>{r.domainIcon}</span>
                        <span style={{ color: r.domainColor, fontSize:"0.78rem", fontWeight:600 }}>{r.domainLabel}</span>
                        <span className="badge badge--high" style={{ marginLeft:"auto" }}>{r.label}</span>
                      </div>
                      <p className="cr__flagged-q">{r.questionText}</p>
                      <div className="cr__flagged-bar">
                        <div style={{ width:`${r.scorePct}%`, height:"100%", background: r.domainColor, borderRadius:"999px" }} />
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {/* ── Developmental background ── */}
        {devAnswers.length > 0 && (
          <div className="card animate-in animate-in--delay-4">
            <div className="card__body">
              <h3>Developmental background</h3>
              <p className="text-muted mt-4" style={{ fontSize:"0.8rem", marginBottom:16 }}>Informational — not scored</p>
              <div className="cr__dev-list">
                {devAnswers.map((a, i) => (
                  <div key={i} className="cr__dev-item">
                    <p className="cr__dev-q">{a.questionText}</p>
                    <p className="cr__dev-a">{Array.isArray(a.value) ? a.value.join(", ") : a.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Disclaimer ── */}
        <div className="cr__disclaimer animate-in animate-in--delay-4">
          <span>⚕️</span>
          <p>{disclaimer || "This assessment is a screening tool only and does not constitute a clinical diagnosis. A formal evaluation by a qualified clinical psychologist is required for diagnosis."}</p>
        </div>

        {/* ── Actions ── */}
        <div className="cr__actions animate-in animate-in--delay-4">
          <button className="btn btn--primary"  onClick={() => goTo("landing")}>Back to home</button>
          <button className="btn btn--outline"  onClick={() => goTo("clinical")}>Retake assessment</button>
          <button className="btn btn--ghost"    onClick={() => goTo("questionnaire")}>Take AQ-10 quick screen</button>
        </div>

      </div>
    </div>
  );
}