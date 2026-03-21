const express   = require("express");
const cors      = require("cors");
const helmet    = require("helmet");
const rateLimit = require("express-rate-limit");

const predictRoute = require("./routes/predictRoute");

const app = express();

// ─── Security ────────────────────────────────────────────────────────────────
app.use(helmet());

const limiter = rateLimit({
  windowMs:       15 * 60 * 1000,   // 15 minutes
  max:            100,
  standardHeaders: true,
  legacyHeaders:  false,
  message:        { error: "Too many requests, please try again later." },
});
app.use(limiter);

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "10kb" }));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api", predictRoute);

app.get("/", (req, res) => {
  res.json({
    status:  "ok",
    message: "Autism Detection API Running",
    version: "1.0.0",
    endpoints: {
      predict:            "POST /api/predict",
      getQuestions:       "GET  /api/questionnaire/questions",
      submitQuestionnaire:"POST /api/questionnaire/submit",
    },
  });
});

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
