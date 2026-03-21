const DOMAINS = {
  social_communication: {
    label:"Social Communication", icon:"💬", color:"#1a6ef5",
    description:"Measures difficulty with reciprocal conversation, interpreting social cues, non-verbal communication, and forming/maintaining relationships.",
    clinicalBasis:"DSM-5 Criterion A — Persistent deficits in social communication and interaction.",
  },
  restricted_repetitive: {
    label:"Restricted & Repetitive Behaviours", icon:"🔁", color:"#8b5cf6",
    description:"Measures inflexible routines, intense focused interests, repetitive motor behaviours, and resistance to change.",
    clinicalBasis:"DSM-5 Criterion B — Restricted, repetitive patterns of behaviour, interests, or activities.",
  },
  sensory_processing: {
    label:"Sensory Processing", icon:"👂", color:"#0d9660",
    description:"Measures hyper- or hypo-reactivity to sensory input across auditory, visual, tactile, olfactory, and proprioceptive channels.",
    clinicalBasis:"DSM-5 Criterion B4 — Hyper/hyporeactivity to sensory input.",
  },
  executive_function: {
    label:"Executive Function", icon:"🧩", color:"#c47c0a",
    description:"Measures difficulties with task initiation, cognitive flexibility, working memory, planning, and organisation.",
    clinicalBasis:"Associated feature — Executive dysfunction is highly prevalent in autistic adults.",
  },
  emotional_regulation: {
    label:"Emotional Regulation & Masking", icon:"🎭", color:"#d63b3b",
    description:"Measures emotional dysregulation, camouflaging/masking autistic traits, alexithymia, and social exhaustion.",
    clinicalBasis:"Masking and alexithymia are strongly associated with late diagnosis, especially in women.",
  },
  developmental: {
    label:"Developmental Background", icon:"📋", color:"#64748b",
    description:"Collects developmental history, prior assessments, and family history. Informational — does not contribute to the scored total.",
    clinicalBasis:"Standard clinical intake — contextualises scored results.",
  },
};

