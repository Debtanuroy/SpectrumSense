import React, { useState } from "react";
import "./App.css";
import LandingPage       from "./pages/LandingPage";
import QuestionnairePage from "./pages/QuestionnairePage";
import MLPredictPage     from "./pages/MLPredictPage";
import ResultsPage       from "./pages/ResultsPage";
import AboutPage         from "./pages/AboutPage";
import ContactPage       from "./pages/ContactPage";
import LoginPage         from "./pages/LoginPage";

function App() {
  const [page, setPage]             = useState("landing");
  const [results, setResults]       = useState(null);
  const [resultType, setResultType] = useState(null);

  const goTo = (p) => { setPage(p); window.scrollTo(0, 0); };

  const handleQuestionnaireResult = (data) => {
    setResults(data);
    setResultType("questionnaire");
    setPage("results");
  };

  const handleMLResult = (data) => {
    setResults(data);
    setResultType("ml");
    setPage("results");
  };

  return (
    <div className="App">
      {page === "landing"       && <LandingPage goTo={goTo} />}
      {page === "questionnaire" && <QuestionnairePage goTo={goTo} onResult={handleQuestionnaireResult} />}
      {page === "ml"            && <MLPredictPage     goTo={goTo} onResult={handleMLResult} />}
      {page === "results"       && <ResultsPage       goTo={goTo} results={results} resultType={resultType} />}
      {page === "about"         && <AboutPage         goTo={goTo} />}
      {page === "contact"       && <ContactPage       goTo={goTo} />}
      {page === "login"         && <LoginPage         goTo={goTo} />}
    </div>
  );
}

export default App;