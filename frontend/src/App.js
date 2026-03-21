import React, { useState } from "react";
import "./App.css";
import LandingPage         from "./pages/LandingPage";
import QuestionnairePage   from "./pages/QuestionnairePage";
import AQResultsPage       from "./pages/AQResultsPage";
import ClinicalPage        from "./pages/ClinicalPage";
import ClinicalResultsPage from "./pages/ClinicalResultsPage";
import AboutPage           from "./pages/AboutPage";
import ContactPage         from "./pages/ContactPage";
import LoginPage           from "./pages/LoginPage";

function App() {
  const [page, setPage]                   = useState("landing");
  const [aqResults, setAqResults]         = useState(null);
  const [clinicalResults, setClinicalResults] = useState(null);

  const goTo = (p) => { setPage(p); window.scrollTo(0, 0); };

  // Flow 1 — AQ-10 preliminary screen
  const handleAQResult = (data) => {
    setAqResults(data);
    setPage("aq-results");
  };

  // Flow 2 — DSM-5 clinical assessment
  const handleClinicalResult = (data) => {
    setClinicalResults(data);
    setPage("clinical-results");
  };

  return (
    <div className="App">
      {page === "landing"          && <LandingPage          goTo={goTo} />}
      {page === "questionnaire"    && <QuestionnairePage    goTo={goTo} onResult={handleAQResult} />}
      {page === "aq-results"       && <AQResultsPage        goTo={goTo} results={aqResults} />}
      {page === "clinical"         && <ClinicalPage         goTo={goTo} onResult={handleClinicalResult} />}
      {page === "clinical-results" && <ClinicalResultsPage  goTo={goTo} results={clinicalResults} />}
      {page === "about"            && <AboutPage            goTo={goTo} />}
      {page === "contact"          && <ContactPage          goTo={goTo} />}
      {page === "login"            && <LoginPage            goTo={goTo} />}
    </div>
  );
}

export default App;