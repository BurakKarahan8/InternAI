// CompanySignupPage.js
import React, { useState } from "react";
import "./SignUpPage.css"; // Ortak SignUpPage.css kullanılıyor varsayımıyla
import { Link, useNavigate } from "react-router-dom";
import { FaBuilding, FaEnvelope, FaPhone, FaLock, FaMapMarkerAlt, FaUser } from "react-icons/fa";

const CompanySignupPage = () => {
  const [companyName, setCompanyName] = useState("");
  const [companyUsername, setCompanyUsername] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyPassword, setCompanyPassword] = useState("");
  const [loading, setLoading] = useState(false); // Yükleme state'i eklendi
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!companyName || !companyUsername || !companyEmail || !companyPhone || !companyAddress || !companyPassword) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }
    if (companyPassword.length < 6) { // Şifre uzunluk kontrolü
      alert("Şifre en az 6 karakter olmalıdır.");
      return;
    }
    setLoading(true); // Yüklemeyi başlat
    try {
      const response = await fetch("http://localhost:8080/api/companies/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName, companyUsername, companyEmail, companyPhone, companyAddress, companyPassword,
        }),
      });
      if (response.ok) {
        alert("Kayıt başarılı! Giriş yapabilirsiniz."); // E-posta doğrulama adımı varsa mesaj güncellenmeli
        navigate("/company-login");
      } else {
        const data = await response.json(); // Hata mesajını JSON olarak almayı dene
        alert(`Kayıt Hatası: ${data.message || "Bir hata oluştu."}`);
      }
    } catch (error) {
      alert("Sunucu Hatası: Bağlantı kurulamadı veya beklenmedik bir sorun oluştu.");
      console.error(error);
    }
    setLoading(false); // Yüklemeyi bitir
  };

  return (
    // .login-container yerine .signup-container kullandık, CSS dosyasında bu sınıf için de logo stilleri olmalı
    <div className="signup-container"> {/* Eğer SignUpPage.css kullanıyorsak bu sınıf adı doğru */}
      {/* YENİ: Kullanıcı SignUpPage'deki gibi sarmalayıcı eklendi */}
      <div className="signup-logoText-wrapper">
        <div className="signup-logoText"> {/* SignUpPage.css'deki sınıflar */}
          <span className="signup-internText">Intern</span>
          <span className="signup-aiText">AI</span>
        </div>
        <p className="signup-tagline">Şirketinizi geleceğin yetenekleriyle buluşturun</p>
      </div>

      <div className="signup-box"> {/* SignUpPage.css'deki sınıf */}
        <h2 className="signup-title">Şirket Kaydı</h2>
        <form onSubmit={handleSignup}>
          <div className="input-group">
            <FaBuilding className="input-icon" />
            <input type="text" className="signup-input" placeholder="Şirket Adı*" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
          </div>
          <div className="input-group">
            <FaUser className="input-icon" />
            <input type="text" className="signup-input" placeholder="Şirket Kullanıcı Adı*" value={companyUsername} onChange={(e) => setCompanyUsername(e.target.value)} required />
          </div>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input type="email" className="signup-input" placeholder="E-posta*" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <FaPhone className="input-icon" />
            <input type="tel" className="signup-input" placeholder="Telefon*" value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} required />
          </div>
          <div className="input-group">
            <FaMapMarkerAlt className="input-icon" />
            <input type="text" className="signup-input" placeholder="Adres*" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} required />
          </div>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input type="password" className="signup-input" placeholder="Şifre (en az 6 karakter)*" value={companyPassword} onChange={(e) => setCompanyPassword(e.target.value)} required />
          </div>
          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? "Kaydolunuyor..." : "Kaydol"}
          </button>
          <div className="signup-footer"> {/* signup-footer div içine alındı */}
            Zaten hesabınız var mı?{" "}
            <Link to="/company-login" className="login-link"> {/* login-link sınıfı kullanılabilir */}
              Giriş Yap
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanySignupPage;