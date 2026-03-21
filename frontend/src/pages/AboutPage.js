import React from "react";
import Navbar from "../components/Navbar";
import "./AboutPage.css";

const TEAM = [
  { name: "Team Member 1", role: "ML Engineer", emoji: "🧠", bio: "Designed and trained the Random Forest model, handled data preprocessing and SMOTE balancing." },
  { name: "Team Member 2", role: "Backend Developer", emoji: "⚙️", bio: "Built the Node.js/Express API, Python bridge, and security middleware." },
  { name: "Team Member 3", role: "Frontend Developer", emoji: "🎨", bio: "Designed and built the React interface, questionnaire flow, and results visualisation." },
  { name: "Team Member 4", role: "Research & Data", emoji: "📊", bio: "Sourced and validated the dataset, researched AQ-10 clinical criteria and scoring." },
];

const MILESTONES = [
  { icon: "📂", title: "Dataset sourced", desc: "UCI ML Repository — 704 adult records by Fadi Fayez Thabtah." },
  { icon: "🧹", title: "Data cleaned", desc: "Handled missing values, age typos, and encoded 8 categorical features." },
  { icon: "⚖️", title: "Class balancing", desc: "Applied SMOTE to address the 515 NO vs 189 YES imbalance." },
  { icon: "🌲", title: "Model trained", desc: "Random Forest with ~98% accuracy. Scaler saved to prevent data leakage." },
  { icon: "🔌", title: "API built", desc: "Express server with rate limiting, helmet security, and Python bridge." },
  { icon: "🖥️", title: "UI built", desc: "React frontend with AQ-10 questionnaire and ML prediction flows." },
];

export default function AboutPage({ goTo }) {
  return (
    <div className="about">
      <Navbar currentPage="about" goTo={goTo} />

      {/* Hero */}
      <section className="about__hero container animate-in">
        <div className="about__hero-eyebrow">Our story</div>
        <h1 className="about__hero-title">
          Built to make autism<br />
          <em>screening accessible.</em>
        </h1>
        <p className="about__hero-sub">
          SpectrumSense is a hackathon project combining clinical screening
          tools with machine learning to help individuals understand autism
          spectrum traits — clearly, responsibly, and for free.
        </p>
      </section>

      {/* Mission cards */}
      <section className="about__mission container container--wide">
        <div className="about__mission-grid">
          <div className="about__mission-card card animate-in animate-in--delay-1">
            <div className="about__mission-icon">🎯</div>
            <h3>Our mission</h3>
            <p className="text-secondary mt-8">
              To reduce the barrier to early autism awareness by providing a
              free, science-backed screening tool that explains results in plain
              language.
            </p>
          </div>
          <div className="about__mission-card card animate-in animate-in--delay-2">
            <div className="about__mission-icon">🔬</div>
            <h3>Our approach</h3>
            <p className="text-secondary mt-8">
              We use the validated AQ-10 questionnaire alongside a Random
              Forest model trained on 704 real-world records, balanced with
              SMOTE to prevent bias.
            </p>
          </div>
          <div className="about__mission-card card animate-in animate-in--delay-3">
            <div className="about__mission-icon">🔒</div>
            <h3>Privacy first</h3>
            <p className="text-secondary mt-8">
              All processing happens locally. No responses are stored, logged,
              or transmitted beyond your browser session.
            </p>
          </div>
        </div>
      </section>

      {/* How we built it */}
      <section className="about__timeline container container--narrow">
        <h2 className="about__section-title animate-in">How we built it</h2>
        <div className="about__milestones">
          {MILESTONES.map((m, i) => (
            <div
              className={`about__milestone animate-in animate-in--delay-${Math.min(i + 1, 4)}`}
              key={m.title}
            >
              <div className="about__milestone-icon">{m.icon}</div>
              <div className="about__milestone-line" />
              <div className="about__milestone-content">
                <h4>{m.title}</h4>
                <p className="text-secondary">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="about__team container container--wide">
        <h2 className="about__section-title animate-in">The team</h2>
        <p className="text-secondary animate-in" style={{ marginBottom: 32 }}>
          A small team of students who built this in 48 hours.
        </p>
        <div className="about__team-grid">
          {TEAM.map((m, i) => (
            <div
              className={`about__team-card card animate-in animate-in--delay-${Math.min(i + 1, 4)}`}
              key={m.name}
            >
              <div className="about__team-avatar">{m.emoji}</div>
              <h3 className="about__team-name">{m.name}</h3>
              <span className="badge badge--info about__team-role">{m.role}</span>
              <p className="text-secondary mt-12" style={{ fontSize: "0.875rem" }}>{m.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="container animate-in" style={{ paddingBottom: 64 }}>
        <div className="about__disclaimer">
          <span style={{ fontSize: "1.2rem" }}>⚕️</span>
          <p>
            <strong>Medical disclaimer:</strong> SpectrumSense is not a clinical
            diagnostic tool. Results are informational only. Please consult a
            qualified healthcare professional for a formal autism evaluation.
          </p>
        </div>
      </section>
    </div>
  );
}
