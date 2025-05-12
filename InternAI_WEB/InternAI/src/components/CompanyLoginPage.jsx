import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaBuilding, FaLock } from "react-icons/fa";
import "./LoginPage.css"; 

const CompanyLoginPage = () => {
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPassword, setCompanyPassword] = useState("");
  const navigate = useNavigate();

  const handleCompanyLogin = async (e) => {
    e.preventDefault();

    if (!companyEmail || !companyPassword) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/companies/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyEmail,
          companyPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Şirket girişi başarılı. Hoş geldiniz, " + `${data.companyName}` + "!");
        navigate("/company-dashboard", { state: { companyData: data } });
      } else {
        alert(`Hata: ${data}`);
      }
    } catch (error) {
      alert("Hata: Sunucuya ulaşılamıyor.");
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-logoText">
        <div className="login-internText">Intern</div>
        <div className="login-aiText">AI</div>
      </div>

      <div className="login-box">
        <h2 className="login-title">Şirket Girişi</h2>
        <form onSubmit={handleCompanyLogin}>
          <div className="input-group">
            <FaBuilding className="input-icon" />
            <input
              type="email"
              className="login-input"
              placeholder="Şirket Email"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              className="login-input"
              placeholder="Şifre"
              value={companyPassword}
              onChange={(e) => setCompanyPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="login-button">
            Giriş Yap
          </button>
          <p className="login-footer">
            Şirket hesabınız yok mu?{" "}
            <Link to="/company-signup" className="signup-link">
              Kayıt Ol
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default CompanyLoginPage;
