import React from "react";
import { useState, useEffect } from "react";
import "./LoginPage.css";
import { Link } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";

const LoginPage = () => {

  const [message, setMessage] = useState('');

  useEffect(() => {
    // Backend API'ye GET isteği gönderiyoruz
    fetch('http://localhost:8080/internai/api/test')
      .then(response => response.text())
      .then(data => setMessage(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <body>
      <div className="App">
        <h1>{message ? message : 'Loading...'}</h1>
      </div>
      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">Giriş Yap</h2>
          <form className="login-form">
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                type="email"
                className="login-input"
                placeholder="Emailinizi girin"
              />
            </div>
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                className="login-input"
                placeholder="Şifrenizi girin"
              />
            </div>
            <button type="submit" className="login-button">Giriş Yap</button>
            <p className="login-footer">
              Hesabınız yok mu? <Link to="/signup" className="signup-link">Kaydol</Link>
            </p>
          </form>
        </div>
      </div>
    </body>


  );
};

export default LoginPage;
