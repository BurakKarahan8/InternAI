import React, { useState } from "react";
import "./SignUpPage.css";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaUserEdit } from "react-icons/fa";

const SignUpPage = () => {

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate(); // React Router'dan yönlendirme için

    const handleSignUp = async (e) => {
        e.preventDefault(); // Formun varsayılan davranışını engelle
        if (!fullName || !email || !username || !password) {
            alert("Lütfen tüm alanları doldurun.");
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: fullName,
                    email: email,
                    username: username,
                    password: password,
                }),
            });

            const data = await response.text();

            if (response.ok) {
                alert("Başarılı: Kayıt başarılı!\nMail adresinize gelen doğrulama linkine tıklayın ve hesabınızı doğrulayın.");
                navigate("/");
            } else {
                // Kayıt başarısız
                alert(`Hata: ${data.message || "Kayıt başarısız."}`);
            }

        } catch (error) {
            alert("Hata: Bir hata oluştu. Lütfen tekrar deneyin.");
            console.error(error);
        }
    };

    return (
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
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <FaEnvelope className="input-icon" />
                        <input
                            type="email"
                            className="signup-input"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <FaUserEdit className="input-icon" />
                        <input
                            type="text"
                            className="signup-input"
                            placeholder="Kullanıcı Adı"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <FaLock className="input-icon" />
                        <input
                            type="password"
                            className="signup-input"
                            placeholder="Şifre"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="signup-button">
                        Kaydol
                    </button>
                    <p className="signup-footer">
                        Zaten bir hesabınız var mı?{" "}
                        <Link to="/" className="login-link">
                            Giriş Yap
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;