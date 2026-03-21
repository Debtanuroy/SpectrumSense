import React from "react";
import Navbar from "../components/Navbar";
import "./VoiceResultsPage.css";

const RISK_META = {
  low:      { label:"Low indicators",      emoji:"✅", barColor:"var(--success)", bg:"var(--success-light)", textColor:"var(--success)" },
  moderate: { label:"Moderate indicators", emoji:"⚠️", barColor:"var(--warning)", bg:"var(--warning-light)", textColor:"var(--warning)" },
  high:     { label:"High indicators",     emoji:"🔴", barColor:"var(--danger)",  bg:"var(--danger-light)",  textColor:"var(--danger)"  },
};

const MARKERS = [
  {
    key:    "monotone_score",
    icon:   "🎵",
    label:  "Pitch monotonicity",
    desc:   "Measures variation in fundamental frequency (F0). Low variation indicates monotone speech — one of the strongest vocal autism markers.",
    weight: "35%",
    clinical: "Reduced prosodic variation is documented in DSM-5 and ADOS-2 assessment criteria.",
  },
  {
    key:    "pause_score",
    icon:   "⏸️",
    label:  "Pause patterns",
    desc:   "Counts frequency and duration of silence segments. Atypical pause distribution reflects differences in turn-taking and speech planning.",
    weight: "30%",
    clinical: "Pause anomalies are consistent with pragmatic language differences in autism.",
  },
  {
    key:    "flat_affect_score",
    icon:   "⚡",
    label:  "Energy variation",
    desc:   "Measures amplitude variation across the recording. Low variation indicates flat affect — reduced emotional expressiveness in speech.",
    weight: "20%",
    clinical: "Flat affect is a recognised feature in autism spectrum presentations.",
  },
  {
    key:    "rate_score",
    icon:   "🏃",
    label:  "Speech rate",
    desc:   "Compares speech rate to neurotypical baseline. Both unusually fast and unusually slow rates are indicative.",
    weight: "15%",
    clinical: "Atypical speech rate is associated with motor speech differences in autism.",
  },
];

function ScoreRing({ score, color }) {
  const r   = 54;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  return (
    <svg width="130" height="130" viewBox="0 0 130 130">
      <circle cx="65" cy="65" r={r} fill="none" stroke="var(--surface)" strokeWidth="10" />
      <circle
        cx="65" cy="65" r={r} fill="none"
        stroke={color} strokeWidth="10"
        strokeDasharray={`${fill} ${circ - fill}`}
        strokeLinecap="round"
        transform="rotate(-90 65 65)"
        style={{ transition:"stroke-dasharray 1s ease" }}
      />
      <text x="65" y="60" textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--text-primary)" fontFamily="DM Serif Display,serif">
        {score}%
      </text>
      <text x="65" y="78" textAnchor="middle" fontSize="11" fill="var(--text-muted)" fontFamily="DM Sans,sans-serif">
        overall
      </text>
    </svg>
  );
}

