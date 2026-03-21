import React, { useState } from "react";
import "./MLPredictPage.css";
 
const API = "http://localhost:5000/api";
 
// NOTE: column names match the ACTUAL dataset spellings exactly:
// jundice (not jaundice), austim (not autism), contry_of_res (not country)
 
const COUNTRIES = [
  "Afghanistan","AmericanSamoa","Angola","Argentina","Armenia","Aruba",
  "Australia","Austria","Azerbaijan","Bahamas","Bangladesh","Belgium",
  "Bolivia","Brazil","Burundi","Canada","Chile","China","Costa Rica",
  "Cyprus","Czech Republic","Ecuador","Egypt","Ethiopia","Finland",
  "France","Germany","Hong Kong","Iceland","India","Indonesia","Iran",
  "Iraq","Ireland","Italy","Japan","Jordan","Kazakhstan","Lebanon",
  "Malaysia","Mexico","Nepal","Netherlands","New Zealand","Nicaragua",
  "Niger","Oman","Pakistan","Philippines","Portugal","Romania","Russia",
  "Saudi Arabia","Serbia","Sierra Leone","South Africa","Spain","Sri Lanka",
  "Sweden","Tonga","Turkey","Ukraine","United Arab Emirates",
  "United Kingdom","United States","Uruguay","Viet Nam",
];
 
const DEMOGRAPHICS = [
  { key: "age", label: "Age", type: "number", placeholder: "e.g. 28", min: 18, max: 120 },
  {
    key: "gender", label: "Gender", type: "select",
    options: ["m","f","o"], labels: ["Male","Female","Other / Prefer not to say"],
  },
  {
    key: "ethnicity", label: "Ethnicity", type: "select",
    // "Middle Eastern " has a real trailing space in the dataset — kept exactly
    options: ["?","Asian","Black","Hispanic","Latino","Middle Eastern ","Others","Pasifika","South Asian","Turkish","White-European","others"],
    labels:  ["Unknown","Asian","Black","Hispanic","Latino","Middle Eastern","Others","Pasifika","South Asian","Turkish","White-European","Others (lowercase)"],
  },
  {
    key: "jundice", label: "Born with jaundice?", type: "select",
    options: ["no","yes"], labels: ["No","Yes"],
  },
  {
    key: "austim", label: "Family member with autism?", type: "select",
    options: ["no","yes"], labels: ["No","Yes"],
  },
  {
    key: "contry_of_res", label: "Country of residence", type: "select",
    options: COUNTRIES, labels: COUNTRIES,
  },
  {
    key: "used_app_before", label: "Used a screening app before?", type: "select",
    options: ["no","yes"], labels: ["No","Yes"],
  },
  {
    key: "relation", label: "Who is completing this?", type: "select",
    options: ["?","Health care professional","Others","Parent","Relative","Self"],
    labels:  ["Unknown","Health care professional","Others","Parent","Relative","Self"],
  },
];
 
const AQ_QUESTIONS = [
  "I often notice small sounds when others do not.",
  "I usually concentrate more on the whole picture rather than small details.",
  "I find it easy to do more than one thing at once.",
  "If there is an interruption, I can switch back to what I was doing very quickly.",
  "I find it easy to 'read between the lines' when someone is talking to me.",
  "I know how to tell if someone listening to me is getting bored.",
  "When I am reading a story, I find it difficult to work out the characters' intentions.",
  "I like to collect information about categories of things.",
  "I find it easy to work out what someone is thinking or feeling just by looking at their face.",
  "I find it difficult to work out people's intentions.",
];
 
