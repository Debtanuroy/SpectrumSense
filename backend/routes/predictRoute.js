const express = require("express");
const router  = express.Router();

const {
  getQuestions,
  submitQuestionnaire,
} = require("../controllers/predictController");

const {
  getClinicalQuestions,
  submitClinicalAssessment,
} = require("../controllers/clinicalController");

// ── Flow 1: AQ-10 Preliminary Screen ───────────────────────────────────────
router.get ("/questionnaire/questions", getQuestions);
router.post("/questionnaire/submit",    submitQuestionnaire);

// ── Flow 2: DSM-5 Clinical Assessment ──────────────────────────────────────
router.get ("/clinical/questions",      getClinicalQuestions);
router.post("/clinical/submit",         submitClinicalAssessment);

module.exports = router;