export default function VoiceResultsPage({ goTo, results }) {
  if (!results) return null;

  const overallScore = results.overall_score || 0;
  const riskLevel    = results.risk_level    || "low";
  const scores       = results.scores        || {};
  const features     = results.features      || {};
  const interp       = results.interpretation || {};
  const method       = results.method        || "rule_based";
  const meta         = RISK_META[riskLevel]  || RISK_META.low;

  return (
    <div className="vr">
      <Navbar currentPage="voice" goTo={goTo} />

      <div className="container vr__body">

        {/* Hero */}
        <div className="vr__hero card card--elevated animate-in" style={{ borderTop:`4px solid ${meta.barColor}` }}>
          <div className="card__body">
            <div className="vr__hero-layout">
              <div className="vr__hero-left">
                <p className="vr__label">Voice Prosody Analysis Result</p>
                <h1 className="vr__title">{meta.emoji} {meta.label}</h1>
                <div className="vr__risk-pill mt-12" style={{ background:meta.bg, color:meta.textColor }}>
                  {riskLevel} risk · {method === "ml_model" ? "ML model" : "Clinical rule-based"}
                </div>
                {results.duration && (
                  <p className="text-muted mt-12" style={{ fontSize:"0.85rem" }}>
                    Audio duration: <strong>{results.duration}s</strong>
                  </p>
                )}
              </div>
              <div className="vr__hero-right">
                <ScoreRing score={Math.round(overallScore)} color={meta.barColor} />
              </div>
            </div>

            {/* Score bar */}
            <div className="vr__score-track mt-20">
              <div className="vr__score-fill" style={{ width:`${overallScore}%`, background:meta.barColor }} />
            </div>
            <div className="vr__zone-labels">
              <span style={{ color:"var(--success)" }}>Low (0–44%)</span>
              <span style={{ color:"var(--warning)" }}>Moderate (45–69%)</span>
              <span style={{ color:"var(--danger)" }}>High (70%+)</span>
            </div>
          </div>
        </div>

        {/* Interpretation flags */}
        {Object.values(interp).some(Boolean) && (
          <div className="card animate-in animate-in--delay-1">
            <div className="card__body">
              <h3>Key findings</h3>
              <div className="vr__flags mt-16">
                {interp.monotone_speech && (
                  <div className="vr__flag vr__flag--high">
                    <span>🎵</span>
                    <div>
                      <strong>Monotone speech detected</strong>
                      <p>Pitch standard deviation below clinical threshold (25Hz). Indicates reduced prosodic variation.</p>
                    </div>
                  </div>
                )}
                {interp.flat_affect && (
                  <div className="vr__flag vr__flag--high">
                    <span>⚡</span>
                    <div>
                      <strong>Flat affect detected</strong>
                      <p>Energy variation below threshold (0.04). Indicates reduced emotional expressiveness in speech.</p>
                    </div>
                  </div>
                )}
                {interp.excessive_pauses && (
                  <div className="vr__flag vr__flag--moderate">
                    <span>⏸️</span>
                    <div>
                      <strong>Atypical pause frequency</strong>
                      <p>Pause rate above 15 per minute. Indicates differences in speech rhythm and turn-taking.</p>
                    </div>
                  </div>
                )}
                {!Object.values(interp).some(Boolean) && (
                  <div className="vr__flag vr__flag--low">
                    <span>✅</span>
                    <div><strong>No strong individual markers detected</strong></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 4 marker breakdown */}
        <div className="animate-in animate-in--delay-2">
          <h2 className="vr__section-title">Marker breakdown</h2>
          <div className="vr__markers">
            {MARKERS.map((m, i) => {
              const score = scores[m.key] || 0;
              const color = score >= 70 ? "var(--danger)" : score >= 45 ? "var(--warning)" : "var(--success)";
              return (
                <div key={m.key} className={`vr__marker card animate-in animate-in--delay-${Math.min(i+1,4)}`}>
                  <div className="card__body vr__marker-body">
                    <div className="vr__marker-top">
                      <span className="vr__marker-icon">{m.icon}</span>
                      <div className="vr__marker-info">
                        <div className="vr__marker-label">
                          {m.label}
                          <span className="vr__marker-weight">{m.weight}</span>
                        </div>
                        <div className="vr__marker-clinical">{m.clinical}</div>
                      </div>
                      <div className="vr__marker-score" style={{ color }}>{score}%</div>
                    </div>
                    <div className="vr__marker-bar">
                      <div className="vr__marker-fill" style={{ width:`${score}%`, background: color }} />
                    </div>
                    <p className="vr__marker-desc">{m.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Raw acoustic features */}
        {Object.keys(features).length > 0 && (
          <div className="card animate-in animate-in--delay-3">
            <div className="card__body">
              <h3>Raw acoustic measurements</h3>
              <p className="text-muted mt-4" style={{ fontSize:"0.8rem", marginBottom:16 }}>
                Extracted by librosa + Wav2Vec2
              </p>
              <div className="vr__raw-grid">
                {[
                  { label:"Pitch mean",         value:`${features.pitch_mean} Hz`,       icon:"🎵" },
                  { label:"Pitch std dev",       value:`${features.pitch_std} Hz`,        icon:"📊" },
                  { label:"Pitch range",         value:`${features.pitch_range} Hz`,      icon:"↕️" },
                  { label:"Energy std dev",      value:features.energy_std,               icon:"⚡" },
                  { label:"Pause count",         value:features.pause_count,              icon:"⏸️" },
                  { label:"Pause rate / min",    value:features.pause_rate_per_min,       icon:"📈" },
                  { label:"Avg pause duration",  value:`${features.pause_mean_duration}s`,icon:"⏱️" },
                  { label:"Speech rate",         value:features.speech_rate_proxy,        icon:"🏃" },
                  { label:"Spectral centroid",   value:`${features.spectral_centroid} Hz`,icon:"🔊" },
                  { label:"Duration",            value:`${features.duration_seconds}s`,   icon:"⏲️" },
                ].map(f => (
                  <div key={f.label} className="vr__raw-item">
                    <span className="vr__raw-icon">{f.icon}</span>
                    <span className="vr__raw-label">{f.label}</span>
                    <strong className="vr__raw-value">{f.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="vr__disclaimer animate-in animate-in--delay-4">
          <span>⚕️</span>
          <p>
            Voice prosody analysis is a supplementary screening signal only. It is not a
            clinical diagnosis. Results should be interpreted alongside questionnaire
            findings and a formal clinical evaluation.
          </p>
        </div>

        {/* Actions */}
        <div className="vr__actions animate-in animate-in--delay-4">
          <button className="btn btn--primary"  onClick={() => goTo("voice")}>Analyse another recording</button>
          <button className="btn btn--outline"  onClick={() => goTo("clinical")}>Take clinical assessment</button>
          <button className="btn btn--ghost"    onClick={() => goTo("landing")}>Home</button>
        </div>

      </div>
    </div>
  );
}