const QUESTIONS = [
  // Block 1: Social Communication
  { id:1, domain:"social_communication", scored:true, text:"I find it hard to maintain a back-and-forth conversation — I either talk too much or struggle to contribute.", probe:"Think about conversations with people you don't know well." },
  { id:2, domain:"social_communication", scored:true, text:"I miss sarcasm, irony, or implied meaning and tend to take what people say literally.", probe:"e.g. Someone says 'Oh great, another Monday' and you're unsure if they mean it." },
  { id:3, domain:"social_communication", scored:true, text:"I struggle to know when it's my turn to speak in a conversation.", probe:"You may speak over people, or wait too long and miss your chance." },
  { id:4, domain:"social_communication", scored:true, text:"Maintaining eye contact feels uncomfortable, forced, or requires conscious effort.", probe:"Either you avoid it or maintain it artificially because you know you're supposed to." },
  { id:5, domain:"social_communication", scored:true, text:"I find it difficult to make or maintain friendships, even when I want to.", probe:"You may want connection but find the 'rules' of friendship confusing or exhausting." },
  { id:6, domain:"social_communication", scored:true, text:"I prefer conversations about specific facts or topics over general small talk.", probe:"Weather, weekend plans, and pleasantries feel pointless or draining." },
  { id:7, domain:"social_communication", scored:true, text:"I miss non-verbal cues — facial expressions, body language, or tone of voice — that others pick up automatically.", probe:"You may not notice someone is bored, upset, or flirting unless they say so explicitly." },
  { id:8, domain:"social_communication", scored:true, text:"I have been told my communication style seems blunt, odd, overly formal, or 'different'.", probe:"Others may misread you as rude or cold when you don't intend to be." },
  // Block 2: Restricted & Repetitive
  { id:9,  domain:"restricted_repetitive", scored:true, text:"I rely on strict routines and feel significant distress when they are disrupted.", probe:"e.g. Same route, same seat, same order of tasks — deviations feel wrong or upsetting." },
  { id:10, domain:"restricted_repetitive", scored:true, text:"I have one or more deep, intense interests that I know about in far more detail than most people.", probe:"You may spend large amounts of time and attention on this interest." },
  { id:11, domain:"restricted_repetitive", scored:true, text:"I engage in repetitive physical movements, sounds, or behaviours — especially when stressed or excited.", probe:"e.g. Rocking, hand-flapping, pacing, humming, skin-picking, hair-twirling." },
  { id:12, domain:"restricted_repetitive", scored:true, text:"I find ambiguity, open-ended situations, or 'grey areas' very difficult and prefer clear rules.", probe:"Unstructured time or vague instructions cause more anxiety than for others." },
  { id:13, domain:"restricted_repetitive", scored:true, text:"I repeat specific words, phrases, sounds, or scripts — either out loud or internally.", probe:"This may happen when stressed, excited, or processing information." },
  { id:14, domain:"restricted_repetitive", scored:true, text:"I become strongly attached to specific objects, places, or ways of doing things and resist changing them.", probe:"Losing or replacing a familiar object may feel disproportionately distressing." },
  // Block 3: Sensory Processing
  { id:15, domain:"sensory_processing", scored:true, text:"I am highly sensitive to sounds — background noise, certain frequencies, or overlapping sounds are distressing.", probe:"e.g. Fluorescent lights humming, chewing sounds, music in shops." },
  { id:16, domain:"sensory_processing", scored:true, text:"Certain textures of clothing, food, or surfaces cause significant discomfort or distress.", probe:"e.g. Seams in socks, labels, certain fabrics, or food textures." },
  { id:17, domain:"sensory_processing", scored:true, text:"I am sensitive to bright lights, visual patterns, or busy visual environments.", probe:"e.g. Supermarkets, busy streets, or screens in a dark room." },
  { id:18, domain:"sensory_processing", scored:true, text:"I notice or am bothered by smells that others don't seem to register.", probe:"Perfume, food smells, cleaning products, or people's scent." },
  { id:19, domain:"sensory_processing", scored:true, text:"I have a higher than average threshold for pain, temperature, or physical discomfort.", probe:"You may not notice injuries or extreme cold/heat until they become severe." },
  { id:20, domain:"sensory_processing", scored:true, text:"I actively seek out certain sensory experiences — pressure, movement, specific textures.", probe:"e.g. Weighted blankets, spinning, tight clothing, touching certain surfaces." },
  { id:21, domain:"sensory_processing", scored:true, text:"Sensory overload causes me to shut down, withdraw, or become overwhelmed in a way others find hard to understand.", probe:"Busy environments like shopping centres or open-plan offices become intolerable." },
  // Block 4: Executive Function
  { id:22, domain:"executive_function", scored:true, text:"I struggle to start tasks even when I want to do them — I experience a 'frozen' feeling before beginning.", probe:"Sometimes called 'task paralysis' — you know what to do but can't initiate." },
  { id:23, domain:"executive_function", scored:true, text:"Switching between tasks or topics mid-flow is difficult and disorienting.", probe:"Interruptions are particularly distressing because it's hard to re-enter the previous task." },
  { id:24, domain:"executive_function", scored:true, text:"I lose track of time or have a poor sense of how long things take.", probe:"You may be frequently late, misjudge deadlines, or hyperfocus and lose hours." },
  { id:25, domain:"executive_function", scored:true, text:"Planning and organising multi-step activities is significantly harder for me than for others.", probe:"e.g. Planning a trip, managing a project, or preparing a meal with multiple components." },
  { id:26, domain:"executive_function", scored:true, text:"Having too many choices causes decision fatigue or anxiety disproportionate to the decision's importance.", probe:"e.g. Choosing from a large menu, or deciding what to do with unstructured time." },
  // Block 5: Emotional Regulation & Masking
  { id:27, domain:"emotional_regulation", scored:true, text:"I am exhausted by the effort of appearing 'normal' in social situations — adapting my behaviour to fit in.", probe:"Called 'masking' or 'camouflaging'. It may cause significant fatigue after social events." },
  { id:28, domain:"emotional_regulation", scored:true, text:"I experience intense emotional reactions — meltdowns or complete shutdowns — under stress or overload.", probe:"These may feel uncontrollable and disproportionate to observers, but are a genuine overload response." },
  { id:29, domain:"emotional_regulation", scored:true, text:"I struggle to identify, name, or describe my own emotions in the moment.", probe:"Called alexithymia. You may only realise you were stressed after the fact." },
  { id:30, domain:"emotional_regulation", scored:true, text:"I feel fundamentally different from other people — like I am performing or observing from the outside.", probe:"A persistent sense of not fitting in, even in spaces where you 'should' feel comfortable." },
  { id:31, domain:"emotional_regulation", scored:true, text:"Anxiety in unstructured, unpredictable, or socially ambiguous situations is significantly higher for me than others.", probe:"e.g. Parties with no set agenda, meeting new people in informal settings." },
  // Block 6: Developmental (informational)
  { id:32, domain:"developmental", scored:false, type:"select", text:"At what age were concerns about your development or social behaviour first noticed?", options:["Before age 3","Ages 3–5","Ages 6–12","Teenage years (13–18)","Adulthood (18+)","No concerns noticed until now"] },
  { id:33, domain:"developmental", scored:false, type:"multiselect", text:"Have you previously been assessed or diagnosed with any of the following?", options:["No previous assessment","ADHD","Anxiety disorder","Depression","Autism spectrum (previous assessment)","Dyslexia / dyspraxia","Other neurodevelopmental condition"] },
  { id:34, domain:"developmental", scored:false, type:"select", text:"Does anyone in your immediate family have a formal autism diagnosis or significant autistic traits?", options:["Yes — formal diagnosis in family","Yes — suspected but undiagnosed","No","Unknown / not sure"] },
  { id:35, domain:"developmental", scored:false, type:"select", text:"What is your gender identity?", options:["Male","Female","Non-binary / gender diverse","Prefer not to say"] },
  { id:36, domain:"developmental", scored:false, type:"select", text:"What is your current age range?", options:["18–25","26–35","36–45","46–55","56–65","65+"] },
];