// LabelEncoder encodes alphabetically → index
// These match exactly what sklearn produces on this dataset
const ENCODE = {
  gender:          { "f":0, "m":1, "o":0 }, // "o" not in dataset — defaults to female encoding as neutral fallback
  ethnicity: {
    "?":0, "Asian":1, "Black":2, "Hispanic":3, "Latino":4,
    "Middle Eastern ":5,   // trailing space is intentional — matches dataset
    "Others":6, "Pasifika":7, "South Asian":8, "Turkish":9,
    "White-European":10, "others":11,
  },
  jundice:         { "no":0, "yes":1 },
  austim:          { "no":0, "yes":1 },
  contry_of_res: {
    "Afghanistan":0,"AmericanSamoa":1,"Angola":2,"Argentina":3,"Armenia":4,
    "Aruba":5,"Australia":6,"Austria":7,"Azerbaijan":8,"Bahamas":9,
    "Bangladesh":10,"Belgium":11,"Bolivia":12,"Brazil":13,"Burundi":14,
    "Canada":15,"Chile":16,"China":17,"Costa Rica":18,"Cyprus":19,
    "Czech Republic":20,"Ecuador":21,"Egypt":22,"Ethiopia":23,"Finland":24,
    "France":25,"Germany":26,"Hong Kong":27,"Iceland":28,"India":29,
    "Indonesia":30,"Iran":31,"Iraq":32,"Ireland":33,"Italy":34,
    "Japan":35,"Jordan":36,"Kazakhstan":37,"Lebanon":38,"Malaysia":39,
    "Mexico":40,"Nepal":41,"Netherlands":42,"New Zealand":43,"Nicaragua":44,
    "Niger":45,"Oman":46,"Pakistan":47,"Philippines":48,"Portugal":49,
    "Romania":50,"Russia":51,"Saudi Arabia":52,"Serbia":53,"Sierra Leone":54,
    "South Africa":55,"Spain":56,"Sri Lanka":57,"Sweden":58,"Tonga":59,
    "Turkey":60,"Ukraine":61,"United Arab Emirates":62,"United Kingdom":63,
    "United States":64,"Uruguay":65,"Viet Nam":66,
  },
  used_app_before: { "no":0, "yes":1 },
  age_desc:        { "18 and more":0 },  // only value in entire dataset
  relation: {
    "?":0, "Health care professional":1, "Others":2,
    "Parent":3, "Relative":4, "Self":5,
  },
};
 
const INITIAL = {
  A1:0, A2:0, A3:0, A4:0, A5:0, A6:0, A7:0, A8:0, A9:0, A10:0,
  age: "",
  gender: "m",
  ethnicity: "White-European",
  jundice: "no",
  austim: "no",
  contry_of_res: "United States",
  used_app_before: "no",
  relation: "Self",
};
 
