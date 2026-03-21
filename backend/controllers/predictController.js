const runModel = require("../utils/runModel");

// ─────────────────────────────────────────────────────────────────────────────
// AQ-10 Questions — aligned to dataset columns A1_Score … A10_Score
// Discriminative power computed from dataset (YES mean − NO mean):
//   A9:0.671 | A5:0.606 | A6:0.603 | A4:0.530 | A3:0.496
//   A10:0.431 | A7:0.391 | A2:0.350 | A1:0.301 | A8:0.255
// Dataset boundary: result ≤ 6 → 100% NO, result ≥ 7 → 100% YES
// Mean AQ: ASD=YES → 8.26, ASD=NO → 3.63
// ─────────────────────────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    id: 1, field: "A1_Score",
    text: "I often notice small sounds when others do not.",
    category: "sensory_sensitivity",
    scoringOptions: ["definitely_agree", "slightly_agree"],
    discriminativePower: 0.301,
  },
  {
    id: 2, field: "A2_Score",
    text: "I usually concentrate more on the whole picture rather than small details.",
    category: "attention_to_detail",
    scoringOptions: ["definitely_disagree", "slightly_disagree"],
    discriminativePower: 0.350,
  },
  {
    id: 3, field: "A3_Score",
    text: "I find it easy to do more than one thing at once.",
    category: "multitasking",
    scoringOptions: ["definitely_disagree", "slightly_disagree"],
    discriminativePower: 0.496,
  },
  {
    id: 4, field: "A4_Score",
    text: "If there is an interruption, I can switch back to what I was doing very quickly.",
    category: "task_switching",
    scoringOptions: ["definitely_disagree", "slightly_disagree"],
    discriminativePower: 0.530,
  },
  {
    id: 5, field: "A5_Score",
    text: "I find it easy to 'read between the lines' when someone is talking to me.",
    category: "social_communication",
    scoringOptions: ["definitely_disagree", "slightly_disagree"],
    discriminativePower: 0.606,
  },
  {
    id: 6, field: "A6_Score",
    text: "I know how to tell if someone listening to me is getting bored.",
    category: "social_awareness",
    scoringOptions: ["definitely_disagree", "slightly_disagree"],
    discriminativePower: 0.603,
  },
  {
    id: 7, field: "A7_Score",
    text: "When I am reading a story, I find it difficult to work out the characters' intentions.",
    category: "theory_of_mind",
    scoringOptions: ["definitely_agree", "slightly_agree"],
    discriminativePower: 0.391,
  },
  {
    id: 8, field: "A8_Score",
    text: "I like to collect information about categories of things (e.g. types of cars, birds, trains).",
    category: "restricted_interests",
    scoringOptions: ["definitely_agree", "slightly_agree"],
    discriminativePower: 0.255,
  },
  {
    id: 9, field: "A9_Score",
    text: "I find it easy to work out what someone is thinking or feeling just by looking at their face.",
    category: "social_cognition",
    scoringOptions: ["definitely_disagree", "slightly_disagree"],
    discriminativePower: 0.671,
  },
  {
    id: 10, field: "A10_Score",
    text: "I find it difficult to work out people's intentions.",
    category: "social_communication",
    scoringOptions: ["definitely_agree", "slightly_agree"],
    discriminativePower: 0.431,
  },
];

const CATEGORY_META = {
  sensory_sensitivity:  { label: "Sensory Sensitivity",        icon: "ear"      },
  attention_to_detail:  { label: "Attention to Detail",        icon: "eye"      },
  multitasking:         { label: "Multitasking Difficulty",     icon: "layers"   },
  task_switching:       { label: "Task Switching Difficulty",   icon: "shuffle"  },
  social_communication: { label: "Social Communication",       icon: "message"  },
  social_awareness:     { label: "Social Awareness",           icon: "users"    },
  theory_of_mind:       { label: "Theory of Mind",             icon: "brain"    },
  restricted_interests: { label: "Focused Interests",          icon: "bookmark" },
  social_cognition:     { label: "Reading Facial Expressions", icon: "smile"    },
};

const RESPONSE_OPTIONS = [
  { value: "definitely_agree",    label: "Definitely Agree"    },
  { value: "slightly_agree",      label: "Slightly Agree"      },
  { value: "slightly_disagree",   label: "Slightly Disagree"   },
  { value: "definitely_disagree", label: "Definitely Disagree" },
];

const CATEGORY_EXPLANATIONS = {
  sensory_sensitivity:
    "Heightened sensitivity to sounds and sensory input is a common early indicator in autism spectrum profiles.",
  attention_to_detail:
    "A preference for detail-focused processing over global context is a well-documented autistic cognitive style.",
  multitasking:
    "Difficulty splitting attention across simultaneous tasks is associated with differences in executive function.",
  task_switching:
    "Challenges recovering focus after interruptions reflect reduced cognitive flexibility, common in autistic individuals.",
  social_communication:
    "Difficulty interpreting implicit or figurative language is among the strongest indicators in this dataset.",
  social_awareness:
    "Reduced awareness of others' engagement cues reflects differences in social monitoring, a core area of autism.",
  theory_of_mind:
    "Difficulty inferring characters' intentions is linked to Theory of Mind differences.",
  restricted_interests:
    "A strong drive to categorise and collect information about specific topics is a hallmark autistic trait.",
  social_cognition:
    "Difficulty reading facial expressions is the single most discriminative question in this dataset.",
};

