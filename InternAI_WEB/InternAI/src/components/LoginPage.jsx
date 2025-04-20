import React, { useState } from "react";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";

const LoginPage = () => {
  const [email, setEmail] = useState(""); // Kullanıcıdan alınan email
  const [password, setPassword] = useState(""); // Kullanıcıdan alınan şifre

  const navigate = useNavigate(); // React Router'dan yönlendirme için

  const handleLogin = async (e) => {
    e.preventDefault(); // Formun varsayılan davranışını engelle
    if (!email || !password) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.text();

      if (response.ok) {
        // Giriş başarılı
        alert("Giriş başarılı. Hoş geldiniz, " + `${data}` +"!");

        navigate("/main", {state: {userdata: data}}); // Giriş başarılı olduğunda yönlendirme yap
      } else {
        // Giriş başarısız
        alert(`Hata: ${data}`);
      }
    } catch (error) {
      alert("Hata: Bir hata oluştu. Lütfen tekrar deneyin.");
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Giriş Yap</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="email"
              className="login-input"
              placeholder="Emailinizi girin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              className="login-input"
              placeholder="Şifrenizi girin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="login-button">
            Giriş Yap
          </button>
          <p className="login-footer">
            Hesabınız yok mu?{" "}
            <Link to="/signup" className="signup-link">
              Kaydol
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