export default function MLPredictPage({ goTo, onResult }) {
  const [form, setForm]             = useState(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState(null);
 
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
 
  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
 
    // AQ raw sum = result column in dataset
    const aqSum = ["A1","A2","A3","A4","A5","A6","A7","A8","A9","A10"]
      .reduce((acc, k) => acc + Number(form[k]), 0);
 
    // Feature vector — must match training column order EXACTLY:
    // A1_Score, A2_Score, ..., A10_Score,
    // age, gender, ethnicity, jundice, austim,
    // contry_of_res, used_app_before, result, age_desc, relation
    const features = [
      Number(form.A1), Number(form.A2), Number(form.A3), Number(form.A4),
      Number(form.A5), Number(form.A6), Number(form.A7), Number(form.A8),
      Number(form.A9), Number(form.A10),
      Number(form.age),
      ENCODE.gender[form.gender]           ?? 0,
      ENCODE.ethnicity[form.ethnicity]     ?? 0,
      ENCODE.jundice[form.jundice]         ?? 0,
      ENCODE.austim[form.austim]           ?? 0,
      ENCODE.contry_of_res[form.contry_of_res] ?? 0,
      ENCODE.used_app_before[form.used_app_before] ?? 0,
      aqSum,
      ENCODE.age_desc["18 and more"],      // always 0
      ENCODE.relation[form.relation]       ?? 0,
    ];
 
    try {
      const res = await fetch(`${API}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Prediction failed");
      onResult(data);
    } catch (e) {
      setError(e.message);
      setSubmitting(false);
    }
  };
 
  const aqScore = ["A1","A2","A3","A4","A5","A6","A7","A8","A9","A10"]
    .reduce((acc, k) => acc + Number(form[k]), 0);
 
  const isValid = form.age && Number(form.age) >= 18;
 
  return (
    <div className="mlpage">
      <nav className="navbar">
        <div className="navbar__brand"><span className="navbar__brand-dot" />SpectrumSense</div>
        <button className="navbar__back" onClick={() => goTo("landing")}>← Back</button>
      </nav>
 
      <div className="container mlpage__body">
        <div className="mlpage__header animate-in">
          <h1>ML Model Prediction</h1>
          <p className="text-secondary mt-8">
            Enter the screening responses and demographic information below.
            The random forest model will return a probability estimate.
          </p>
        </div>
 
        <div className="mlpage__layout">
          {/* AQ-10 Scores */}
          <section className="card card--elevated animate-in animate-in--delay-1">
            <div className="card__body">
              <div className="mlpage__section-head">
                <h3>AQ-10 Responses</h3>
                <span className="badge badge--info">Score: {aqScore} / 10</span>
              </div>
              <p className="text-secondary mt-4" style={{ fontSize:"0.875rem" }}>
                Select 1 if the response is autism-indicative for that question, 0 if not.
              </p>
              <div className="mlpage__aq-grid mt-16">
                {AQ_QUESTIONS.map((q, i) => {
                  const key = `A${i + 1}`;
                  return (
                    <div className="mlpage__aq-item" key={key}>
                      <div className="mlpage__aq-label">
                        <span className="mlpage__aq-num">A{i + 1}</span>
                        <span>{q}</span>
                      </div>
                      <div className="mlpage__aq-toggle">
                        {[0, 1].map((v) => (
                          <button
                            key={v}
                            className={`mlpage__toggle-btn ${Number(form[key]) === v ? "active" : ""}`}
                            onClick={() => set(key, v)}
                          >
                            {v === 1 ? "Yes (1)" : "No (0)"}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
 
          {/* Demographics */}
          <section className="card card--elevated animate-in animate-in--delay-2">
            <div className="card__body">
              <h3 className="mlpage__section-head">Demographics</h3>
              <div className="mlpage__demo-grid mt-16">
                {DEMOGRAPHICS.map((f) => (
                  <div className="form-group" key={f.key}>
                    <label className="form-label">{f.label}</label>
                    {f.type === "number" ? (
                      <input
                        className="form-input"
                        type="number"
                        min={f.min}
                        max={f.max}
                        placeholder={f.placeholder}
                        value={form[f.key]}
                        onChange={(e) => set(f.key, e.target.value)}
                      />
                    ) : (
                      <select
                        className="form-select"
                        value={form[f.key]}
                        onChange={(e) => set(f.key, e.target.value)}
                      >
                        {f.options.map((o, idx) => (
                          <option key={o} value={o}>{f.labels[idx]}</option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
 
        {/* Submit */}
        <div className="mlpage__submit animate-in animate-in--delay-3">
          {!isValid && form.age !== "" && (
            <p className="text-warning" style={{ fontSize:"0.875rem" }}>
              ⚠ This dataset only covers adults (18+). Please enter a valid age.
            </p>
          )}
          {error && <p className="text-danger mt-8">{error}</p>}
          <button
            className="btn btn--primary btn--lg"
            onClick={handleSubmit}
            disabled={!isValid || submitting}
          >
            {submitting ? "Running model…" : "Run prediction →"}
          </button>
          <p className="text-muted mt-12" style={{ fontSize:"0.8rem" }}>
            Results are not a clinical diagnosis. Consult a professional for a formal evaluation.
          </p>
        </div>
      </div>
    </div>
  );
}