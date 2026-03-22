import React, { useState } from "react";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "Home",        page: "landing"     },
  { label: "About Us",    page: "about"       },
  { label: "Suggestions", page: "suggestions" },
  { label: "Contact Us",  page: "contact"     },
];

export default function Navbar({ currentPage, goTo }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (page) => {
    goTo(page);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar__brand" onClick={() => navigate("landing")}>
        <span className="navbar__brand-dot" />
        SpectrumSense
      </div>

      <div className="navbar__links">
        {NAV_LINKS.map((l) => (
          <button
            key={l.page}
            className={"navbar__link " + (currentPage === l.page ? "navbar__link--active" : "")}
            onClick={() => navigate(l.page)}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="navbar__actions">
        <button
          className={"btn btn--outline btn--sm " + (currentPage === "login" ? "navbar__cta--active" : "")}
          onClick={() => navigate("login")}
        >
          Login
        </button>
      </div>

      <button
        className={"navbar__burger " + (menuOpen ? "open" : "")}
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        <span /><span /><span />
      </button>

      {menuOpen && (
        <div className="navbar__drawer">
          {NAV_LINKS.map((l) => (
            <button
              key={l.page}
              className={"navbar__drawer-link " + (currentPage === l.page ? "active" : "")}
              onClick={() => navigate(l.page)}
            >
              {l.label}
            </button>
          ))}
          <button
            className="btn btn--primary btn--sm"
            style={{ marginTop: 8 }}
            onClick={() => navigate("login")}
          >
            Login
          </button>
        </div>
      )}
    </nav>
  );
}