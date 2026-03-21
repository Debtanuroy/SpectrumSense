const express    = require("express");
const router     = express.Router();
const http       = require("http");

const {
  getQuestions,
  submitQuestionnaire,
} = require("../controllers/predictController");

const {
  getClinicalQuestions,
  submitClinicalAssessment,
} = require("../controllers/clinicalController");

// ── Flow 1: AQ-10 ──────────────────────────────────────────────────────────
router.get ("/questionnaire/questions", getQuestions);
router.post("/questionnaire/submit",    submitQuestionnaire);

// ── Flow 2: DSM-5 Clinical ─────────────────────────────────────────────────
router.get ("/clinical/questions",      getClinicalQuestions);
router.post("/clinical/submit",         submitClinicalAssessment);

// ── Flow 3: Voice — proxy to Python Flask on :5003 ─────────────────────────
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 50 * 1024 * 1024 },
});

// Health check — pings Flask directly
router.get("/voice/health", (req, res) => {
  const req5003 = http.request(
    { hostname:"127.0.0.1", port:5003, path:"/voice/health", method:"GET" },
    (r) => {
      let body = "";
      r.on("data", c => body += c);
      r.on("end",  ()  => {
        try { res.json({ voice_service:"ok", ...JSON.parse(body) }); }
        catch { res.json({ voice_service:"ok" }); }
      });
    }
  );
  req5003.on("error", () =>
    res.json({ voice_service:"offline", message:"Voice API not running on port 5003" })
  );
  req5003.end();
});

// Analyze — forward uploaded file to Flask
router.post("/voice/analyze", upload.single("audio"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error:"No audio file. Send as multipart field 'audio'." });
  }

  // Build boundary manually — avoids form-data dependency
  const boundary = "----FormBoundary" + Math.random().toString(36).slice(2);
  const CRLF     = "\r\n";

  const head = Buffer.from(
    "--" + boundary + CRLF +
    `Content-Disposition: form-data; name="audio"; filename="${req.file.originalname}"` + CRLF +
    `Content-Type: ${req.file.mimetype || "audio/wav"}` + CRLF + CRLF
  );
  const tail  = Buffer.from(CRLF + "--" + boundary + "--" + CRLF);
  const body  = Buffer.concat([head, req.file.buffer, tail]);

  const options = {
    hostname: "127.0.0.1",
    port:     5003,
    path:     "/voice/analyze",
    method:   "POST",
    headers:  {
      "Content-Type":   `multipart/form-data; boundary=${boundary}`,
      "Content-Length": body.length,
    },
  };

  const proxy = http.request(options, (flaskRes) => {
    let data = "";
    flaskRes.on("data", chunk => data += chunk);
    flaskRes.on("end",  ()    => {
      try { res.status(flaskRes.statusCode).json(JSON.parse(data)); }
      catch { res.status(500).json({ error:"Invalid response from voice service", raw: data }); }
    });
  });

  proxy.on("error", (err) => {
    console.error("[voice proxy] Error:", err.message);
    res.status(503).json({
      error:   "Voice analysis service is not running.",
      fix:     "Run: cd voice_module && python api.py",
    });
  });

  proxy.write(body);
  proxy.end();
});

module.exports = router;