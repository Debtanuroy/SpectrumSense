import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "./ContactPage.css";

const FAQS = [
  {
    q: "Is this tool a clinical diagnosis?",
    a: "No. SpectrumSense is a screening tool for informational purposes only. It cannot diagnose autism. Please consult a qualified healthcare professional for a formal evaluation.",
  },
  {
    q: "Is my data stored or shared?",
    a: "No. All processing happens locally on your device. Your responses are never stored, logged, or sent to any third party.",
  },
  {
    q: "What is the AQ-10?",
    a: "The AQ-10 (Autism-Spectrum Quotient, 10-item) is a validated screening instrument developed by Baron-Cohen et al. It is used as an initial screening tool by healthcare professionals in the UK (NICE guidelines).",
  },
  {
    q: "How accurate is the ML model?",
    a: "The model achieves ~98% accuracy on the UCI dataset test split. However, this reflects performance on a specific dataset of 704 adults — it is not a substitute for clinical assessment.",
  },
  {
    q: "Can children use this tool?",
    a: "The dataset this model was trained on contains only adult records (18+). Results for individuals under 18 would be unreliable. Use a professional paediatric assessment instead.",
  },
];

export default function ContactPage({ goTo }) {
  const [form, setForm]       = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, POST to a backend endpoint here
    setSubmitted(true);
  };

  return (
    <div className="contact">
      <Navbar currentPage="contact" goTo={goTo} />

      {/* Hero */}
      <section className="contact__hero container animate-in">
        <div className="contact__hero-eyebrow">Get in touch</div>
        <h1 className="contact__hero-title">
          We'd love to<br /><em>hear from you.</em>
        </h1>
        <p className="contact__hero-sub">
          Have a question about SpectrumSense, want to report an issue, or
          just want to say hello? Fill in the form below and we'll get back
          to you as soon as we can.
        </p>
      </section>

      <div className="container container--wide contact__layout">

        {/* Contact form */}
        <div className="contact__form-wrap animate-in animate-in--delay-1">
          {submitted ? (
            <div className="contact__success card">
              <div className="card__body contact__success-body">
                <div className="contact__success-icon">✅</div>
                <h2>Message sent!</h2>
                <p className="text-secondary mt-8">
                  Thanks for reaching out. We'll get back to you shortly.
                </p>
                <button
                  className="btn btn--outline mt-24"
                  onClick={() => { setSubmitted(false); setForm({ name:"", email:"", subject:"", message:"" }); }}
                >
                  Send another message
                </button>
              </div>
            </div>
          ) : (
            <div className="card card--elevated">
              <div className="card__body">
                <h2 className="contact__form-title">Send a message</h2>

                <div className="contact__form">
                  <div className="contact__form-row">
                    <div className="form-group">
                      <label className="form-label">Your name</label>
                      <input
                        className="form-input"
                        type="text"
                        placeholder="Jane Smith"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email address</label>
                      <input
                        className="form-input"
                        type="email"
                        placeholder="jane@example.com"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group mt-16">
                    <label className="form-label">Subject</label>
                    <select
                      className="form-select"
                      value={form.subject}
                      onChange={(e) => set("subject", e.target.value)}
                    >
                      <option value="">Select a subject…</option>
                      <option value="general">General enquiry</option>
                      <option value="feedback">Feedback / suggestion</option>
                      <option value="bug">Report a bug</option>
                      <option value="clinical">Clinical / research question</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group mt-16">
                    <label className="form-label">Message</label>
                    <textarea
                      className="form-input contact__textarea"
                      placeholder="Write your message here…"
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                      rows={5}
                    />
                  </div>

                  <button
                    className="btn btn--primary btn--lg mt-24"
                    onClick={handleSubmit}
                    disabled={!form.name || !form.email || !form.message}
                    style={{ width: "100%" }}
                  >
                    Send message →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Side info */}
        <div className="contact__side animate-in animate-in--delay-2">
          {/* Info cards */}
          <div className="contact__info-card card">
            <div className="card__body">
              <div className="contact__info-icon">📧</div>
              <h4>Email us</h4>
              <p className="text-secondary mt-4" style={{ fontSize:"0.875rem" }}>
                team@spectrumsense.dev
              </p>
            </div>
          </div>
          <div className="contact__info-card card">
            <div className="card__body">
              <div className="contact__info-icon">🐙</div>
              <h4>GitHub</h4>
              <p className="text-secondary mt-4" style={{ fontSize:"0.875rem" }}>
                github.com/spectrumsense
              </p>
            </div>
          </div>
          <div className="contact__info-card card">
            <div className="card__body">
              <div className="contact__info-icon">⏱️</div>
              <h4>Response time</h4>
              <p className="text-secondary mt-4" style={{ fontSize:"0.875rem" }}>
                We typically respond within 24–48 hours.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <section className="contact__faq container container--narrow animate-in animate-in--delay-3">
        <h2 className="contact__section-title">Frequently asked questions</h2>
        <div className="contact__faq-list">
          {FAQS.map((f, i) => (
            <div
              className={`contact__faq-item ${openFaq === i ? "open" : ""}`}
              key={i}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div className="contact__faq-question">
                <span>{f.q}</span>
                <span className="contact__faq-chevron">{openFaq === i ? "−" : "+"}</span>
              </div>
              {openFaq === i && (
                <div className="contact__faq-answer animate-in">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
