// CompanyLoginPage.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaBuilding, FaLock } from "react-icons/fa";
import "./LoginPage.css"; // Ortak CSS kullanıyoruz

const CompanyLoginPage = () => {
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPassword, setCompanyPassword] = useState("");
  const [loading, setLoading] = useState(false); // Önceki kodda vardı, ekleyelim
  const navigate = useNavigate();

  const handleCompanyLogin = async (e) => {
    e.preventDefault();
    if (!companyEmail || !companyPassword) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }
    setLoading(true); // Yüklemeyi başlat
    try {
      const response = await fetch("http://localhost:8080/api/companies/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyEmail, companyPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        navigate("/company-dashboard", { state: { companyData: data } });
      } else {
        alert(`Giriş Hatası: ${data.message || data || "Bilgilerinizi kontrol edin."}`);
      }
    } catch (error) {
      alert("Sunucu Hatası: Bağlantı kurulamadı veya beklenmedik bir sorun oluştu.");
      console.error(error);
    }
    setLoading(false); // Yüklemeyi bitir
  };

  return (
    <div className="login-container">
      {/* YENİ: Kullanıcı LoginPage'deki gibi sarmalayıcı eklendi */}
      <div className="login-logoText-wrapper">
        <div className="login-logoText">
          <span className="login-internText">Intern</span>
          <span className="login-aiText">AI</span>
        </div>
        {/* Şirket için farklı bir tagline eklenebilir veya kaldırılabilir */}
        <p className="login-tagline">Şirketiniz için en iyi yetenekler burada</p>
      </div>

      <div className="login-box">
        <h2 className="login-title">Şirket Girişi</h2>
        <form onSubmit={handleCompanyLogin}>
          <div className="input-group">
            <FaBuilding className="input-icon" />
            <input
              type="email"
              className="login-input"
              placeholder="Şirket E-posta"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              required // required eklendi
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
              required // required eklendi
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
          <div className="login-footer"> {/* login-footer div içine alındı */}
            Şirket hesabınız yok mu?{" "}
            <Link to="/company-signup" className="signup-link">
              Kayıt Ol
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyLoginPage;