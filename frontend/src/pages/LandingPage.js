import React from "react";
import "./LandingPage.css";
import Navbar from "../components/Navbar";
 
const FEATURES = [
  {
    icon: "📋",
    title: "AQ-10 Questionnaire",
    desc: "Answer 10 clinically validated questions based on the Autism-Spectrum Quotient instrument.",
    action: "questionnaire",
    label: "Start questionnaire",
  },
  {
    icon: "🧠",
    title: "ML Model Prediction",
    desc: "Enter demographic and behavioural data for a machine-learning-based probability estimate.",
    action: "ml",
    label: "Enter data",
  },
];
 
const STATS = [
  { value: "AQ-10", label: "Validated instrument" },
  { value: "~98%", label: "Model accuracy" },
  { value: "10",   label: "Screening questions" },
  { value: "2",    label: "Assessment methods" },
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
            Autism screening assistant
          </div>
          <h1 className="landing__headline">
            Early screening,<br />
            <em>clearly explained.</em>
          </h1>
          <p className="landing__sub">
            SpectrumSense combines a validated questionnaire with a trained
            machine-learning model to provide structured autism spectrum
            screening for adults. All processing is local — no data is stored.
          </p>
          <div className="landing__hero-cta animate-in animate-in--delay-2">
            <button className="btn btn--primary btn--lg" onClick={() => goTo("questionnaire")}>
              Begin questionnaire
            </button>
            <button className="btn btn--ghost btn--lg" onClick={() => goTo("ml")}>
              ML prediction →
            </button>
          </div>
        </div>
        <div className="landing__hero-visual animate-in animate-in--delay-1">
          <div className="landing__pulse-ring" />
          <div className="landing__pulse-ring landing__pulse-ring--2" />
          <div className="landing__brain-icon">🧩</div>
        </div>
      </section>
 
      {/* Stats bar */}
      <section className="landing__stats animate-in animate-in--delay-2">
        <div className="container container--wide landing__stats-inner">
          {STATS.map((s) => (
            <div className="landing__stat" key={s.label}>
              <span className="landing__stat-value">{s.value}</span>
              <span className="landing__stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>
 
      {/* Feature cards */}
      <section className="landing__features container container--wide">
        <h2 className="landing__section-title animate-in">Choose your assessment method</h2>
        <div className="landing__cards">
          {FEATURES.map((f, i) => (
            <div
              className={`landing__feature-card animate-in animate-in--delay-${i + 1}`}
              key={f.action}
              onClick={() => goTo(f.action)}
            >
              <div className="landing__feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p className="text-secondary mt-8">{f.desc}</p>
              <div className="landing__feature-footer">
                <span className="text-accent">{f.label} →</span>
              </div>
            </div>
          ))}
        </div>
      </section>
 
      {/* Disclaimer */}
      <section className="landing__disclaimer container animate-in animate-in--delay-4">
        <div className="landing__disclaimer-inner">
          <span className="landing__disclaimer-icon">⚕️</span>
          <p>
            <strong>Medical disclaimer:</strong> This tool is for informational and
            research purposes only. Results are not a clinical diagnosis. Please
            consult a qualified healthcare professional for a formal evaluation.
          </p>
        </div>
      </section>
 
      {/* ── Footer ── */}
      <footer className="footer">
 
        {/* Main link columns */}
        <div className="footer__main">
          <div className="container container--wide footer__cols">
 
            <div className="footer__col">
              <h4 className="footer__col-heading">Assessments</h4>
              <ul className="footer__links">
                <li><button onClick={() => goTo("questionnaire")}>AQ-10 Questionnaire</button></li>
                <li><button onClick={() => goTo("ml")}>ML Model Prediction</button></li>
                <li><button onClick={() => goTo("results")}>View Results</button></li>
              </ul>
            </div>
 
            <div className="footer__col">
              <h4 className="footer__col-heading">About SpectrumSense</h4>
              <ul className="footer__links">
                <li><button onClick={() => goTo("about")}>About Us</button></li>
                <li><button onClick={() => goTo("contact")}>Contact Us</button></li>
                <li><button onClick={() => goTo("login")}>Login / Sign Up</button></li>
              </ul>
            </div>
 
            <div className="footer__col">
              <h4 className="footer__col-heading">News &amp; Info</h4>
              <ul className="footer__links">
                <li><a href="https://www.autism.org.uk" target="_blank" rel="noopener noreferrer">Autism Resources</a></li>
                <li><a href="https://www.cdc.gov/autism" target="_blank" rel="noopener noreferrer">CDC Autism Info</a></li>
                <li><a href="https://www.nice.org.uk/guidance/cg142" target="_blank" rel="noopener noreferrer">AQ-10 Instrument (NICE)</a></li>
                <li><a href="https://archive.ics.uci.edu" target="_blank" rel="noopener noreferrer">UCI ML Repository</a></li>
              </ul>
            </div>
 
            <div className="footer__col">
              <h4 className="footer__col-heading">Technical</h4>
              <ul className="footer__links footer__links--plain">
                <li>React · Node.js · Express</li>
                <li>Python · scikit-learn</li>
                <li>Random Forest + SMOTE</li>
                <li>704 adult records</li>
                <li>Dataset — Fadi Fayez Thabtah</li>
              </ul>
            </div>
 
          </div>
        </div>
 
        {/* Middle utility bar */}
        <div className="footer__utility">
          <div className="container container--wide footer__utility-inner">
            <div className="footer__region">🌐 Global · English</div>
            <div className="footer__utility-links">
              <button onClick={() => goTo("about")}>About Us</button>
              <button onClick={() => goTo("contact")}>Contact Us</button>
              <button onClick={() => goTo("login")}>Login</button>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
            <div className="footer__social">
              <a className="footer__social-btn" href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
              </a>
              <a className="footer__social-btn" href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a className="footer__social-btn" href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
        </div>
 
        {/* Copyright strip */}
        <div className="footer__copyright">
          <div className="container container--wide footer__copyright-inner">
            <p>© 2025 SpectrumSense · Hackathon project · For research and awareness only</p>
            <div className="footer__legal-links">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Use</a>
              <a href="#accessibility">Accessibility</a>
            </div>
          </div>
        </div>
 
      </footer>
    </div>
  );
}