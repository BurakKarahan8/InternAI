// LoginPage.js (Kullanıcı)
import React, { useState } from "react";
import "./LoginPage.css"; // Ortak CSS
import { Link, useNavigate } from "react-router-dom";
// react-icons yerine @expo/vector-icons benzeri bir kütüphane veya SVG kullanmak daha tutarlı olabilir
// Şimdilik react-icons ile devam edelim, mobilde Ionicons kullanmıştık.
import { FaUserAlt, FaLock } from "react-icons/fa"; // react-icons
// VEYA Material UI ikonları (HeaderBar'da kullanılmış)
// import EmailIcon from '@mui/icons-material/Email';
// import LockIcon from '@mui/icons-material/Lock';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Yükleme durumu
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        // alert("Giriş başarılı. Hoş geldiniz, " + `${data.fullName}` + "!"); // Otomatik yönlendirme
        navigate("/main", { state: { userdata: data } });
      } else {
        alert(`Giriş Hatası: ${data.message || data || "Bilgilerinizi kontrol edin."}`);
      }
    } catch (error) {
      alert("Sunucu Hatası: Bağlantı kurulamadı veya beklenmedik bir sorun oluştu.");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-logoText-wrapper"> {/* Wrapper eklendi */}
        <div className="login-logoText">
          <span className="login-internText">Intern</span>
          <span className="login-aiText">AI</span>
        </div>
        <p className="login-tagline">Staj aramanın akıllı yolu</p> {/* Tagline eklendi */}
      </div>
      <div className="login-box">
        <h2 className="login-title">Öğrenci Girişi</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            {/* <EmailIcon className="input-icon" /> veya FaEnvelope */}
            <FaUserAlt className="input-icon" />
            <input
              type="email"
              className="login-input"
              placeholder="E-posta adresiniz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              className="login-input"
              placeholder="Şifreniz"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
          <div className="login-footer"> {/* footer için div */}
            Hesabınız yok mu?
            <Link to="/signup" className="signup-link">
              Kaydol
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default LoginPage;