import React, { useState, useEffect } from "react";
import "./QuestionnairePage.css";

const API = "http://localhost:5000/api";

const RESPONSE_OPTIONS = [
  { value: "definitely_agree",    label: "Definitely Agree"    },
  { value: "slightly_agree",      label: "Slightly Agree"      },
  { value: "slightly_disagree",   label: "Slightly Disagree"   },
  { value: "definitely_disagree", label: "Definitely Disagree" },
];

export default function QuestionnairePage({ goTo, onResult }) {
  const [questions, setQuestions]   = useState([]);
  const [answers, setAnswers]       = useState({});
  const [current, setCurrent]       = useState(0);
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState(null);
  const [direction, setDirection]   = useState("forward");

  useEffect(() => {
    fetch(`${API}/questionnaire/questions`)
      .then((r) => r.json())
      .then((d) => { setQuestions(d.questions); setLoading(false); })
      .catch(() => { setError("Could not load questions. Is the server running?"); setLoading(false); });
  }, []);

  const handleAnswer = (value) => {
    const q = questions[current];
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
    if (current < questions.length - 1) {
      setDirection("forward");
      setTimeout(() => setCurrent((c) => c + 1), 120);
    }
  };

  const goBack = () => {
    if (current > 0) {
      setDirection("back");
      setCurrent((c) => c - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    const payload = questions.map((q) => ({
      questionId: q.id,
      response: answers[q.id],
    }));
    try {
      const res = await fetch(`${API}/questionnaire/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      onResult(data.result);
    } catch (e) {
      setError(e.message);
      setSubmitting(false);
    }
  };

  const totalAnswered = Object.keys(answers).length;
  const allAnswered   = questions.length > 0 && totalAnswered === questions.length;
  const progress      = questions.length ? (totalAnswered / questions.length) * 100 : 0;

  if (loading) return (
    <div className="qpage">
      <nav className="navbar">
        <div className="navbar__brand"><span className="navbar__brand-dot" />SpectrumSense</div>
        <button className="navbar__back" onClick={() => goTo("landing")}>← Back</button>
      </nav>
      <div className="qpage__loading">
        <div className="qpage__spinner" />
        <p className="text-secondary mt-16">Loading questions…</p>
      </div>
    </div>
  );

  if (error && questions.length === 0) return (
    <div className="qpage">
      <nav className="navbar">
        <div className="navbar__brand"><span className="navbar__brand-dot" />SpectrumSense</div>
        <button className="navbar__back" onClick={() => goTo("landing")}>← Back</button>
      </nav>
      <div className="qpage__loading">
        <p className="text-danger">{error}</p>
        <button className="btn btn--ghost mt-16" onClick={() => goTo("landing")}>Go back</button>
      </div>
    </div>
  );

  const q = questions[current];
  const isReview = current === questions.length; // review screen

  return (
    <div className="qpage">
      <nav className="navbar">
        <div className="navbar__brand"><span className="navbar__brand-dot" />SpectrumSense</div>
        <button className="navbar__back" onClick={() => goTo("landing")}>← Back</button>
      </nav>

      {/* Progress header */}
      <div className="qpage__progress-bar-wrap">
        <div className="progress-bar" style={{ borderRadius: 0 }}>
          <div className="progress-bar__fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="container container--narrow qpage__body">

        {/* Step counter */}
        {!isReview && (
          <div className="qpage__counter animate-in">
            <span className="qpage__counter-current">{current + 1}</span>
            <span className="text-muted"> / {questions.length}</span>
            <span className="qpage__counter-label">{q?.categoryLabel}</span>
          </div>
        )}

        {/* Question card */}
        {!isReview && q && (
          <div className={`qpage__question-card animate-in ${direction === "back" ? "animate-in--from-left" : ""}`} key={q.id}>
            <p className="qpage__question-text">{q.text}</p>

            <div className="qpage__options">
              {RESPONSE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={`qpage__option ${answers[q.id] === opt.value ? "qpage__option--selected" : ""}`}
                  onClick={() => handleAnswer(opt.value)}
                >
                  <span className="qpage__option-radio" />
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="qpage__nav">
              {current > 0 && (
                <button className="btn btn--ghost btn--sm" onClick={goBack}>← Previous</button>
              )}
              {answers[q.id] && current < questions.length - 1 && (
                <button
                  className="btn btn--outline btn--sm"
                  style={{ marginLeft: "auto" }}
                  onClick={() => { setDirection("forward"); setCurrent((c) => c + 1); }}
                >
                  Next →
                </button>
              )}
              {answers[q.id] && current === questions.length - 1 && (
                <button
                  className="btn btn--primary btn--sm"
                  style={{ marginLeft: "auto" }}
                  onClick={() => setCurrent(questions.length)}
                >
                  Review answers →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Review screen */}
        {isReview && (
          <div className="qpage__review animate-in">
            <h2>Review your answers</h2>
            <p className="text-secondary mt-8">Check your responses before submitting.</p>

            <div className="qpage__review-list mt-24">
              {questions.map((qr, i) => (
                <div className="qpage__review-item" key={qr.id}>
                  <div className="qpage__review-num">{i + 1}</div>
                  <div className="qpage__review-content">
                    <p className="qpage__review-q">{qr.text}</p>
                    <div className="qpage__review-answer">
                      {RESPONSE_OPTIONS.find((o) => o.value === answers[qr.id])?.label || (
                        <span className="text-danger">Not answered</span>
                      )}
                    </div>
                  </div>
                  <button
                    className="qpage__review-edit"
                    onClick={() => { setDirection("back"); setCurrent(i); }}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>

            {error && <p className="text-danger mt-16">{error}</p>}

            <div className="qpage__review-actions mt-32">
              <button className="btn btn--ghost" onClick={() => setCurrent(questions.length - 1)}>
                ← Back
              </button>
              <button
                className="btn btn--primary btn--lg"
                onClick={handleSubmit}
                disabled={!allAnswered || submitting}
              >
                {submitting ? "Analysing…" : "Submit & get results →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
