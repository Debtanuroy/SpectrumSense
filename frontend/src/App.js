import React, { useState } from "react";
import "./App.css";
import LandingPage         from "./pages/LandingPage";
import QuestionnairePage   from "./pages/QuestionnairePage";
import AQResultsPage       from "./pages/AQResultsPage";
import ClinicalPage        from "./pages/ClinicalPage";
import ClinicalResultsPage from "./pages/ClinicalResultsPage";
import VoicePage           from "./pages/VoicePage";
import VoiceResultsPage    from "./pages/VoiceResultsPage";
import SuggestionsPage     from "./pages/SuggestionsPage";
import AboutPage           from "./pages/AboutPage";
import ContactPage         from "./pages/ContactPage";
import LoginPage           from "./pages/LoginPage";

function App() {
  const [page, setPage]                       = useState("landing");
  const [aqResults, setAqResults]             = useState(null);
  const [clinicalResults, setClinicalResults] = useState(null);
  const [voiceResults, setVoiceResults]       = useState(null);
  const [suggestionMarker, setSuggestionMarker] = useState(null);

  const goTo = function(p) { setPage(p); window.scrollTo(0, 0); };

  const goToSuggestion = function(marker) {
    setSuggestionMarker(marker);
    setPage("suggestions");
    window.scrollTo(0, 0);
  };

  const handleAQResult       = function(data) { setAqResults(data);       setPage("aq-results");       };
  const handleClinicalResult = function(data) { setClinicalResults(data); setPage("clinical-results"); };
  const handleVoiceResult    = function(data) { setVoiceResults(data);    setPage("voice-results");    };

  return (
    <div className="App">
      {page === "landing"          && <LandingPage          goTo={goTo} />}
      {page === "questionnaire"    && <QuestionnairePage    goTo={goTo} onResult={handleAQResult} />}
      {page === "aq-results"       && <AQResultsPage        goTo={goTo} results={aqResults} goToSuggestion={goToSuggestion} />}
      {page === "clinical"         && <ClinicalPage         goTo={goTo} onResult={handleClinicalResult} />}
      {page === "clinical-results" && <ClinicalResultsPage  goTo={goTo} results={clinicalResults} goToSuggestion={goToSuggestion} />}
      {page === "voice"            && <VoicePage            goTo={goTo} onResult={handleVoiceResult} />}
      {page === "voice-results"    && <VoiceResultsPage     goTo={goTo} results={voiceResults} goToSuggestion={goToSuggestion} />}
      {page === "suggestions"      && <SuggestionsPage      goTo={goTo} focusMarker={suggestionMarker} />}
      {page === "about"            && <AboutPage            goTo={goTo} />}
      {page === "contact"          && <ContactPage          goTo={goTo} />}
      {page === "login"            && <LoginPage            goTo={goTo} />}
    </div>
  );
}

export default App;