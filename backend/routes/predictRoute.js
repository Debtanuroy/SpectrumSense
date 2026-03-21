const express = require("express");
const router  = express.Router();

const {
  predictAutism,
  getQuestions,
  submitQuestionnaire,
} = require("../controllers/predictController");

// ML model prediction
router.post("/predict", predictAutism);

// Questionnaire
router.get("/questionnaire/questions", getQuestions);
router.post("/questionnaire/submit",   submitQuestionnaire);

module.exports = router;
