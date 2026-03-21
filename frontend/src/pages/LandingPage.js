import React from "react";
import "./LandingPage.css";
import Navbar from "../components/Navbar";

const ASSESSMENTS = [
  {
    icon:     "⚡",
    tag:      "5 minutes",
    tagColor: "#1a6ef5",
    title:    "Preliminary Screen",
    subtitle: "AQ-10 Questionnaire",
    desc:     "10 clinically validated questions from the Autism-Spectrum Quotient (AQ-10) instrument. A fast initial check used in clinical practice to determine whether a full assessment is needed.",
    bullets:  ["10 questions", "Yes / No style responses", "Instant score with flagged items", "Based on NICE clinical guidelines"],
    action:   "questionnaire",
    label:    "Start preliminary screen",
  },
  {
    icon:     "🔬",
    tag:      "15–20 minutes",
    tagColor: "#8b5cf6",
    title:    "Full Clinical Assessment",
    subtitle: "DSM-5 Aligned · 6 Domains · 31 Questions",
    desc:     "A comprehensive screen across all DSM-5 autism diagnostic domains. Rated 1–5 on a Likert scale to capture the full spectrum of trait severity rather than a binary yes/no.",
    bullets:  ["31 scored questions", "1–5 spectrum rating", "6 DSM-5 domains", "Per-domain radar chart"],
    action:   "clinical",
    label:    "Start clinical assessment",
    recommended: true,
  },
  {
    icon:     "🎤",
    tag:      "Upload audio",
    tagColor: "#0d9660",
    title:    "Voice Analysis",
    subtitle: "Wav2Vec2 · Prosody · 4 markers",
    desc:     "Upload a speech recording for automated prosody analysis — pitch variation, pause patterns, energy, and speech rate. All clinically associated with autism spectrum speech profiles.",
    bullets:  ["Upload WAV/MP3/M4A", "Wav2Vec2 deep analysis", "4 clinical markers", "Separate results report"],
    action:   "voice",
    label:    "Start voice analysis",
  },
];

const DOMAINS = [
  { icon:"💬", label:"Social Communication",           basis:"DSM-5 Criterion A" },
  { icon:"🔁", label:"Restricted & Repetitive",        basis:"DSM-5 Criterion B" },
  { icon:"👂", label:"Sensory Processing",              basis:"DSM-5 Criterion B4" },
  { icon:"🧩", label:"Executive Function",              basis:"Associated feature" },
  { icon:"🎭", label:"Emotional Regulation & Masking",  basis:"Masking / Alexithymia" },
  { icon:"📋", label:"Developmental Background",        basis:"Clinical intake" },
];

