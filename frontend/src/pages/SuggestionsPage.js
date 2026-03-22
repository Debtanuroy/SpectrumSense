import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "./SuggestionsPage.css";

// ── Clinical exercise database ────────────────────────────────────────────
const SUGGESTIONS = {
  pitch_variability: {
    marker:      "Pitch Variability",
    icon:        "🎵",
    color:       "#1a6ef5",
    domain:      "Voice Analysis",
    problem:     "Monotone or atypical pitch variation — speech lacks natural rises and falls.",
    clinicalBasis: "Ma et al. 2024 meta-analysis (SMD=0.57). ASD speakers show non-conventional pitch patterns that differ from pragmatic norms.",
    timeframe:   "4–8 weeks of daily practice (10–15 min/day)",
    exercises: [
      {
        id: "pv1",
        title: "Siren Hum",
        duration: "5 minutes daily",
        difficulty: "Beginner",
        steps: [
          "Relax your jaw and keep your mouth slightly open.",
          "Start humming at your lowest comfortable pitch.",
          "Slowly glide your voice upward like a siren — as high as comfortable.",
          "Glide back down to your lowest pitch.",
          "Repeat 10 times without stopping.",
        ],
        goal: "Expand the physical range of your pitch — trains the muscles that control pitch variation.",
        tip: "Don't strain. If your voice cracks, that's the limit — work up to it over days.",
        frequency: "Once in the morning, once in the evening.",
      },
      {
        id: "pv2",
        title: "Sentence Stress Drill",
        duration: "10 minutes daily",
        difficulty: "Intermediate",
        steps: [
          "Choose a simple sentence: 'I LOVE going to the PARK today.'",
          "Read it aloud with the capitalised words spoken louder AND higher in pitch.",
          "Record yourself on your phone.",
          "Listen back — did the stressed words actually sound different?",
          "Repeat until you can hear a clear difference.",
          "Progress to more complex sentences each week.",
        ],
        goal: "Train prosodic stress — making important words stand out through pitch rise.",
        tip: "Exaggerate far more than feels natural at first. What feels extreme to you often sounds normal to others.",
        frequency: "Daily — 5 sentences per session.",
      },
      {
        id: "pv3",
        title: "Question vs Statement Contrast",
        duration: "5 minutes daily",
        difficulty: "Intermediate",
        steps: [
          "Say 'You're going to school.' as a flat statement.",
          "Now say 'You're going to school?' as a genuine question — pitch rises at the end.",
          "Alternate between the two 10 times.",
          "Try with different sentences: 'She likes coffee.' / 'She likes coffee?'",
        ],
        goal: "Trains the fundamental prosodic distinction between statements (falling) and questions (rising).",
        tip: "Think of a question mark as a physical arrow going up — let your voice follow it.",
        frequency: "Daily — 3 pairs of sentences.",
      },
      {
        id: "pv4",
        title: "Emotion Contrast Reading",
        duration: "10 minutes, 3x per week",
        difficulty: "Advanced",
        steps: [
          "Choose a neutral sentence: 'The car stopped at the light.'",
          "Say it as if you're excited about it.",
          "Say it as if you're bored.",
          "Say it as if you're surprised.",
          "Say it as if you're annoyed.",
          "Record and compare all four versions — each should sound clearly different.",
        ],
        goal: "Trains the connection between emotional intent and pitch modulation.",
        tip: "Close your eyes and picture the emotion first. Your voice will follow your mental state.",
        frequency: "3 times per week — pick new sentences each session.",
      },
    ],
    resources: [
      { label:"ASHA Prosody Exercises (PDF)", url:"https://www.asha.org" },
      { label:"Ma et al. 2024 research paper", url:"https://www.mdpi.com/2076-328X/14/2/90" },
    ],
  },

  energy_variation: {
    marker:      "Energy Variation",
    icon:        "⚡",
    color:       "#c47c0a",
    domain:      "Voice Analysis",
    problem:     "Flat affect — reduced amplitude variation gives speech a monotone, unexpressive quality.",
    clinicalBasis: "Bone et al. 2014 — reduced energy variation correlates with ASD severity and perceived flat affect.",
    timeframe:   "4–6 weeks of daily practice (10 min/day)",
    exercises: [
      {
        id: "ev1",
        title: "Whisper-to-Shout Scale",
        duration: "5 minutes daily",
        difficulty: "Beginner",
        steps: [
          "Start by whispering a sentence very softly: 'The sun is shining today.'",
          "Say it again at normal volume.",
          "Say it at a louder-than-normal volume.",
          "Say it at your loudest comfortable volume (not shouting — just energetic).",
          "Now reverse — loud back down to whisper.",
          "Repeat 5 times.",
        ],
        goal: "Physically trains the full range of vocal intensity — expands energy variation.",
        tip: "Do this exercise in a private space. You need to feel comfortable being loud.",
        frequency: "Daily — best done in the morning.",
      },
      {
        id: "ev2",
        title: "Emphatic Word Punch",
        duration: "8 minutes daily",
        difficulty: "Beginner",
        steps: [
          "Take a sentence with one key word: 'That was INCREDIBLE.'",
          "Say the sentence but punch the key word — make it noticeably louder.",
          "The words before and after should be softer in contrast.",
          "This contrast is what creates expressive, engaging speech.",
          "Practice with 5 different sentences per session.",
        ],
        goal: "Trains amplitude contrast — the energy difference between key and non-key words.",
        tip: "Think of the key word as a spotlight — everything else is in shadow.",
        frequency: "Daily — 5 sentences per session.",
      },
      {
        id: "ev3",
        title: "Emotional Script Reading",
        duration: "10 minutes, 3x per week",
        difficulty: "Intermediate",
        steps: [
          "Find a short dialogue from a film or book (2–3 lines).",
          "Read it with full emotional commitment — act it out.",
          "Record yourself reading it neutrally, then dramatically.",
          "Listen to the difference in energy between the two recordings.",
          "Aim to use the dramatic version as your baseline for natural speech.",
        ],
        goal: "Connects emotional intent to vocal energy — reduces flat affect in real conversation.",
        tip: "Watch the scene being acted first if possible. Imitation is a valid learning tool.",
        frequency: "3 sessions per week — different scripts each session.",
      },
    ],
    resources: [
      { label:"Bone et al. 2014 — Prosodic Indicators", url:"https://pubmed.ncbi.nlm.nih.gov" },
      { label:"ASHA Voice Therapy Techniques", url:"https://www.asha.org" },
    ],
  },

  speech_rate: {
    marker:      "Speech Rate",
    icon:        "🏃",
    color:       "#8b5cf6",
    domain:      "Voice Analysis",
    problem:     "Atypically slow speech rate — affects conversational flow and listener engagement.",
    clinicalBasis: "Patel et al. 2020, Ma et al. 2024 — slower speech rate is associated with ASD, though effect size is moderate.",
    timeframe:   "6–8 weeks (10 min/day)",
    exercises: [
      {
        id: "sr1",
        title: "Metronome Speech",
        duration: "10 minutes daily",
        difficulty: "Beginner",
        steps: [
          "Set a metronome app on your phone to 100 BPM.",
          "Clap along with the metronome for 30 seconds.",
          "Now speak syllables in time: 'ba-ba-ba-ba-ba' at each beat.",
          "Once comfortable, try words: 'to-day-I-went-to-school'.",
          "Gradually increase to 120 BPM over 2 weeks.",
        ],
        goal: "Directly trains speech rate regulation through rhythmic anchoring.",
        tip: "Free metronome apps: Metronome Beats (Android/iOS). Start slow — accuracy first, speed second.",
        frequency: "Daily — 10 minutes per session.",
      },
      {
        id: "sr2",
        title: "Speed Reading Aloud",
        duration: "5 minutes daily",
        difficulty: "Intermediate",
        steps: [
          "Take a paragraph from any book or news article.",
          "Read it aloud at your normal pace and time yourself.",
          "Read it again 10% faster — aim to reduce the time.",
          "Each day, try to maintain clarity while increasing pace slightly.",
          "Stop if clarity is lost — speed without clarity is not the goal.",
        ],
        goal: "Gradually trains faster articulation while maintaining intelligibility.",
        tip: "Choose content you find interesting — engagement naturally speeds up speech.",
        frequency: "Daily — same passage for 3 days, then switch.",
      },
      {
        id: "sr3",
        title: "Conversation Pacing Practice",
        duration: "15 minutes, 3x per week",
        difficulty: "Advanced",
        steps: [
          "Have a conversation with a trusted person.",
          "Ask them to give you a signal (tap the table) if you're speaking too slowly.",
          "When signalled, consciously increase your pace for the next sentence.",
          "Over weeks, this builds awareness of pace in real conversation.",
        ],
        goal: "Transfers speech rate training into natural conversational contexts.",
        tip: "This works best with someone patient and supportive — not in stressful conversations.",
        frequency: "3 sessions per week — 15 minutes each.",
      },
    ],
    resources: [
      { label:"Speech Rate Norms — Clinical Reference", url:"https://www.asha.org" },
      { label:"Patel et al. 2020 — ASD Speech Acoustics", url:"https://pubmed.ncbi.nlm.nih.gov" },
    ],
  },

  social_communication: {
    marker:      "Social Communication",
    icon:        "💬",
    color:       "#1a6ef5",
    domain:      "Clinical Assessment",
    problem:     "Difficulty with reciprocal conversation, interpreting social cues, and non-verbal communication.",
    clinicalBasis: "DSM-5 Criterion A — Persistent deficits in social communication. One of the two core diagnostic domains.",
    timeframe:   "Ongoing — 3–6 months for noticeable improvement",
    exercises: [
      {
        id: "sc1",
        title: "Conversation Turn Practice",
        duration: "10 minutes daily",
        difficulty: "Beginner",
        steps: [
          "With a partner, have a conversation where you count turns explicitly.",
          "Each person speaks for no more than 3–4 sentences before pausing.",
          "After each turn, the listener summarises what they heard in one sentence.",
          "This builds awareness of conversational structure.",
        ],
        goal: "Trains explicit awareness of turn-taking — reduces monologuing and improves reciprocity.",
        tip: "Use a visual timer (like a sand timer) so both people can see when their turn is ending.",
        frequency: "Daily — any topic that both people find interesting.",
      },
      {
        id: "sc2",
        title: "Sarcasm and Subtext Practice",
        duration: "10 minutes, 3x per week",
        difficulty: "Intermediate",
        steps: [
          "Watch a short comedy clip (2–3 min) with sarcasm or irony.",
          "Pause it and ask: what did they literally say vs what did they mean?",
          "Discuss the difference with a support person if available.",
          "Over time, your brain builds a library of non-literal language patterns.",
        ],
        goal: "Builds recognition of non-literal language — reduces literal interpretation.",
        tip: "TV shows like 'The Office' or 'Brooklyn Nine-Nine' are good for this exercise.",
        frequency: "3 sessions per week — 1–2 clips per session.",
      },
      {
        id: "sc3",
        title: "Facial Expression Matching",
        duration: "5 minutes daily",
        difficulty: "Beginner",
        steps: [
          "Search for 'basic emotions facial expressions' online.",
          "Look at each image: happy, sad, angry, surprised, fearful, disgusted.",
          "Name the emotion without looking at the label.",
          "Check your answer.",
          "Progress to ambiguous expressions over time.",
        ],
        goal: "Builds facial expression recognition — improves non-verbal communication reading.",
        tip: "The app 'Empatico' and Cambridge's 'Mind in the Eyes' test are good resources.",
        frequency: "Daily — 5 minutes is enough.",
      },
    ],
    resources: [
      { label:"National Autistic Society — Social Skills", url:"https://www.autism.org.uk" },
      { label:"ASHA Social Communication Disorder", url:"https://www.asha.org" },
    ],
  },

  executive_function: {
    marker:      "Executive Function",
    icon:        "🧩",
    color:       "#c47c0a",
    domain:      "Clinical Assessment",
    problem:     "Difficulty with task initiation, switching, planning, and organisation.",
    clinicalBasis: "Associated feature of autism — executive dysfunction affects daily functioning significantly.",
    timeframe:   "Ongoing — 2–4 months for functional improvement",
    exercises: [
      {
        id: "ef1",
        title: "Task Initiation Timer",
        duration: "Daily habit",
        difficulty: "Beginner",
        steps: [
          "When you need to start a task, set a timer for 2 minutes.",
          "Your only goal: begin the task before the timer ends.",
          "Don't worry about finishing — just starting.",
          "Over time, lower the timer to 1 minute, then 30 seconds.",
        ],
        goal: "Directly targets task initiation paralysis — the frozen feeling before starting.",
        tip: "Even opening the document counts as starting. Lower the bar for what 'beginning' means.",
        frequency: "Use this technique for any task that feels difficult to start.",
      },
      {
        id: "ef2",
        title: "Visual Day Plan",
        duration: "15 minutes each morning",
        difficulty: "Beginner",
        steps: [
          "Each morning, write or draw 3–5 tasks for the day.",
          "Give each task a time slot (not a deadline — a start time).",
          "Use colour coding: blue = must do, green = want to do, orange = optional.",
          "Cross off tasks as you complete them.",
        ],
        goal: "Externalises working memory and planning — reduces cognitive load.",
        tip: "Physical paper works better than apps for many people. The act of crossing off is motivating.",
        frequency: "Every morning — takes 10–15 minutes to set up.",
      },
      {
        id: "ef3",
        title: "Transition Warning System",
        duration: "Daily habit",
        difficulty: "Beginner",
        steps: [
          "Set an alarm 10 minutes before any planned transition (leaving the house, ending work, etc.).",
          "When the alarm sounds, say out loud: 'I have 10 minutes until [next task].'",
          "Use that time to mentally prepare for the switch.",
          "Gradually reduce to 5 minutes as the habit builds.",
        ],
        goal: "Reduces distress from task switching — gives the brain time to shift cognitive set.",
        tip: "This is especially useful before social events that feel overwhelming.",
        frequency: "Use for all major transitions throughout the day.",
      },
    ],
    resources: [
      { label:"CHADD — Executive Function Strategies", url:"https://chadd.org" },
      { label:"Understood.org — Executive Function", url:"https://www.understood.org" },
    ],
  },

  emotional_regulation: {
    marker:      "Emotional Regulation & Masking",
    icon:        "🎭",
    color:       "#d63b3b",
    domain:      "Clinical Assessment",
    problem:     "Exhaustion from masking, emotional dysregulation, meltdowns, and alexithymia.",
    clinicalBasis: "Masking is strongly associated with late diagnosis and mental health difficulties. Reducing mask load improves wellbeing significantly.",
    timeframe:   "Ongoing — reducing masking requires safe environments and consistent practice",
    exercises: [
      {
        id: "er1",
        title: "Emotion Body Scan",
        duration: "5 minutes, 3x daily",
        difficulty: "Beginner",
        steps: [
          "Set an alarm 3 times per day (morning, midday, evening).",
          "When it sounds, stop and close your eyes for 2 minutes.",
          "Scan your body from head to toe: where do you feel tension? warmth? tightness?",
          "Ask yourself: what emotion might this physical feeling be telling me?",
          "Write it down — even one word is enough.",
        ],
        goal: "Trains alexithymia — builds the habit of noticing and naming emotions in real time.",
        tip: "You don't need to identify the emotion correctly. Just practise noticing something is there.",
        frequency: "3 times per day — set calendar reminders.",
      },
      {
        id: "er2",
        title: "Masking Log",
        duration: "5 minutes at end of day",
        difficulty: "Beginner",
        steps: [
          "At the end of each day, write 3 moments where you masked (pretended to be OK, forced eye contact, suppressed a stim).",
          "For each, note: what triggered it, how tired it made you, and whether it was necessary.",
          "Over time, this helps identify which masking is worth the cost and which isn't.",
        ],
        goal: "Builds self-awareness of masking patterns — first step toward reducing unnecessary masking.",
        tip: "This is not about eliminating all masking — it's about making conscious choices rather than automatic ones.",
        frequency: "Daily — 5 minutes before bed.",
      },
      {
        id: "er3",
        title: "Sensory Decompression Routine",
        duration: "20–30 minutes after high-demand situations",
        difficulty: "Beginner",
        steps: [
          "After any social or sensory overload situation, schedule 20–30 minutes of decompression.",
          "Go somewhere quiet and low-stimulus.",
          "Do one preferred sensory activity: a weighted blanket, listening to one album, a specific texture.",
          "Don't use this time productively — it's recovery, not rest with agenda.",
        ],
        goal: "Prevents meltdowns by addressing overload before it peaks — reduces the emotional dysregulation cycle.",
        tip: "Schedule this proactively after known high-demand events, not just reactively after a meltdown.",
        frequency: "After any event that required significant social or sensory effort.",
      },
    ],
    resources: [
      { label:"Autistic Self Advocacy Network", url:"https://autisticadvocacy.org" },
      { label:"National Autistic Society — Meltdowns", url:"https://www.autism.org.uk" },
      { label:"Alexithymia — Research & Resources", url:"https://www.alexithymia.us" },
    ],
  },

  sensory_processing: {
    marker:      "Sensory Processing",
    icon:        "👂",
    color:       "#0d9660",
    domain:      "Clinical Assessment",
    problem:     "Hyper or hypo-sensitivity to sensory input — sound, light, touch, smell.",
    clinicalBasis: "DSM-5 Criterion B4 — Hyper/hyporeactivity to sensory input is a core diagnostic feature.",
    timeframe:   "Ongoing — sensory integration develops over months with consistent practice",
    exercises: [
      {
        id: "sp1",
        title: "Sensory Profile Mapping",
        duration: "One-time + weekly review",
        difficulty: "Beginner",
        steps: [
          "Draw a simple grid: rows = senses (sound, light, touch, smell, taste, movement), columns = over/under/typical.",
          "For each sense, mark whether you are over-sensitive, under-sensitive, or typical.",
          "List 3 specific triggers per sensitive sense (e.g. fluorescent lights, seams in socks).",
          "For each trigger, write one accommodation strategy.",
        ],
        goal: "Builds explicit awareness of your sensory profile — the first step to managing it.",
        tip: "This mapping changes over time — review it monthly.",
        frequency: "Create once, review monthly.",
      },
      {
        id: "sp2",
        title: "Gradual Sound Desensitisation",
        duration: "10 minutes daily",
        difficulty: "Intermediate",
        steps: [
          "Identify your most distressing sound (e.g. busy café noise).",
          "Find a recording of that sound on YouTube.",
          "Play it at very low volume for 2 minutes while doing something calming.",
          "Each week, increase volume by one step.",
          "Stop if distress becomes significant — this should be mild discomfort only.",
        ],
        goal: "Gradual exposure reduces the nervous system's threat response to specific sounds.",
        tip: "This is systematic desensitisation — it takes weeks. Don't rush it.",
        frequency: "Daily — 2–5 minutes per session.",
      },
      {
        id: "sp3",
        title: "Sensory Diet",
        duration: "Throughout the day",
        difficulty: "Beginner",
        steps: [
          "A 'sensory diet' is a planned schedule of sensory activities.",
          "Include calming inputs: deep pressure, slow rocking, dim lighting.",
          "Include alerting inputs: cold water, bright light, movement — when you need to be more engaged.",
          "Schedule these at specific times: morning, before work, before social events, before bed.",
        ],
        goal: "Maintains sensory regulation throughout the day — prevents overload from building up.",
        tip: "An occupational therapist can help design a personalised sensory diet.",
        frequency: "Daily — built into your schedule.",
      },
    ],
    resources: [
      { label:"STAR Institute for Sensory Processing", url:"https://sensoryhealth.org" },
      { label:"SPD Foundation", url:"https://spdstar.org" },
      { label:"OT for Sensory Integration", url:"https://www.aota.org" },
    ],
  },
};

