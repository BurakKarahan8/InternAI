// UserProfilePage.js
import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom"; // Link eklendi
import axios from "axios";
import HeaderBar from "../components/HeaderBar";
import "./UserProfilePage.css"; // Güncellenmiş CSS
import { FaEnvelope, FaGithub, FaUserCog, FaListAlt, FaCodeBranch, FaExclamationCircle } from 'react-icons/fa'; // İkonlar
import { Oval } from 'react-loader-spinner';

// Rastgele canlı renkler üretmek için bir yardımcı fonksiyon
const languageColors = {}; // Renkleri cache'lemek için
const getRandomColor = (languageName) => {
    if (languageColors[languageName]) {
        return languageColors[languageName];
    }
    const colors = ["#82E0AA", "#f0b500", "#4b6cb7", "#E74C3C", "#9B59B6", "#3498DB", "#1ABC9C", "#F39C12"];
    // Basit bir hash fonksiyonu ile dil adına göre bir renk seçelim
    let hash = 0;
    for (let i = 0; i < languageName.length; i++) {
        hash = languageName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = colors[Math.abs(hash) % colors.length];
    languageColors[languageName] = color;
    return color;
};


const UserProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = location.state?.userdata || null;

  const [languages, setLanguages] = useState([]);
  const [loadingLanguages, setLoadingLanguages] = useState(true);
  const [errorLanguages, setErrorLanguages] = useState(null);

  const fetchLanguages = useCallback(async () => {
    if (!userData?.githubUsername) {
        setLoadingLanguages(false);
        // setErrorLanguages("GitHub kullanıcı adı bulunamadı."); // Opsiyonel mesaj
        return;
    }
    setLoadingLanguages(true);
    setErrorLanguages(null);
    try {
      const response = await axios.get(`http://localhost:8080/internai/api/github-languages/${userData.githubUsername}`);
      // Yüzdeye göre büyükten küçüğe sırala
      const sortedLanguages = response.data.sort((a,b) => b.percentage - a.percentage);
      setLanguages(sortedLanguages);
    } catch (error) {
      setErrorLanguages("GitHub dil verileri çekilemedi.");
      console.error("GitHub dil verileri çekilemedi:", error);
    } finally {
      setLoadingLanguages(false);
    }
  }, [userData?.githubUsername]);


  useEffect(() => {
    if (!userData) {
        alert("Kullanıcı bilgileri olmadan bu sayfaya erişilemez. Giriş sayfasına yönlendiriliyorsunuz.");
        navigate("/"); // Veya /login
        return;
    }
    fetchLanguages();
  }, [userData, fetchLanguages, navigate]);


  if (!userData) { // userData yüklenene kadar veya yoksa
    return (
        <div className="user-profile-page-wrapper">
             <div style={{flexGrow:1, display:'flex', justifyContent:'center', alignItems:'center'}}>
                <Oval height={80} width={80} color="#82E0AA" secondaryColor="rgba(130, 224, 170, 0.3)" strokeWidth={3} />
            </div>
        </div>
    );
  }

  const profilePictureSrc = userData.profilePicture
        ? `data:image/jpeg;base64,${userData.profilePicture}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName || 'U')}&background=283958&color=E0E0E0&size=150`; // Varsayılan avatar


  return (
    <div className="user-profile-page-wrapper">
      <HeaderBar userData={userData} userProfilePage={true} /> {/* userProfilePage prop'u kontrol edilebilir */}

      <div className="user-profile-card">
        <div className="user-profile-left">
          <img
            src={profilePictureSrc}
            alt={`${userData.fullName || 'Kullanıcı'} Profil Fotoğrafı`}
            className="user-profile-avatar"
          />
          <h2 className="user-profile-fullName">{userData.fullName || 'Kullanıcı Adı Belirtilmemiş'}</h2>
          <p className="user-profile-username-display">@{userData.username || 'kullanici_adi'}</p>

          <p className="user-profile-info">
            <FaEnvelope />
            <strong>E-posta:</strong> {userData.email}
          </p>
          {userData.githubUsername && (
            <p className="user-profile-info">
                <FaGithub />
                <strong>GitHub:</strong> 
                <a href={`https://github.com/${userData.githubUsername}`} target="_blank" rel="noopener noreferrer" style={{color: '#82E0AA', textDecoration: 'none'}}>
                    {userData.githubUsername}
                </a>
            </p>
          )}
          {/* Diğer bilgiler eklenebilir (rol, lokasyon vb.) */}

          <div className="profile-buttons-container">
            <Link to="/user-settings" state={{ userdata: userData }} className="user-profile-action-button">
                <FaUserCog /> Profil Ayarları
            </Link>
            <Link to="/user-applications" state={{ userdata: userData }} className="user-profile-action-button user-profile-applications-button">
                <FaListAlt /> Başvurularım
            </Link>
          </div>
        </div>

        <div className="user-profile-right">
          <h3 className="user-profile-section-title"><FaCodeBranch /> GitHub Dil Kullanımı</h3>
          {loadingLanguages ? (
            <div className="loading-languages-msg">
                <Oval height={40} width={40} color="#82E0AA" strokeWidth={4}/> Yükleniyor...
            </div>
          ) : errorLanguages ? (
            <p className="error-languages-msg"><FaExclamationCircle style={{color: '#E74C3C'}}/> {errorLanguages}</p>
          ) : languages.length > 0 ? (
            <div className="user-profile-languages-bars">
              {languages.map((lang, index) => (
                <div key={index} className="user-profile-language-bar">
                  <div className="language-header">
                    <span className="user-profile-language-name">{lang.name}</span>
                    <span className="user-profile-language-percentage">{lang.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${lang.percentage}%`, backgroundColor: lang.color || getRandomColor(lang.name) }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-languages-msg">
                {userData.githubUsername ? 'Bu GitHub hesabında henüz dil verisi bulunamadı.' : 'GitHub kullanıcı adı belirtilmemiş.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;