// ─────────────────────────────────────────────────────────────────────────────
// Questionnaire scoring
// ─────────────────────────────────────────────────────────────────────────────

function scoreQuestionnaire(answers) {
  let floatScore = 0;
  let aqScore    = 0;
  const flaggedReasons = [];
  const categoryScores = {};

  for (const answer of answers) {
    const question = QUESTIONS.find((q) => q.id === answer.questionId);
    if (!question) continue;

    const isScoring = question.scoringOptions.includes(answer.response);
    const isStrong  = isScoring &&
      (answer.response === "definitely_agree" || answer.response === "definitely_disagree");

    if (isScoring) {
      const increment = isStrong ? 1 : 0.5;
      floatScore += increment;
      if (isStrong) aqScore += 1;

      categoryScores[question.category] =
        (categoryScores[question.category] || 0) + increment;

      flaggedReasons.push({
        questionId:          question.id,
        questionText:        question.text,
        category:            question.category,
        categoryLabel:       CATEGORY_META[question.category]?.label || question.category,
        categoryIcon:        CATEGORY_META[question.category]?.icon  || "info",
        yourAnswer:          RESPONSE_OPTIONS.find((o) => o.value === answer.response)?.label || answer.response,
        significance:        isStrong ? "high" : "moderate",
        discriminativePower: question.discriminativePower,
        explanation:         CATEGORY_EXPLANATIONS[question.category] || "",
      });
    }
  }

  flaggedReasons.sort((a, b) => b.discriminativePower - a.discriminativePower);

  const riskLevel =
    floatScore >= 6 ? "high"     :
    floatScore >= 4 ? "moderate" : "low";

  return {
    aqScore,
    floatScore,
    percentage: Math.round((floatScore / 10) * 100),
    riskLevel,
    flaggedReasons,
    categoryBreakdown: Object.entries(categoryScores)
      .map(([cat, score]) => ({
        category: cat,
        label:    CATEGORY_META[cat]?.label || cat,
        icon:     CATEGORY_META[cat]?.icon  || "info",
        score,
      }))
      .sort((a, b) => b.score - a.score),
    datasetContext: {
      avgScoreASD:       8.26,
      avgScoreNonASD:    3.63,
      clinicalThreshold: 6,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Controllers
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/predict  — ML model prediction with probability & risk level
exports.predictAutism = async (req, res) => {
  try {
    const { features } = req.body;

    if (!features || !Array.isArray(features)) {
      return res.status(400).json({ error: "features array is required" });
    }

    // runModel now returns a parsed JSON object from predict.py
    const result = await runModel(features);

    res.json({
      prediction:  result.prediction,    // "Autism Likely" | "Autism Not Likely"
      predicted:   result.predicted,     // 1 | 0
      percentage:  result.percentage,    // model's probability of ASD (0-100)
      prob_no:     result.prob_no,       // probability of no ASD (0-100)
      risk_level:  result.risk_level,    // "low" | "moderate" | "high"
    });

  } catch (error) {
    console.error("Prediction error:", error);
    res.status(500).json({ error: "Prediction failed" });
  }
};

// GET /api/questionnaire/questions
exports.getQuestions = (req, res) => {
  res.json({
    questions: QUESTIONS.map((q) => ({
      id:            q.id,
      field:         q.field,
      text:          q.text,
      category:      q.category,
      categoryLabel: CATEGORY_META[q.category]?.label || q.category,
      options:       RESPONSE_OPTIONS,
    })),
    totalQuestions: QUESTIONS.length,
  });
};

// POST /api/questionnaire/submit
exports.submitQuestionnaire = (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: "answers array is required" });
    }

    if (answers.length < QUESTIONS.length) {
      return res.status(400).json({
        error:    `All ${QUESTIONS.length} questions must be answered`,
        answered: answers.length,
        required: QUESTIONS.length,
      });
    }

    for (const a of answers) {
      if (!QUESTIONS.find((q) => q.id === a.questionId)) {
        return res.status(400).json({ error: `Invalid questionId: ${a.questionId}` });
      }
      if (!RESPONSE_OPTIONS.find((o) => o.value === a.response)) {
        return res.status(400).json({
          error:   `Invalid response "${a.response}" for question ${a.questionId}`,
          allowed: RESPONSE_OPTIONS.map((o) => o.value),
        });
      }
    }

    const result = scoreQuestionnaire(answers);

    res.json({
      success: true,
      result: {
        ...result,
        disclaimer:
          "This tool is based on the AQ-10 screening instrument and is not a clinical diagnosis. " +
          "A qualified healthcare professional should be consulted for a formal evaluation.",
      },
    });

  } catch (error) {
    console.error("Questionnaire error:", error);
    res.status(500).json({ error: "Questionnaire scoring failed" });
  }
};