const DOMAIN_FILTER = ["All", "Voice Analysis", "Clinical Assessment"];

export default function SuggestionsPage({ goTo, focusMarker }) {
  const [activeMarker, setActiveMarker] = useState(focusMarker || Object.keys(SUGGESTIONS)[0]);
  const [activeExercise, setActiveExercise] = useState(null);
  const [domainFilter, setDomainFilter] = useState("All");
  const [expandedExercise, setExpandedExercise] = useState(null);

  const current    = SUGGESTIONS[activeMarker];
  const markerKeys = Object.keys(SUGGESTIONS).filter(function(k) {
    return domainFilter === "All" || SUGGESTIONS[k].domain === domainFilter;
  });

  return (
    <div className="sugg">
      <Navbar currentPage="suggestions" goTo={goTo} />

      <div className="sugg__layout container container--wide">

        {/* Sidebar */}
        <aside className="sugg__sidebar">
          <div className="sugg__sidebar-title">Filter by domain</div>
          <div className="sugg__domain-filter">
            {DOMAIN_FILTER.map(function(d) {
              return (
                <button
                  key={d}
                  className={"sugg__domain-btn " + (domainFilter === d ? "active" : "")}
                  onClick={function() { setDomainFilter(d); }}
                >
                  {d}
                </button>
              );
            })}
          </div>

          <div className="sugg__sidebar-title" style={{ marginTop:20 }}>Markers</div>
          {markerKeys.map(function(key) {
            const s = SUGGESTIONS[key];
            return (
              <button
                key={key}
                className={"sugg__nav-item " + (activeMarker === key ? "active" : "")}
                style={activeMarker === key ? { borderColor:s.color, background:s.color+"12" } : {}}
                onClick={function() { setActiveMarker(key); setExpandedExercise(null); }}
              >
                <span className="sugg__nav-icon">{s.icon}</span>
                <div className="sugg__nav-text">
                  <span className="sugg__nav-label" style={activeMarker === key ? { color:s.color } : {}}>
                    {s.marker}
                  </span>
                  <span className="sugg__nav-domain">{s.domain}</span>
                </div>
              </button>
            );
          })}
        </aside>

        {/* Main content */}
        <main className="sugg__main">

          {/* Header */}
          <div className="sugg__header animate-in" style={{ borderLeft:"4px solid " + current.color }}>
            <div className="sugg__header-top">
              <span className="sugg__header-icon">{current.icon}</span>
              <div>
                <div className="sugg__header-domain">{current.domain}</div>
                <h2 className="sugg__header-title">{current.marker}</h2>
              </div>
            </div>
            <p className="sugg__header-problem">{current.problem}</p>
            <div className="sugg__header-meta">
              <div className="sugg__meta-item">
                <span>🔬</span>
                <span>{current.clinicalBasis}</span>
              </div>
              <div className="sugg__meta-item">
                <span>⏱️</span>
                <span><strong>Expected improvement:</strong> {current.timeframe}</span>
              </div>
            </div>
          </div>

          {/* Exercises */}
          <div className="sugg__exercises-title animate-in">
            <h3>Therapeutic exercises</h3>
            <span className="badge badge--info">{current.exercises.length} exercises</span>
          </div>

          <div className="sugg__exercises animate-in animate-in--delay-1">
            {current.exercises.map(function(ex, i) {
              const isOpen = expandedExercise === ex.id;
              return (
                <div
                  key={ex.id}
                  className={"sugg__exercise card " + (isOpen ? "sugg__exercise--open" : "")}
                  style={isOpen ? { borderColor: current.color } : {}}
                >
                  <div
                    className="sugg__exercise-header"
                    onClick={function() { setExpandedExercise(isOpen ? null : ex.id); }}
                  >
                    <div className="sugg__exercise-num" style={{ background:current.color+"20", color:current.color }}>
                      {i + 1}
                    </div>
                    <div className="sugg__exercise-meta">
                      <div className="sugg__exercise-title">{ex.title}</div>
                      <div className="sugg__exercise-tags">
                        <span className="sugg__tag">⏱ {ex.duration}</span>
                        <span className="sugg__tag">📊 {ex.difficulty}</span>
                        <span className="sugg__tag">🔁 {ex.frequency}</span>
                      </div>
                    </div>
                    <span className="sugg__exercise-toggle">{isOpen ? "−" : "+"}</span>
                  </div>

                  {isOpen && (
                    <div className="sugg__exercise-body animate-in">
                      <div className="sugg__goal-box">
                        <span>🎯</span>
                        <p><strong>Goal:</strong> {ex.goal}</p>
                      </div>

                      <div className="sugg__steps-title">Step-by-step instructions</div>
                      <ol className="sugg__steps">
                        {ex.steps.map(function(step, si) {
                          return (
                            <li key={si} className="sugg__step">
                              <span className="sugg__step-num">{si + 1}</span>
                              <p>{step}</p>
                            </li>
                          );
                        })}
                      </ol>

                      <div className="sugg__tip-box">
                        <span>💡</span>
                        <p><strong>Clinical tip:</strong> {ex.tip}</p>
                      </div>

                      <div className="sugg__frequency-box">
                        <span>📅</span>
                        <p><strong>Recommended frequency:</strong> {ex.frequency}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Resources */}
          <div className="card animate-in animate-in--delay-2">
            <div className="card__body">
              <h3>Further reading & resources</h3>
              <div className="sugg__resources mt-16">
                {current.resources.map(function(r) {
                  return (
                    <a
                      key={r.label}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sugg__resource-link"
                    >
                      <span>📄</span>
                      <span>{r.label}</span>
                      <span className="sugg__resource-arrow">→</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="sugg__disclaimer animate-in animate-in--delay-3">
            <span>⚕️</span>
            <p>
              These exercises are evidence-informed but are not a substitute for
              professional speech-language therapy or clinical psychology.
              Consult a qualified professional for a personalised treatment plan.
            </p>
          </div>

        </main>
      </div>
    </div>
  );
}