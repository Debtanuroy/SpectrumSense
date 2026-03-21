import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "./LoginPage.css";

export default function LoginPage({ goTo }) {
  const [tab, setTab]         = useState("login"); // "login" | "signup"
  const [form, setForm]       = useState({ name:"", email:"", password:"", confirm:"" });
  const [submitted, setSubmitted] = useState(false);
  const [showPass, setShowPass]   = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder — wire up to your auth backend here
    setSubmitted(true);
  };

  const isLoginValid  = form.email && form.password;
  const isSignupValid = form.name && form.email && form.password && form.confirm && form.password === form.confirm;

  return (
    <div className="login">
      <Navbar currentPage="login" goTo={goTo} />

      <div className="login__wrap">
        {/* Left panel */}
        <div className="login__panel login__panel--left">
          <div className="login__panel-content">
            <div className="login__panel-logo">
              <span className="navbar__brand-dot" style={{ width:10, height:10 }} />
              SpectrumSense
            </div>
            <h2 className="login__panel-headline">
              Track your<br /><em>screening journey.</em>
            </h2>
            <p className="login__panel-sub">
              Create an account to save your assessment history, revisit past
              results, and monitor changes over time.
            </p>
            <div className="login__panel-bullets">
              {["Save questionnaire results","Compare over time","Export your report","Access from any device"].map((b) => (
                <div className="login__bullet" key={b}>
                  <span className="login__bullet-dot" />
                  {b}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="login__panel login__panel--right">
          <div className="login__form-wrap animate-in">

            {submitted ? (
              <div className="login__success">
                <div className="login__success-icon">🎉</div>
                <h2>{tab === "login" ? "Welcome back!" : "Account created!"}</h2>
                <p className="text-secondary mt-8">
                  {tab === "login"
                    ? "You've signed in successfully."
                    : "Your account is ready. You can now sign in."}
                </p>
                <button className="btn btn--primary btn--lg mt-24" onClick={() => goTo("landing")}>
                  Go to home →
                </button>
                {tab === "signup" && (
                  <button className="btn btn--ghost mt-12" onClick={() => { setSubmitted(false); setTab("login"); }}>
                    Sign in instead
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Tabs */}
                <div className="login__tabs">
                  <button
                    className={`login__tab ${tab === "login" ? "active" : ""}`}
                    onClick={() => { setTab("login"); setForm({ name:"", email:"", password:"", confirm:"" }); }}
                  >
                    Sign in
                  </button>
                  <button
                    className={`login__tab ${tab === "signup" ? "active" : ""}`}
                    onClick={() => { setTab("signup"); setForm({ name:"", email:"", password:"", confirm:"" }); }}
                  >
                    Create account
                  </button>
                </div>

                <div className="login__form">
                  {tab === "signup" && (
                    <div className="form-group">
                      <label className="form-label">Full name</label>
                      <input
                        className="form-input"
                        type="text"
                        placeholder="Jane Smith"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                      />
                    </div>
                  )}

                  <div className="form-group mt-16">
                    <label className="form-label">Email address</label>
                    <input
                      className="form-input"
                      type="email"
                      placeholder="jane@example.com"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                    />
                  </div>

                  <div className="form-group mt-16">
                    <div className="login__label-row">
                      <label className="form-label">Password</label>
                      {tab === "login" && (
                        <button className="login__forgot">Forgot password?</button>
                      )}
                    </div>
                    <div className="login__password-wrap">
                      <input
                        className="form-input"
                        type={showPass ? "text" : "password"}
                        placeholder="••••••••"
                        value={form.password}
                        onChange={(e) => set("password", e.target.value)}
                        style={{ paddingRight: 44 }}
                      />
                      <button
                        className="login__pass-toggle"
                        onClick={() => setShowPass((s) => !s)}
                        tabIndex={-1}
                      >
                        {showPass ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>

                  {tab === "signup" && (
                    <div className="form-group mt-16">
                      <label className="form-label">Confirm password</label>
                      <input
                        className="form-input"
                        type="password"
                        placeholder="••••••••"
                        value={form.confirm}
                        onChange={(e) => set("confirm", e.target.value)}
                      />
                      {form.confirm && form.password !== form.confirm && (
                        <p className="text-danger mt-4" style={{ fontSize:"0.8rem" }}>
                          Passwords don't match
                        </p>
                      )}
                    </div>
                  )}

                  <button
                    className="btn btn--primary btn--lg mt-24"
                    onClick={handleSubmit}
                    disabled={tab === "login" ? !isLoginValid : !isSignupValid}
                    style={{ width: "100%" }}
                  >
                    {tab === "login" ? "Sign in →" : "Create account →"}
                  </button>

                  <p className="login__switch mt-20">
                    {tab === "login" ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => setTab(tab === "login" ? "signup" : "login")}>
                      {tab === "login" ? "Create one" : "Sign in"}
                    </button>
                  </p>

                  <div className="login__divider">
                    <span>or continue without account</span>
                  </div>

                  <div className="login__guest-btns">
                    <button className="btn btn--ghost" style={{ flex:1 }} onClick={() => goTo("questionnaire")}>
                      📋 Take questionnaire
                    </button>
                    <button className="btn btn--ghost" style={{ flex:1 }} onClick={() => goTo("ml")}>
                      🧠 ML prediction
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
