import React from "react";
import "./ResultsPage.css";

const RISK_META = {
  low:      { label: "Low likelihood", color: "success", emoji: "✅", message: "Your responses suggest a low likelihood of autism spectrum traits. This does not rule out the possibility — consider a professional evaluation if you have ongoing concerns." },
  moderate: { label: "Moderate likelihood", color: "warning", emoji: "⚠️", message: "Your responses suggest some autism spectrum traits. This is not a diagnosis. A qualified professional evaluation is strongly recommended." },
  high:     { label: "High likelihood", color: "danger",  emoji: "🔴", message: "Your responses are consistent with significant autism spectrum traits. Please consult a healthcare professional for a formal clinical evaluation." },
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

function ScoreMeter({ value, max = 100, riskLevel }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="meter">
      <div className="meter__track">
        <div
          className={`meter__fill meter__fill--${riskLevel}`}
          style={{ width: `${pct}%` }}
        />
        <div className="meter__needle" style={{ left: `${pct}%` }} />
      </div>
      <div className="meter__labels">
        <span>Low</span><span>Moderate</span><span>High</span>
      </div>
    </div>
  );
}

export default function ResultsPage({ goTo, results, resultType }) {
  if (!results) return null;

  const isQuestionnaire = resultType === "questionnaire";

  // Normalise fields across both result types
  const riskLevel  = results.riskLevel  || results.risk_level || "low";
  const percentage = results.percentage || 0;
  const meta       = RISK_META[riskLevel] || RISK_META.low;

  return (
    <div className="rpage">
      <nav className="navbar">
        <div className="navbar__brand"><span className="navbar__brand-dot" />SpectrumSense</div>
        <button className="navbar__back" onClick={() => goTo("landing")}>← New assessment</button>
      </nav>

      <div className="container rpage__body">

        {/* Hero result card */}
        <div className={`rpage__hero card card--elevated animate-in rpage__hero--${riskLevel}`}>
          <div className="card__body">
            <div className="rpage__hero-top">
              <div>
                <p className="rpage__hero-label">
                  {isQuestionnaire ? "AQ-10 Screening Result" : "ML Model Result"}
                </p>
                <h1 className="rpage__hero-title">
                  <span className="rpage__hero-emoji">{meta.emoji}</span>
                  {meta.label}
                </h1>
              </div>
              <div className={`badge badge--${meta.color} rpage__risk-badge`}>
                {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} risk
              </div>
            </div>

            {/* Score meter */}
            <div className="mt-24">
              <div className="rpage__score-row">
                <span className="rpage__score-num">{percentage}%</span>
                <span className="text-secondary" style={{ fontSize:"0.875rem" }}>
                  {isQuestionnaire ? "ASD trait score" : "Model confidence"}
                </span>
              </div>
              <ScoreMeter value={percentage} max={100} riskLevel={riskLevel} />
            </div>

            {/* Context */}
            {isQuestionnaire && results.datasetContext && (
              <div className="rpage__context mt-20">
                <div className="rpage__context-item">
                  <span className="text-muted" style={{ fontSize:"0.8rem" }}>AQ score</span>
                  <strong>{results.aqScore} / 10</strong>
                </div>
                <div className="rpage__context-item">
                  <span className="text-muted" style={{ fontSize:"0.8rem" }}>Dataset avg (ASD+)</span>
                  <strong>{results.datasetContext.avgScoreASD}</strong>
                </div>
                <div className="rpage__context-item">
                  <span className="text-muted" style={{ fontSize:"0.8rem" }}>Dataset avg (non-ASD)</span>
                  <strong>{results.datasetContext.avgScoreNonASD}</strong>
                </div>
                <div className="rpage__context-item">
                  <span className="text-muted" style={{ fontSize:"0.8rem" }}>Clinical threshold</span>
                  <strong>≥ {results.datasetContext.clinicalThreshold}</strong>
                </div>
              </div>
            )}

            {!isQuestionnaire && (
              <div className="rpage__context mt-20">
                <div className="rpage__context-item">
                  <span className="text-muted" style={{ fontSize:"0.8rem" }}>ASD probability</span>
                  <strong>{results.percentage}%</strong>
                </div>
                <div className="rpage__context-item">
                  <span className="text-muted" style={{ fontSize:"0.8rem" }}>Non-ASD probability</span>
                  <strong>{results.prob_no}%</strong>
                </div>
                <div className="rpage__context-item">
                  <span className="text-muted" style={{ fontSize:"0.8rem" }}>Model verdict</span>
                  <strong>{results.prediction}</strong>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Message */}
        <div className="rpage__message card animate-in animate-in--delay-1">
          <div className="card__body">
            <p style={{ lineHeight: 1.7, color: "var(--text-secondary)" }}>{meta.message}</p>
          </div>
        </div>

        {/* Flagged traits (questionnaire only) */}
        {isQuestionnaire && results.flaggedReasons && results.flaggedReasons.length > 0 && (
          <div className="animate-in animate-in--delay-2">
            <h2 className="rpage__section-title">Flagged responses</h2>
            <p className="text-secondary" style={{ fontSize:"0.875rem", marginBottom:"16px" }}>
              These answers contributed to your score, sorted by clinical significance.
            </p>
            <div className="rpage__flags">
              {results.flaggedReasons.map((f, i) => (
                <div className={`rpage__flag card animate-in animate-in--delay-${Math.min(i+1,4)}`} key={f.questionId}>
                  <div className="card__body rpage__flag-body">
                    <div className="rpage__flag-top">
                      <span className="rpage__flag-icon">
                        {CATEGORY_ICONS[f.category] || "•"}
                      </span>
                      <div>
                        <p className="rpage__flag-category">{f.categoryLabel}</p>
                        <p className="rpage__flag-q">{f.questionText}</p>
                      </div>
                      <div className={`badge badge--${f.significance === "high" ? "high" : "moderate"} rpage__flag-sig`}>
                        {f.significance}
                      </div>
                    </div>
                    <div className="rpage__flag-answer">
                      Your answer: <strong>{f.yourAnswer}</strong>
                    </div>
                    {f.explanation && (
                      <p className="rpage__flag-explanation">{f.explanation}</p>
                    )}
                    <div className="rpage__flag-power">
                      <span className="text-muted" style={{ fontSize:"0.78rem" }}>Discriminative power</span>
                      <div className="progress-bar" style={{ flex: 1 }}>
                        <div
                          className="progress-bar__fill"
                          style={{ width: `${f.discriminativePower * 100}%` }}
                        />
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

        {/* Category breakdown (questionnaire only) */}
        {isQuestionnaire && results.categoryBreakdown && results.categoryBreakdown.length > 0 && (
          <div className="animate-in animate-in--delay-3">
            <h2 className="rpage__section-title">Category breakdown</h2>
            <div className="rpage__breakdown card">
              <div className="card__body">
                {results.categoryBreakdown.map((c) => (
                  <div className="rpage__breakdown-row" key={c.category}>
                    <span className="rpage__breakdown-icon">{CATEGORY_ICONS[c.category] || "•"}</span>
                    <span className="rpage__breakdown-label">{c.label}</span>
                    <div className="progress-bar" style={{ flex: 1 }}>
                      <div
                        className="progress-bar__fill"
                        style={{ width: `${(c.score / 2) * 100}%` }}
                      />
                    </div>
                    <span className="rpage__breakdown-score">{c.score.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="rpage__disclaimer animate-in animate-in--delay-4">
          <p>{results.disclaimer || "This tool is not a clinical diagnosis. Please consult a qualified healthcare professional for a formal evaluation."}</p>
        </div>

        {/* Actions */}
        <div className="rpage__actions animate-in animate-in--delay-4">
          <button className="btn btn--primary" onClick={() => goTo("landing")}>
            Start new assessment
          </button>
          <button
            className="btn btn--outline"
            onClick={() => goTo(isQuestionnaire ? "questionnaire" : "ml")}
          >
            Retake this assessment
          </button>
        </div>

      </div>
    </div>
  );
}
