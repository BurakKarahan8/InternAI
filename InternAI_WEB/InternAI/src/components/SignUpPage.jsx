import React, { useState } from "react";
import "./SignUpPage.css";
import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";

const SignUpPage = () => {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
    });

    const handleInputChange = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        console.log("Kayıt Bilgileri:", form);
        // Kayıt işlemleri burada yapılabilir
    };

    return (
        <body>
            <div className="signup-container">
                <div className="signup-box">
                    <h2 className="signup-title">Kaydol</h2>
                    <form className="signup-form" onSubmit={handleSignUp}>
                        <div className="input-group">
                            <FaUser className="input-icon" />
                            <input
                                type="text"
                                className="signup-input"
                                placeholder="Ad Soyad"
                                value={form.fullName}
                                onChange={(e) => handleInputChange("fullName", e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <FaEnvelope className="input-icon" />
                            <input
                                type="email"
                                className="signup-input"
                                placeholder="Email"
                                value={form.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <FaPhone className="input-icon" />
                            <input
                                type="number"
                                className="signup-input"
                                placeholder="Telefon Numarası"
                                value={form.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <FaLock className="input-icon" />
                            <input
                                type="password"
                                className="signup-input"
                                placeholder="Şifre"
                                value={form.password}
                                onChange={(e) => handleInputChange("password", e.target.value)}
                            />
                        </div>
                        <button type="submit" className="signup-button">Kaydol</button>
                        <p className="signup-footer">
                            Zaten bir hesabınız var mı?{" "}
                            <Link to="/" className="login-link">
                                Giriş Yap
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </body>
    );
};

export default SignUpPage;