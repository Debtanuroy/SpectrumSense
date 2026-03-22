import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import "./VoicePage.css";

const API = "http://localhost:5000/api";

export default function VoicePage({ goTo, onResult }) {
  const [file, setFile]                   = useState(null);
  const [dragging, setDragging]           = useState(false);
  const [analyzing, setAnalyzing]         = useState(false);
  const [error, setError]                 = useState(null);
  const [serviceStatus, setServiceStatus] = useState("checking");
  const inputRef = useRef();

  useEffect(() => {
    fetch(API + "/voice/health")
      .then(function(res) { return res.json(); })
      .then(function(data) {
        setServiceStatus(data.voice_service === "ok" ? "online" : "offline");
      })
      .catch(function() {
        setServiceStatus("offline");
      });
  }, []);

  const handleFile = function(f) {
    if (!f) return;
    if (!f.name.match(/\.(wav|mp3|m4a|ogg|flac)$/i)) {
      setError("Unsupported format. Please upload a WAV, MP3, M4A, OGG or FLAC file.");
      return;
    }
    setFile(f);
    setError(null);
  };

  const handleDrop = function(e) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = function() {
    if (!file) return;
    setAnalyzing(true);
    setError(null);

    var formData = new FormData();
    formData.append("audio", file);

    fetch(API + "/voice/analyze", { method: "POST", body: formData })
      .then(function(res) { return res.json().then(function(data) { return { ok: res.ok, data: data }; }); })
      .then(function(result) {
        if (!result.ok) throw new Error(result.data.error || "Analysis failed");
        onResult(result.data);
      })
      .catch(function(e) {
        setError(e.message);
        setAnalyzing(false);
      });
  };

  var statusText = "Checking voice service...";
  if (serviceStatus === "online")  statusText = "Voice analysis service running";
  if (serviceStatus === "offline") statusText = "Voice service offline — run: cd voice_module && python api.py";

  return (
    <div className="vpage">
      <Navbar currentPage="voice" goTo={goTo} />

      <div className="container container--narrow vpage__body">

        <div className="vpage__header animate-in">
          <div className="vpage__eyebrow">Voice Prosody Analysis</div>
          <h1 className="vpage__title">Speech pattern<br /><em>analysis</em></h1>
          <p className="vpage__sub">
            Upload a recording of natural speech (30 to 120 seconds).
            The system analyses pitch variation, pause patterns, speech rate
            and energy — all clinically associated with autism spectrum speech profiles.
          </p>
        </div>

        <div className={"vpage__status animate-in animate-in--delay-1 " + serviceStatus}>
          <span className="vpage__status-dot" />
          {statusText}
        </div>

        <div
          className={"vpage__dropzone animate-in animate-in--delay-2" + (dragging ? " dragging" : "") + (file ? " has-file" : "")}
          onDragOver={function(e) { e.preventDefault(); setDragging(true); }}
          onDragLeave={function() { setDragging(false); }}
          onDrop={handleDrop}
          onClick={function() { if (!file && inputRef.current) inputRef.current.click(); }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".wav,.mp3,.m4a,.ogg,.flac"
            style={{ display: "none" }}
            onChange={function(e) { if (e.target.files[0]) handleFile(e.target.files[0]); }}
          />
          {file ? (
            <div className="vpage__file-preview">
              <div className="vpage__file-icon">🎵</div>
              <div className="vpage__file-info">
                <div className="vpage__file-name">{file.name}</div>
                <div className="vpage__file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
              </div>
              <button className="vpage__file-remove" onClick={function(e) { e.stopPropagation(); setFile(null); }}>✕</button>
            </div>
          ) : (
            <div className="vpage__dropzone-empty">
              <div className="vpage__dropzone-icon">🎤</div>
              <p className="vpage__dropzone-title">Drop audio file here</p>
              <p className="vpage__dropzone-sub">or click to browse</p>
              <p className="vpage__dropzone-formats">WAV · MP3 · M4A · OGG · FLAC</p>
            </div>
          )}
        </div>

        <div className="vpage__markers card animate-in animate-in--delay-3">
          <div className="card__body">
            <h3>What gets analysed</h3>
            <div className="vpage__marker-grid mt-16">
              {[
                { icon:"🎵", label:"Pitch variability", desc:"Higher atypical variability = ASD marker. Calibrated from real audio data. Ma et al. 2024 (SMD=0.57).", weight:"35%" },
                { icon:"⚡", label:"Energy variation",  desc:"Lower energy variation = flat affect = ASD marker. Bone et al. 2014.", weight:"35%" },
                { icon:"🏃", label:"Speech rate",       desc:"Slower speech = more ASD-indicative. ASD ~2.7 vs non-ASD ~4.8 (ZCR proxy). Patel et al. 2020.", weight:"25%" },
                { icon:"⏸️", label:"Pause patterns",   desc:"Pause frequency per minute. Reliable only on recordings over 45 seconds. Ma et al. 2024 (SMD=0.07).", weight:"5%" },
              ].map(function(m) {
                return (
                  <div className="vpage__marker" key={m.label}>
                    <span className="vpage__marker-icon">{m.icon}</span>
                    <div>
                      <div className="vpage__marker-label">
                        {m.label}
                        <span className="vpage__marker-weight">{m.weight}</span>
                      </div>
                      <div className="vpage__marker-desc">{m.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="vpage__tips card animate-in animate-in--delay-4">
          <div className="card__body">
            <h3>Recording guidelines</h3>
            <ul className="vpage__tips-list mt-12">
              <li>📏 <strong>Duration:</strong> 30–120 seconds of natural speech</li>
              <li>🔇 <strong>Background:</strong> Quiet environment, minimal noise</li>
              <li>🗣️ <strong>Content:</strong> Conversational speech, not reading aloud</li>
              <li>🎙️ <strong>Format:</strong> WAV at 16kHz mono gives best results</li>
            </ul>
          </div>
        </div>

        {error && (
          <div className="vpage__error animate-in">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        <div className="vpage__actions animate-in animate-in--delay-4">
          <button
            className="btn btn--primary btn--lg"
            onClick={handleAnalyze}
            disabled={!file || analyzing || serviceStatus === "offline"}
            style={{ flex: 1 }}
          >
            {analyzing ? "Analysing speech patterns…" : "Analyse speech →"}
          </button>
          <button className="btn btn--ghost" onClick={function() { goTo("landing"); }}>
            Cancel
          </button>
        </div>

        {analyzing && (
          <p className="text-muted animate-in" style={{ fontSize:"0.85rem", textAlign:"center" }}>
            First run loads the Wav2Vec2 model. This may take 1–2 minutes.
          </p>
        )}

      </div>
    </div>
  );
}