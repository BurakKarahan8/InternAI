import React, { useState } from "react";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import { FaBuilding, FaEnvelope, FaPhone, FaLock, FaMapMarkerAlt, FaUser } from "react-icons/fa";

const CompanySignupPage = () => {
  const [companyName, setCompanyName] = useState("");
  const [companyUsername, setCompanyUsername] = useState(""); // Yeni eklenen kullanıcı adı
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyPassword, setCompanyPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!companyName || !companyUsername || !companyEmail || !companyPhone || !companyAddress || !companyPassword) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/companies/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName,
          companyUsername,
          companyEmail,
          companyPhone,
          companyAddress,
          companyPassword,
        }),
      });

      if (response.ok) {
        alert("Kayıt başarılı! Lütfen e-posta adresinizi doğrulayın.");
        navigate("/login");
      } else {
        const data = await response.json();
        alert(`Hata: ${data.message || "Bir hata oluştu."}`);
      }
    } catch (error) {
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
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
        <h2 className="login-title">Şirket Kaydı</h2>
        <form onSubmit={handleSignup}>
          <div className="input-group">
            <FaBuilding className="input-icon" />
            <input
              type="text"
              className="login-input"
              placeholder="Şirket Adı"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              className="login-input"
              placeholder="Kullanıcı Adı"
              value={companyUsername}
              onChange={(e) => setCompanyUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              className="login-input"
              placeholder="E-posta"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <FaPhone className="input-icon" />
            <input
              type="text"
              className="login-input"
              placeholder="Telefon"
              value={companyPhone}
              onChange={(e) => setCompanyPhone(e.target.value)}
            />
          </div>
          <div className="input-group">
            <FaMapMarkerAlt className="input-icon" />
            <input
              type="text"
              className="login-input"
              placeholder="Adres"
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
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
            Kaydol
          </button>
          <p className="login-footer">
            Zaten hesabınız var mı?{" "}
            <Link to="/company-login" className="signup-link">
              Giriş Yap
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default CompanySignupPage;