const LIKERT = [
  { value:1, label:"Never",     desc:"Not at all like me" },
  { value:2, label:"Rarely",    desc:"Slightly like me" },
  { value:3, label:"Sometimes", desc:"Moderately like me" },
  { value:4, label:"Often",     desc:"Mostly like me" },
  { value:5, label:"Always",    desc:"Very strongly like me" },
];

function scoreClinical(answers) {
  const domainAccum = {};
  Object.keys(DOMAINS).forEach(d => { domainAccum[d] = { total:0, count:0, responses:[] }; });

  for (const ans of answers) {
    const q = QUESTIONS.find(q => q.id === ans.questionId);
    if (!q || !q.scored) continue;
    const raw = Number(ans.value);
    const pct = ((raw - 1) / 4) * 100;
    domainAccum[q.domain].total += pct;
    domainAccum[q.domain].count += 1;
    domainAccum[q.domain].responses.push({
      questionId: q.id, questionText: q.text,
      value: raw, label: LIKERT.find(o => o.value === raw)?.label || raw,
      scorePct: Math.round(pct),
    });
  }

  const RISK_META = {
    low:      { label:"Low indicators",       recommendation:"Your responses suggest few autistic traits at this time. If you have ongoing concerns, a professional consultation is worthwhile." },
    moderate: { label:"Moderate indicators",  recommendation:"Your responses suggest a moderate level of autistic traits across several domains. A formal assessment by a clinical psychologist is recommended." },
    high:     { label:"High indicators",      recommendation:"Your responses are consistent with significant autistic traits across multiple domains. A formal clinical evaluation is strongly recommended." },
    very_high:{ label:"Very high indicators", recommendation:"Your responses indicate very high levels of autistic traits across most domains. Please seek a formal clinical evaluation as a priority." },
  };

  const domains = Object.entries(DOMAINS)
    .filter(([k]) => k !== "developmental")
    .map(([key, meta]) => {
      const { total, count, responses } = domainAccum[key];
      const score = count > 0 ? Math.round(total / count) : 0;
      const riskLevel = score >= 76 ? "very_high" : score >= 56 ? "high" : score >= 31 ? "moderate" : "low";
      return { key, label:meta.label, icon:meta.icon, color:meta.color, description:meta.description, clinicalBasis:meta.clinicalBasis, score, riskLevel, responses };
    });

  const overallScore = Math.round(domains.reduce((s,d) => s + d.score, 0) / domains.length);
  const riskLevel    = overallScore >= 76 ? "very_high" : overallScore >= 56 ? "high" : overallScore >= 31 ? "moderate" : "low";

  const devAnswers = answers
    .filter(a => { const q = QUESTIONS.find(q => q.id === a.questionId); return q && !q.scored; })
    .map(a => { const q = QUESTIONS.find(q => q.id === a.questionId); return { questionId:a.questionId, questionText:q?.text, value:a.value }; });

  return {
    overallScore, riskLevel,
    riskMeta: RISK_META[riskLevel],
    domains, devAnswers,
    totalScored: QUESTIONS.filter(q => q.scored).length,
    disclaimer: "This assessment is based on DSM-5 criteria and validated screening instruments. It is a screening tool only and does not constitute a clinical diagnosis. A formal evaluation by a qualified clinical psychologist or psychiatrist is required for diagnosis.",
  };
}

exports.getClinicalQuestions = (req, res) => {
  res.json({ domains:DOMAINS, questions:QUESTIONS, likertOptions:LIKERT, totalScored:QUESTIONS.filter(q=>q.scored).length, totalQuestions:QUESTIONS.length });
};

exports.submitClinicalAssessment = (req, res) => {
  try {
    const { answers } = req.body;
    if (!answers || !Array.isArray(answers) || answers.length === 0)
      return res.status(400).json({ error:"answers array is required" });

    const scoredQs = QUESTIONS.filter(q => q.scored);
    const scoredAs = answers.filter(a => { const q = QUESTIONS.find(q => q.id === a.questionId); return q && q.scored; });

    if (scoredAs.length < scoredQs.length)
      return res.status(400).json({ error:`All ${scoredQs.length} scored questions must be answered`, answered:scoredAs.length, required:scoredQs.length });

    for (const a of scoredAs) {
      if (![1,2,3,4,5].includes(Number(a.value)))
        return res.status(400).json({ error:`Invalid value ${a.value} for question ${a.questionId}. Must be 1–5.` });
    }

    res.json({ success:true, result: scoreClinical(answers) });
  } catch(err) {
    console.error("Clinical error:", err);
    res.status(500).json({ error:"Assessment scoring failed" });
  }
};