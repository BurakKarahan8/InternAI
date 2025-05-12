import React, { useEffect, useState } from "react";
import { useLocation , useNavigate } from "react-router-dom";
import axios from "axios";
import HeaderBar from "../components/HeaderBar"; // HeaderBar'ı import ediyoruz
import "./UserProfilePage.css";

const UserProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // React Router'dan yönlendirme için
  const userData = location.state?.userdata || null;
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setLoading(true);
        // Backend'deki endpoint'i çağırıyoruz
        const response = await axios.get(`http://localhost:8080/internai/api/github-languages/BurakKarahan8`);
        setLanguages(response.data); // Dil ismi ve yüzde bilgisi
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("Veriler çekilemedi");
        console.error("Veriler çekilemedi:", error);
      }
    };

    if (userData) {
      fetchLanguages();
    }
  }, [userData]);

  const handleEditProfile = () => {
    navigate("/user-settings", { state: { userdata: userData } });
  };

  return (
    <div className="user-profile-page">
      {/* HeaderBar'ı burada ekliyoruz */}
      <HeaderBar userData={userData} userProfilePage={true} />

      <div className="user-profile-card">
        {/* Sol Taraf */}
        <div className="user-profile-left">
          <img
            src={userData.profilePicture
              ? `data:image/jpeg;base64,${userData.profilePicture}`
              : "https://i.pravatar.cc/150"}
            alt="Profil"
            className="user-profile-avatar"
          />
          <h2 className="user-profile-username">{userData.fullName}</h2>
          <p className="user-profile-info">{userData.role || 'Stajyer'}</p>
          <p className="user-profile-info">E-posta: {userData.email}</p>
          <p className="user-profile-info">Lokasyon: {userData.location || 'Türkiye'}</p>
          <button className="user-profile-settings-button" onClick={handleEditProfile}>Profili Düzenle</button>
        </div>

        {/* Sağ Taraf */}
        <div className="user-profile-right">
          <h3 className="user-profile-section-title">Kullandığı Diller</h3>
          {loading ? (
            <p>Yükleniyor...</p>
          ) : error ? (
            <p>{error}</p>
          ) : languages.length > 0 ? (
            <div className="user-profile-languages-bars">
              {languages.map((lang, index) => (
                <div key={index} className="user-profile-language-bar">
                  <div className="user-profile-language-label">
                    {lang.name} - {lang.percentage.toFixed(2)}%
                  </div>
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${lang.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Henüz dil bilgisi yok.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
