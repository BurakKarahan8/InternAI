// LandingPage.js
import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css"; // Güncellenmiş CSS'i import et

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="landing-logoText"> {/* CSS'de tanımlanan stil */}
        <span className="landing-internText">Intern</span> {/* CSS'de tanımlanan stil */}
        <span className="landing-aiText">AI</span> {/* CSS'de tanımlanan stil */}
      </div>

      <div className="landing-content">
        <h1 className="landing-title">InternAI'ye Hoş Geldiniz!</h1>
        <p className="landing-description">
          Kariyerinize bir adım önde başlayın. Sizin için en uygun stajları bulun veya şirketinize en iyi yetenekleri kazandırın.
        </p>

        <div className="button-container">
          <Link to="/login" className="landing-button student-button"> {/* CSS'de tanımlanan stil */}
            Öğrenci Girişi
          </Link>
          <Link to="/company-login" className="landing-button company-button"> {/* CSS'de tanımlanan stil */}
            Şirket Girişi
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;