import React from "react";
import Navbar from "../components/Navbar";
import "./AQResultsPage.css";

const RISK_META = {
  low:      { label:"Low likelihood",      emoji:"✅", barColor:"var(--success)", bg:"var(--success-light)", text:"var(--success)" },
  moderate: { label:"Moderate likelihood", emoji:"⚠️", barColor:"var(--warning)", bg:"var(--warning-light)", text:"var(--warning)" },
  high:     { label:"High likelihood",     emoji:"🔴", barColor:"var(--danger)",  bg:"var(--danger-light)",  text:"var(--danger)"  },
};

const CATEGORY_ICONS = {
  sensory_sensitivity:  "👂",
  attention_to_detail:  "🔍",
  multitasking:         "🔀",
  task_switching:       "🔄",
  social_communication: "💬",
  social_awareness:     "👥",
  theory_of_mind:       "🧠",
  restricted_interests: "📌",
  social_cognition:     "😊",
};

export default function AQResultsPage({ goTo, results }) {
  if (!results) return null;

  const { riskLevel, percentage, aqScore, flaggedReasons, categoryBreakdown, datasetContext, disclaimer } = results;
  const meta = RISK_META[riskLevel] || RISK_META.low;

  return (
    <div className="aqr">
      <Navbar currentPage="questionnaire" goTo={goTo} />

      <div className="container aqr__body">

        {/* Hero */}
        <div className="aqr__hero card card--elevated animate-in" style={{ borderTop:`4px solid ${meta.barColor}` }}>
          <div className="card__body">
            <div className="aqr__hero-top">
              <div>
                <p className="aqr__label">AQ-10 Preliminary Screen Result</p>
                <h1 className="aqr__title">{meta.emoji} {meta.label}</h1>
              </div>
              <div className="aqr__risk-pill" style={{ background: meta.bg, color: meta.text }}>
                {riskLevel} risk
              </div>
            </div>

            {/* Score meter */}
            <div className="mt-20">
              <div className="aqr__score-row">
                <span className="aqr__score-num">{percentage}%</span>
                <span className="text-secondary" style={{ fontSize:"0.875rem" }}>ASD trait score</span>
              </div>
              <div className="aqr__meter">
                <div className="aqr__meter-fill" style={{ width:`${percentage}%`, background: meta.barColor }} />
              </div>
              <div className="aqr__meter-labels">
                <span>Low (0–40%)</span><span>Moderate (40–60%)</span><span>High (60%+)</span>
              </div>
            </div>

            {/* Dataset context */}
            {datasetContext && (
              <div className="aqr__context mt-20">
                <div className="aqr__context-item">
                  <span className="text-muted" style={{ fontSize:"0.78rem" }}>Your AQ score</span>
                  <strong>{aqScore} / 10</strong>
                </div>
                <div className="aqr__context-item">
                  <span className="text-muted" style={{ fontSize:"0.78rem" }}>Dataset avg (ASD+)</span>
                  <strong>{datasetContext.avgScoreASD}</strong>
                </div>
                <div className="aqr__context-item">
                  <span className="text-muted" style={{ fontSize:"0.78rem" }}>Dataset avg (non-ASD)</span>
                  <strong>{datasetContext.avgScoreNonASD}</strong>
                </div>
                <div className="aqr__context-item">
                  <span className="text-muted" style={{ fontSize:"0.78rem" }}>Clinical threshold</span>
                  <strong>≥ {datasetContext.clinicalThreshold}</strong>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* What this means */}
        <div className="card animate-in animate-in--delay-1">
          <div className="card__body">
            <h3>What this means</h3>
            <p className="text-secondary mt-8" style={{ lineHeight:1.7 }}>
              The AQ-10 is a <strong>preliminary screening tool</strong> — not a diagnosis. It identifies
              whether a full clinical assessment may be warranted. A score of 6 or above on the AQ-10 is
              the threshold used in clinical practice to recommend further evaluation.
            </p>
            {(riskLevel === "moderate" || riskLevel === "high") && (
              <div className="aqr__cta-box mt-16">
                <span>Want a deeper, domain-by-domain clinical assessment?</span>
                <button className="btn btn--primary btn--sm" onClick={() => goTo("clinical")}>
                  Take the full DSM-5 assessment →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Flagged responses */}
        {flaggedReasons && flaggedReasons.length > 0 && (
          <div className="animate-in animate-in--delay-2">
            <h2 className="aqr__section-title">Flagged responses</h2>
            <p className="text-secondary" style={{ fontSize:"0.875rem", marginBottom:16 }}>
              These answers contributed to your score, sorted by clinical significance.
            </p>
            <div className="aqr__flags">
              {flaggedReasons.map((f, i) => (
                <div className={`card animate-in animate-in--delay-${Math.min(i+1,4)}`} key={f.questionId}>
                  <div className="card__body aqr__flag-body">
                    <div className="aqr__flag-top">
                      <span className="aqr__flag-icon">{CATEGORY_ICONS[f.category] || "•"}</span>
                      <div>
                        <p className="aqr__flag-category">{f.categoryLabel}</p>
                        <p className="aqr__flag-q">{f.questionText}</p>
                      </div>
                      <div className={`badge badge--${f.significance === "high" ? "high" : "moderate"}`} style={{ flexShrink:0 }}>
                        {f.significance}
                      </div>
                    </div>
                    <div className="aqr__flag-answer">Your answer: <strong>{f.yourAnswer}</strong></div>
                    {f.explanation && (
                      <p className="aqr__flag-explanation">{f.explanation}</p>
                    )}
                    <div className="aqr__flag-power">
                      <span className="text-muted" style={{ fontSize:"0.78rem" }}>Discriminative power</span>
                      <div className="progress-bar" style={{ flex:1 }}>
                        <div className="progress-bar__fill" style={{ width:`${f.discriminativePower * 100}%` }} />
                      </div>
                      <span style={{ fontSize:"0.78rem", color:"var(--text-secondary)" }}>
                        {(f.discriminativePower * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category breakdown */}
        {categoryBreakdown && categoryBreakdown.length > 0 && (
          <div className="animate-in animate-in--delay-3">
            <h2 className="aqr__section-title">Category breakdown</h2>
            <div className="card">
              <div className="card__body">
                {categoryBreakdown.map((c) => (
                  <div className="aqr__breakdown-row" key={c.category}>
                    <span>{CATEGORY_ICONS[c.category] || "•"}</span>
                    <span className="aqr__breakdown-label">{c.label}</span>
                    <div className="progress-bar" style={{ flex:1 }}>
                      <div className="progress-bar__fill" style={{ width:`${(c.score / 2) * 100}%` }} />
                    </div>
                    <span style={{ fontSize:"0.875rem", fontWeight:600, width:30, textAlign:"right" }}>{c.score.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="aqr__disclaimer animate-in animate-in--delay-4">
          <span>⚕️</span>
          <p>{disclaimer || "This tool is not a clinical diagnosis. Consult a qualified healthcare professional for a formal evaluation."}</p>
        </div>

        {/* Actions */}
        <div className="aqr__actions animate-in animate-in--delay-4">
          <button className="btn btn--primary" onClick={() => goTo("questionnaire")}>Retake AQ-10</button>
          <button className="btn btn--outline" onClick={() => goTo("clinical")}>Take full DSM-5 assessment</button>
          <button className="btn btn--ghost"   onClick={() => goTo("landing")}>Home</button>
        </div>

      </div>
    </div>
  );
}