export default function LandingPage({ goTo }) {
  return (
    <div className="landing">
      <Navbar currentPage="landing" goTo={goTo} />

      {/* Hero */}
      <section className="landing__hero container">
        <div className="landing__hero-content animate-in">
          <div className="landing__eyebrow">
            <span className="landing__eyebrow-dot" />
            Autism spectrum screening
          </div>
          <h1 className="landing__headline">
            Structured screening,<br />
            <em>spectrum-aware.</em>
          </h1>
          <p className="landing__sub">
            SpectrumSense offers three levels of autism spectrum screening —
            a fast preliminary check, a full DSM-5 aligned clinical assessment,
            and AI-powered voice prosody analysis. All processing is local.
            No data is stored.
          </p>
          <div className="landing__hero-cta animate-in animate-in--delay-2">
            <button className="btn btn--primary btn--lg" onClick={() => goTo("clinical")}>
              Start clinical assessment
            </button>
            <button className="btn btn--ghost btn--lg" onClick={() => goTo("questionnaire")}>
              Quick AQ-10 screen →
            </button>
          </div>
        </div>
        <div className="landing__hero-visual animate-in animate-in--delay-1">
          <div className="landing__pulse-ring" />
          <div className="landing__pulse-ring landing__pulse-ring--2" />
          <div className="landing__brain-icon">🧩</div>
        </div>
      </section>

      {/* Stats */}
      <section className="landing__stats">
        <div className="container container--wide landing__stats-inner">
          {[
            { value:"AQ-10",  label:"Validated quick screen" },
            { value:"DSM-5",  label:"Clinical framework" },
            { value:"31",     label:"Clinical questions" },
            { value:"Wav2Vec2", label:"Voice AI model" },
          ].map(s => (
            <div className="landing__stat" key={s.label}>
              <span className="landing__stat-value">{s.value}</span>
              <span className="landing__stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Three assessment cards */}
      <section className="landing__assessments container container--wide">
        <h2 className="landing__section-title animate-in">Choose your assessment</h2>
        <div className="landing__three-cards">
          {ASSESSMENTS.map((a, i) => (
            <div
              key={a.action}
              className={`landing__assess-card animate-in animate-in--delay-${i+1} ${a.recommended ? "landing__assess-card--featured" : ""}`}
              style={a.recommended ? { borderColor: a.tagColor } : {}}
            >
              {a.recommended && (
                <div className="landing__assess-badge" style={{ background: a.tagColor }}>
                  Recommended for comprehensive screening
                </div>
              )}
              <div className="landing__assess-head">
                <span className="landing__assess-icon">{a.icon}</span>
                <div>
                  <span className="landing__assess-tag" style={{ color: a.tagColor, background: a.tagColor + "18" }}>
                    {a.tag}
                  </span>
                  <h3 className="landing__assess-title">{a.title}</h3>
                  <p className="landing__assess-subtitle" style={{ color: a.tagColor }}>{a.subtitle}</p>
                </div>
              </div>
              <p className="landing__assess-desc">{a.desc}</p>
              <ul className="landing__assess-bullets">
                {a.bullets.map(b => (
                  <li key={b}>
                    <span className="landing__bullet-dot" style={{ background: a.tagColor }} />
                    {b}
                  </li>
                ))}
              </ul>
              <button
                className="btn btn--lg"
                style={{ background: a.tagColor, color:"#fff", width:"100%", marginTop:"auto" }}
                onClick={() => goTo(a.action)}
              >
                {a.label} →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* DSM-5 domain preview */}
      <section className="landing__domains container container--wide animate-in">
        <h2 className="landing__section-title">What the full assessment covers</h2>
        <div className="landing__domain-grid">
          {DOMAINS.map(d => (
            <div className="landing__domain-item" key={d.label}>
              <span className="landing__domain-icon">{d.icon}</span>
              <div>
                <div className="landing__domain-label">{d.label}</div>
                <div className="landing__domain-meta">{d.basis}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="landing__disclaimer container animate-in">
        <div className="landing__disclaimer-inner">
          <span className="landing__disclaimer-icon">⚕️</span>
          <p>
            <strong>Medical disclaimer:</strong> This tool is for informational and research purposes
            only. Results are not a clinical diagnosis. Please consult a qualified healthcare
            professional for a formal evaluation.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer__main">
          <div className="container container--wide footer__cols">
            <div className="footer__col">
              <h4 className="footer__col-heading">Assessments</h4>
              <ul className="footer__links">
                <li><button onClick={() => goTo("questionnaire")}>AQ-10 Preliminary Screen</button></li>
                <li><button onClick={() => goTo("clinical")}>Full Clinical Assessment</button></li>
                <li><button onClick={() => goTo("voice")}>Voice Prosody Analysis</button></li>
              </ul>
            </div>
            <div className="footer__col">
              <h4 className="footer__col-heading">SpectrumSense</h4>
              <ul className="footer__links">
                <li><button onClick={() => goTo("about")}>About Us</button></li>
                <li><button onClick={() => goTo("contact")}>Contact Us</button></li>
                <li><button onClick={() => goTo("login")}>Login / Sign Up</button></li>
              </ul>
            </div>
            <div className="footer__col">
              <h4 className="footer__col-heading">Resources</h4>
              <ul className="footer__links">
                <li><a href="https://www.autism.org.uk" target="_blank" rel="noopener noreferrer">Autism Resources</a></li>
                <li><a href="https://www.cdc.gov/autism" target="_blank" rel="noopener noreferrer">CDC Autism Info</a></li>
                <li><a href="https://www.nice.org.uk/guidance/cg142" target="_blank" rel="noopener noreferrer">AQ-10 Instrument (NICE)</a></li>
              </ul>
            </div>
            <div className="footer__col">
              <h4 className="footer__col-heading">Built with</h4>
              <ul className="footer__links footer__links--plain">
                <li>React · Node.js · Express</li>
                <li>DSM-5 aligned scoring</li>
                <li>Wav2Vec2 voice analysis</li>
                <li>AQ-10 (Baron-Cohen et al.)</li>
                <li>Hackathon project 2025</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer__utility">
          <div className="container container--wide footer__utility-inner">
            <div className="footer__region">🌐 Global · English</div>
            <div className="footer__utility-links">
              <button onClick={() => goTo("about")}>About Us</button>
              <button onClick={() => goTo("contact")}>Contact Us</button>
              <button onClick={() => goTo("login")}>Login</button>
            </div>
            <div className="footer__social">
              <a className="footer__social-btn" href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="footer__copyright">
          <div className="container container--wide footer__copyright-inner">
            <p>© 2025 SpectrumSense · Hackathon project · For research and awareness only</p>
            <div className="footer__legal-links">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Use</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}