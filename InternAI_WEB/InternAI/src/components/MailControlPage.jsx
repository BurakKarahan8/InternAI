import React from "react";
import "./MailControlPage.css";

const MailControlPage = () => {

    return (
        <div className="mail-control-container">
            <div className="logo-container">
                <p className="logo-text">
                    <span className="internText">Intern</span>
                    <span className="aiText">AI</span>
                </p>
                <p className="tagline">Staj aramanın akıllı yolu</p>
            </div>
            <div className="mail-control-box">
                <h2 className="mail-control-title"></h2>
                <form>
                    <div className="input-group">
                        <input
                            type="text"
                            className="mail-control-input"
                            placeholder="Mail adresinize gelen 6 haneli kodu girin"
                        />
                    </div>
                    <button type="submit" className="mail-control-button">
                        Gönder
                    </button>
                    <p className="mail-control-footer">
                        Hesabınız yok mu?{" "}
                        <a href="/signup" className="signup-link">
                            Kaydol
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default MailControlPage;
