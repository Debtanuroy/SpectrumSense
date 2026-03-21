import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "./ClinicalPage.css";

const API = "http://localhost:5000/api";

const LIKERT_LABELS = {
  1: { label:"Never",     desc:"Not at all like me",    color:"#0d9660" },
  2: { label:"Rarely",    desc:"Slightly like me",      color:"#4a9e6b" },
  3: { label:"Sometimes", desc:"Moderately like me",    color:"#c47c0a" },
  4: { label:"Often",     desc:"Mostly like me",        color:"#d65f1a" },
  5: { label:"Always",    desc:"Very strongly like me", color:"#d63b3b" },
};

const DOMAIN_ORDER = [
  "social_communication","restricted_repetitive","sensory_processing",
  "executive_function","emotional_regulation","developmental",
];

export default function ClinicalPage({ goTo, onResult }) {
  const [data, setData]           = useState(null);
  const [answers, setAnswers]     = useState({});
  const [multiAnswers, setMultiAnswers] = useState({});
  const [activeBlock, setActiveBlock]  = useState(0);
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState(null);

  useEffect(() => {
    fetch(`${API}/clinical/questions`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => { setError("Could not load questions. Is the server running?"); setLoading(false); });
  }, []);

  const setAnswer = (qId, val) => setAnswers(p => ({ ...p, [qId]: val }));

  const toggleMulti = (qId, opt) => {
    setMultiAnswers(p => {
      const cur = p[qId] || [];
      const next = cur.includes(opt) ? cur.filter(x => x !== opt) : [...cur, opt];
      return { ...p, [qId]: next };
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true); setError(null);
    const payload = [];
    if (!data) return;
    for (const q of data.questions) {
      if (q.type === "multiselect") {
        const vals = multiAnswers[q.id] || [];
        if (vals.length > 0) payload.push({ questionId: q.id, value: vals.join(", ") });
      } else if (answers[q.id] !== undefined) {
        payload.push({ questionId: q.id, value: answers[q.id] });
      }
    }
    try {
      const res = await fetch(`${API}/clinical/submit`, {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ answers: payload }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Submission failed");
      onResult(d.result);
    } catch(e) {
      setError(e.message);
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="clinical">
      <Navbar currentPage="clinical" goTo={goTo} />
      <div className="clinical__loading"><div className="qpage__spinner"/><p className="text-secondary mt-16">Loading assessment…</p></div>
    </div>
  );

  if (error && !data) return (
    <div className="clinical">
      <Navbar currentPage="clinical" goTo={goTo} />
      <div className="clinical__loading"><p className="text-danger">{error}</p><button className="btn btn--ghost mt-16" onClick={() => goTo("landing")}>Go back</button></div>
    </div>
  );

  const questions   = data?.questions || [];
  const domainKeys  = DOMAIN_ORDER;
  const blocks      = domainKeys.map(dk => ({
    key: dk,
    meta: data?.domains?.[dk],
    questions: questions.filter(q => q.domain === dk),
  }));

  const currentBlock = blocks[activeBlock];
  const isLastBlock  = activeBlock === blocks.length - 1;

  // Count answered scored questions in current block
  const scoredInBlock   = currentBlock.questions.filter(q => q.scored);
  const answeredInBlock = scoredInBlock.filter(q => answers[q.id] !== undefined).length;
  const blockComplete   = answeredInBlock === scoredInBlock.length;

  // Total progress
  const totalScored    = questions.filter(q => q.scored).length;
  const totalAnswered  = questions.filter(q => q.scored && answers[q.id] !== undefined).length;
  const progress       = Math.round((totalAnswered / totalScored) * 100);

  // All scored questions answered?
  const allAnswered = totalAnswered === totalScored;

  return (
    <div className="clinical">
      <Navbar currentPage="clinical" goTo={goTo} />

      {/* Sticky progress bar */}
      <div className="clinical__progress-wrap">
        <div className="clinical__progress-bar">
          <div className="clinical__progress-fill" style={{ width:`${progress}%` }}/>
        </div>
        <div className="clinical__progress-label">{totalAnswered} of {totalScored} questions answered</div>
      </div>

      <div className="clinical__layout container container--wide">

        {/* Left sidebar — domain nav */}
        <aside className="clinical__sidebar">
          <div className="clinical__sidebar-title">Assessment blocks</div>
          {blocks.map((b, i) => {
            const sq = b.questions.filter(q => q.scored);
            const aq = sq.filter(q => answers[q.id] !== undefined).length;
            const done = sq.length > 0 && aq === sq.length;
            return (
              <button
                key={b.key}
                className={`clinical__nav-item ${activeBlock === i ? "active" : ""} ${done ? "done" : ""}`}
                onClick={() => setActiveBlock(i)}
              >
                <span className="clinical__nav-icon">{b.meta?.icon}</span>
                <span className="clinical__nav-label">{b.meta?.label}</span>
                {done
                  ? <span className="clinical__nav-check">✓</span>
                  : sq.length > 0
                    ? <span className="clinical__nav-count">{aq}/{sq.length}</span>
                    : <span className="clinical__nav-tag">Info</span>
                }
              </button>
            );
          })}

          <div className="clinical__sidebar-submit">
            {error && <p className="text-danger mt-8" style={{fontSize:"0.8rem"}}>{error}</p>}
            <button
              className="btn btn--primary"
              style={{width:"100%"}}
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
            >
              {submitting ? "Analysing…" : allAnswered ? "Get results →" : `${totalScored - totalAnswered} left`}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="clinical__main">

          {/* Block header */}
          <div className="clinical__block-header animate-in">
            <div className="clinical__block-icon" style={{ background: currentBlock.meta?.color + "20", color: currentBlock.meta?.color }}>
              {currentBlock.meta?.icon}
            </div>
            <div>
              <div className="clinical__block-eyebrow">Block {activeBlock + 1} of {blocks.length}</div>
              <h2 className="clinical__block-title">{currentBlock.meta?.label}</h2>
              <p className="clinical__block-desc text-secondary">{currentBlock.meta?.description}</p>
              <div className="clinical__block-basis">{currentBlock.meta?.clinicalBasis}</div>
            </div>
          </div>

          {/* Questions */}
          <div className="clinical__questions">
            {currentBlock.questions.map((q, qi) => (
              <div className={`clinical__question animate-in animate-in--delay-${Math.min(qi+1,4)}`} key={q.id}>
                <div className="clinical__question-header">
                  <span className="clinical__question-num">Q{q.id}</span>
                  {!q.scored && <span className="badge badge--info">Informational</span>}
                </div>
                <p className="clinical__question-text">{q.text}</p>
                {q.probe && <p className="clinical__question-probe">{q.probe}</p>}

                {/* Scored: Likert 1–5 */}
                {q.scored && (
                  <div className="clinical__likert">
                    {[1,2,3,4,5].map(v => {
                      const lk = LIKERT_LABELS[v];
                      const sel = answers[q.id] === v;
                      return (
                        <button
                          key={v}
                          className={`clinical__likert-btn ${sel ? "selected" : ""}`}
                          style={sel ? { borderColor: lk.color, background: lk.color + "18", color: lk.color } : {}}
                          onClick={() => setAnswer(q.id, v)}
                        >
                          <span className="clinical__likert-num">{v}</span>
                          <span className="clinical__likert-label">{lk.label}</span>
                          <span className="clinical__likert-desc">{lk.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Developmental: select */}
                {!q.scored && q.type === "select" && (
                  <div className="clinical__dev-options">
                    {q.options.map(opt => (
                      <button
                        key={opt}
                        className={`clinical__dev-option ${answers[q.id] === opt ? "selected" : ""}`}
                        onClick={() => setAnswer(q.id, opt)}
                      >
                        {answers[q.id] === opt && <span className="clinical__dev-check">✓</span>}
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Developmental: multiselect */}
                {!q.scored && q.type === "multiselect" && (
                  <div className="clinical__dev-options">
                    {q.options.map(opt => {
                      const sel = (multiAnswers[q.id] || []).includes(opt);
                      return (
                        <button
                          key={opt}
                          className={`clinical__dev-option ${sel ? "selected" : ""}`}
                          onClick={() => toggleMulti(q.id, opt)}
                        >
                          {sel && <span className="clinical__dev-check">✓</span>}
                          {opt}
                        </button>
                      );
                    })}
                    <p className="text-muted" style={{fontSize:"0.78rem",marginTop:6}}>Select all that apply</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Block navigation */}
          <div className="clinical__block-nav">
            {activeBlock > 0 && (
              <button className="btn btn--ghost" onClick={() => setActiveBlock(a => a-1)}>← Previous block</button>
            )}
            {!isLastBlock && (
              <button
                className="btn btn--primary"
                style={{marginLeft:"auto"}}
                onClick={() => setActiveBlock(a => a+1)}
              >
                {blockComplete ? "Next block →" : `Next block (${scoredInBlock.length - answeredInBlock} unanswered)`}
              </button>
            )}
            {isLastBlock && (
              <button
                className="btn btn--primary btn--lg"
                style={{marginLeft:"auto"}}
                onClick={handleSubmit}
                disabled={!allAnswered || submitting}
              >
                {submitting ? "Analysing…" : "Submit & get results →"}
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}