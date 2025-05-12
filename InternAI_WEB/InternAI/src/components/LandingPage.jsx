import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="logoText">
        <div className="internText">Intern</div>
        <div className="aiText">AI</div>
      </div>

      <div className="landing-content">
        <h1 className="landing-title">Hoş Geldiniz!</h1>
        <p className="landing-description">Giriş yapmak için aşağıdaki seçeneklerden birini seçin.</p>

        <div className="button-container">
          <Link to="/login" className="landing-button">Kullanıcı Girişi</Link>
          <Link to="/company-login" className="landing-button company-button">Şirket Girişi</Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
