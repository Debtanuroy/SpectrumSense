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
    key:      "pitch_std",
    icon:     "🎵",
    label:    "Pitch variability",
    desc:     "Higher atypical variability is associated with ASD. Calibrated from real ASD vs non-ASD audio data.",
    weight:   "35%",
    clinical: "Ma et al. 2024 meta-analysis — pitch std SMD=0.57. ASD shows atypical prosodic variability.",
  },
  {
    key:      "energy_std",
    icon:     "⚡",
    label:    "Energy variation",
    desc:     "Lower energy variation indicates flat affect — reduced emotional expressiveness in speech.",
    weight:   "35%",
    clinical: "Bone et al. 2014 — reduced energy variation correlates with ASD severity.",
  },
  {
    key:      "speech_rate",
    icon:     "🏃",
    label:    "Speech rate",
    desc:     "Slower speech is associated with ASD. Calibrated: ASD ~2.7 vs non-ASD ~4.8.",
    weight:   "25%",
    clinical: "Patel et al. 2020, Ma et al. 2024 — slower speech rate in ASD speakers.",
  },
  {
    key:      "pause_rate",
    icon:     "⏸️",
    label:    "Pause patterns",
    desc:     "Pause frequency per minute. Reliable only on recordings over 45 seconds.",
    weight:   "5%",
    clinical: "Ma et al. 2024 — temporal features weak discriminator (SMD=0.07). Low weight applied.",
  },
];

function ScoreRing({ score, color }) {
  const r    = 54;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  return (
    <svg width="130" height="130" viewBox="0 0 130 130">
      <circle cx="65" cy="65" r={r} fill="none" stroke="var(--surface)" strokeWidth="10" />
      <circle
        cx="65" cy="65" r={r} fill="none"
        stroke={color} strokeWidth="10"
        strokeDasharray={fill + " " + (circ - fill)}
        strokeLinecap="round"
        transform="rotate(-90 65 65)"
        style={{ transition:"stroke-dasharray 1s ease" }}
      />
      <text x="65" y="60" textAnchor="middle" fontSize="22" fontWeight="700"
        fill="var(--text-primary)" fontFamily="DM Serif Display,serif">
        {score}%
      </text>
      <text x="65" y="78" textAnchor="middle" fontSize="11"
        fill="var(--text-muted)" fontFamily="DM Sans,sans-serif">
        overall
      </text>
    </svg>
  );
}

