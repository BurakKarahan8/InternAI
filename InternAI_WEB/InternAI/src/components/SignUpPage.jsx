// SignUpPage.js (Kullanıcı)
import React, { useState } from "react";
import "./SignUpPage.css"; // Ortak CSS
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaGithub } from "react-icons/fa"; // FaUserEdit yerine FaGithub
// import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'; // Kullanıcı adı için

const SignUpPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !username || !password || !githubUsername) { // GitHub zorunlu varsayıyoruz
      alert("Lütfen tüm alanları doldurun.");
      return;
    }
    if (password.length < 6) {
        alert("Şifre en az 6 karakter olmalıdır.");
        return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, username, password, githubUsername }),
      });
      const data = await response.text(); // Backend string dönebilir
      if (response.ok) {
        alert("Kayıt Başarılı! Mail adresinize gelen doğrulama linkine tıklayarak hesabınızı doğrulayın.");
        navigate("/login"); // Veya /login sayfasına
      } else {
        alert(`Kayıt Hatası: ${data || "Bilgilerinizi kontrol edin."}`);
      }
    } catch (error) {
      alert("Sunucu Hatası: Bağlantı kurulamadı veya beklenmedik bir sorun oluştu.");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="signup-container">
      <div className="signup-logoText-wrapper">
        <div className="signup-logoText">
          <span className="signup-internText">Intern</span>
          <span className="signup-aiText">AI</span>
        </div>
        <p className="signup-tagline">Kariyerine ilk adımı at!</p>
      </div>
      <div className="signup-box">
        <h2 className="signup-title">Öğrenci Kayıt</h2>
        <form className="signup-form" onSubmit={handleSignUp}>
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text" className="signup-input" placeholder="Ad Soyad*"
              value={fullName} onChange={(e) => setFullName(e.target.value)} required
            />
          </div>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email" className="signup-input" placeholder="E-posta Adresi*"
              value={email} onChange={(e) => setEmail(e.target.value)} required
            />
          </div>
          <div className="input-group">
            {/* <AlternateEmailIcon className="input-icon" /> */}
            <FaUser className="input-icon" /> {/* Kullanıcı adı için de aynı ikon */}
            <input
              type="text" className="signup-input" placeholder="Kullanıcı Adı*"
              value={username} onChange={(e) => setUsername(e.target.value)} required
            />
          </div>
          <div className="input-group">
            <FaGithub className="input-icon" /> {/* GitHub ikonu */}
            <input
              type="text" className="signup-input" placeholder="GitHub Kullanıcı Adı*"
              value={githubUsername} onChange={(e) => setGithubUsername(e.target.value)} required
            />
          </div>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password" className="signup-input" placeholder="Şifre (en az 6 karakter)*"
              value={password} onChange={(e) => setPassword(e.target.value)} required
            />
          </div>
          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? "Kaydolunuyor..." : "Kaydol"}
          </button>
          <div className="signup-footer">
            Zaten bir hesabınız var mı?
            <Link to="/" className="login-link">
              Giriş Yap
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SignUpPage;