export default function VoiceResultsPage({ goTo, results, goToSuggestion }) {
  if (!results) return null;

  const overallScore = results.overall_score || 0;
  const riskLevel    = results.risk_level    || "low";
  const scores       = results.scores        || {};
  const features     = results.features      || {};
  const interp       = results.interpretation || {};
  const method       = results.method        || "hybrid_calibrated_v4";
  const meta         = RISK_META[riskLevel]  || RISK_META.low;

  return (
    <div className="vr">
      <Navbar currentPage="voice" goTo={goTo} />

      <div className="container vr__body">

        {/* Hero */}
        <div className="vr__hero card card--elevated animate-in"
          style={{ borderTop:"4px solid " + meta.barColor }}>
          <div className="card__body">
            <div className="vr__hero-layout">
              <div className="vr__hero-left">
                <p className="vr__label">Voice Prosody Analysis Result</p>
                <h1 className="vr__title">{meta.emoji} {meta.label}</h1>
                <div className="vr__risk-pill mt-12"
                  style={{ background:meta.bg, color:meta.textColor }}>
                  {riskLevel} risk · {method.replace(/_/g," ")}
                </div>
                {results.duration && (
                  <p className="text-muted mt-12" style={{ fontSize:"0.85rem" }}>
                    Audio duration: <strong>{results.duration}s</strong>
                    {results.duration < 45 && (
                      <span style={{ color:"var(--warning)", marginLeft:8 }}>
                        ⚠ Short clip — pause rate unreliable
                      </span>
                    )}
                  </p>
                )}
              </div>
              <div className="vr__hero-right">
                <ScoreRing score={Math.round(overallScore)} color={meta.barColor} />
              </div>
            </div>

            {/* Score bar */}
            <div className="vr__score-track mt-20">
              <div className="vr__score-fill"
                style={{ width:overallScore + "%", background:meta.barColor }} />
            </div>
            <div className="vr__zone-labels">
              <span style={{ color:"var(--success)" }}>Low (0–44%)</span>
              <span style={{ color:"var(--warning)" }}>Moderate (45–64%)</span>
              <span style={{ color:"var(--danger)" }}>High (65%+)</span>
            </div>
          </div>
        </div>

        {/* Key findings */}
        {Object.values(interp).some(Boolean) && (
          <div className="card animate-in animate-in--delay-1">
            <div className="card__body">
              <h3>Key findings</h3>
              <div className="vr__flags mt-16">
                {interp.pitch_atypical && (
                  <div className="vr__flag vr__flag--high">
                    <span>🎵</span>
                    <div>
                      <strong>Atypical pitch variability detected</strong>
                      <p>Pitch std above 75Hz threshold. Indicates non-conventional prosodic variation. Ma et al. 2024.</p>
                    </div>
                  </div>
                )}
                {interp.flat_affect && (
                  <div className="vr__flag vr__flag--high">
                    <span>⚡</span>
                    <div>
                      <strong>Flat affect detected</strong>
                      <p>Energy std below 0.022 threshold. Indicates reduced emotional expressiveness. Bone et al. 2014.</p>
                    </div>
                  </div>
                )}
                {interp.slow_speech && (
                  <div className="vr__flag vr__flag--moderate">
                    <span>🏃</span>
                    <div>
                      <strong>Slow speech rate detected</strong>
                      <p>Speech rate below 3.2 threshold. Slower speech is associated with ASD. Patel et al. 2020.</p>
                    </div>
                  </div>
                )}
                {interp.excessive_pauses && (
                  <div className="vr__flag vr__flag--moderate">
                    <span>⏸️</span>
                    <div>
                      <strong>Atypical pause frequency</strong>
                      <p>Pause rate above 12 per minute.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Marker breakdown */}
        <div className="animate-in animate-in--delay-2">
          <h2 className="vr__section-title">Marker breakdown</h2>
          <div className="vr__markers">
            {MARKERS.map(function(m, i) {
              var score = scores[m.key] || 0;
              var color = score >= 65 ? "var(--danger)" : score >= 45 ? "var(--warning)" : "var(--success)";
              return (
                <div key={m.key} className={"card animate-in animate-in--delay-" + Math.min(i+1,4)}>
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
                      <div className="vr__marker-score" style={{ color:color }}>{score}%</div>
                    </div>
                    <div className="vr__marker-bar">
                      <div className="vr__marker-fill" style={{ width:score + "%", background:color }} />
                    </div>
                    <p className="vr__marker-desc">{m.desc}</p>
                    {score > 50 && goToSuggestion && (
                      <button
                        className="vr__suggest-btn"
                        onClick={function() {
                          var markerMap = {
                            pitch_std: "pitch_variability",
                            energy_std: "energy_variation",
                            speech_rate: "speech_rate",
                            pause_rate: "speech_rate",
                          };
                          goToSuggestion(markerMap[m.key] || "pitch_variability");
                        }}
                      >
                        💡 View exercises to improve this →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Matplotlib comparison chart */}
        {results.comparison_chart && (
          <div className="card animate-in animate-in--delay-3">
            <div className="card__body">
              <h3>Marker comparison chart</h3>
              <p className="text-muted mt-4" style={{ fontSize:"0.8rem", marginBottom:16 }}>
                Your voice markers compared against ASD and neurotypical reference ranges.
                Generated by matplotlib. Error bars = ±1 SD.
              </p>
              <img
                src={"data:image/png;base64," + results.comparison_chart}
                alt="Voice marker comparison chart"
                style={{ width:"100%", borderRadius:"var(--radius-lg)",
                  border:"1px solid var(--border)" }}
              />
            </div>
          </div>
        )}

        {/* Raw acoustic measurements */}
        {Object.keys(features).length > 0 && (
          <div className="card animate-in animate-in--delay-3">
            <div className="card__body">
              <h3>Raw acoustic measurements</h3>
              <p className="text-muted mt-4" style={{ fontSize:"0.8rem", marginBottom:16 }}>
                Extracted by librosa + Wav2Vec2
              </p>
              <div className="vr__raw-grid">
                {[
                  { label:"Pitch mean",        value:features.pitch_mean + " Hz",       icon:"🎵" },
                  { label:"Pitch std dev",      value:features.pitch_std + " Hz",        icon:"📊" },
                  { label:"Pitch range",        value:features.pitch_range + " Hz",      icon:"↕️" },
                  { label:"Energy std dev",     value:features.energy_std,               icon:"⚡" },
                  { label:"Pause count",        value:features.pause_count,              icon:"⏸️" },
                  { label:"Pause rate / min",   value:features.pause_rate_per_min,       icon:"📈" },
                  { label:"Avg pause duration", value:features.pause_mean_duration + "s",icon:"⏱️" },
                  { label:"Speech rate",        value:features.speech_rate_proxy,        icon:"🏃" },
                  { label:"Spectral centroid",  value:features.spectral_centroid + " Hz",icon:"🔊" },
                  { label:"Duration",           value:features.duration_seconds + "s",   icon:"⏲️" },
                ].map(function(f) {
                  return (
                    <div key={f.label} className="vr__raw-item">
                      <span className="vr__raw-icon">{f.icon}</span>
                      <span className="vr__raw-label">{f.label}</span>
                      <strong className="vr__raw-value">{f.value}</strong>
                    </div>
                  );
                })}
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

        {/* Actions — including Pitch Rider game */}
        <div className="vr__actions animate-in animate-in--delay-4">
          <button className="btn btn--primary"
            onClick={function() { goTo("voice"); }}>
            Analyse another recording
          </button>

          <button className="btn btn--outline"
            onClick={function() { goTo("clinical"); }}>
            Take clinical assessment
          </button>
          <button className="btn btn--ghost"
            onClick={function() { goTo("landing"); }}>
            Home
          </button>
        </div>

      </div>
    </div>
  );
}