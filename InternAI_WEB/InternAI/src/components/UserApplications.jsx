// UserApplications.js
import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./UserApplications.css"; // Yeni CSS dosyasını import et
import HeaderBar from "./HeaderBar"; // veya ../components/HeaderBar
import { Oval } from 'react-loader-spinner';
import { FaBriefcase, FaCalendarAlt, FaFileAlt, FaHourglassHalf, FaCheckCircle, FaTimesCircle, FaFolderOpen, FaExclamationTriangle } from 'react-icons/fa';

const statusTurkishMap = {
    PENDING: { text: "Beklemede", icon: <FaHourglassHalf />, className: "app-status-PENDING" },
    APPROVED: { text: "Onaylandı", icon: <FaCheckCircle />, className: "app-status-APPROVED" },
    REJECTED: { text: "Reddedildi", icon: <FaTimesCircle />, className: "app-status-REJECTED" },
};

const UserApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Kullanılmıyor ama dursun
    const location = useLocation();
    const userData = location.state?.userdata || null;

    const fetchApplications = useCallback(async () => {
        if (!userData?.id) {
            setError("Kullanıcı bilgileri bulunamadı. Lütfen tekrar giriş yapın.");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:8080/api/applications/user/${userData.id}`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Başvurular alınamadı: ${errorText || response.status}`);
            }
            const data = await response.json();
            // Başvuruları tarihe göre en yeniden eskiye sırala
            const sortedData = data.sort((a,b) => new Date(b.applyDate) - new Date(a.applyDate));
            setApplications(sortedData);
        } catch (err) {
            setError(err.message);
            console.error("Başvuru çekme hatası:", err);
        } finally {
            setLoading(false);
        }
    }, [userData]); // userData değişirse fonksiyonu yeniden oluştur

    useEffect(() => {
        if (!userData) {
            alert("Kullanıcı bilgileri olmadan bu sayfaya erişilemez. Giriş sayfasına yönlendiriliyorsunuz.");
            navigate("/"); // Veya /login
            return;
        }
        fetchApplications();
    }, [userData, fetchApplications, navigate]);


    if (loading) {
        return (
            <div className="user-applications-page-wrapper">
                <HeaderBar userData={userData} />
                <div className="loading-message-apps">
                    <Oval height={60} width={60} color="#82E0AA" secondaryColor="rgba(130, 224, 170, 0.3)" strokeWidth={4} />
                    <p>Başvurularınız yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="user-applications-page-wrapper">
                <HeaderBar userData={userData} />
                <div className="error-message-apps">
                    <FaExclamationTriangle />
                    <p>Hata: {error}</p>
                    <button onClick={fetchApplications} style={{marginTop: '15px', padding: '8px 15px', background: '#82E0AA', border: 'none', borderRadius: '8px', color: '#1D2B4A', cursor: 'pointer'}}>Tekrar Dene</button>
                </div>
            </div>
        );
    }


    return (
        <div className="user-applications-page-wrapper">
            <HeaderBar userData={userData} />
            <div className="user-applications-container">
                <h2>Başvurularım ({applications.length})</h2>
                {applications.length === 0 ? (
                    <div className="no-applications-message-apps">
                        <FaFolderOpen />
                        <p>Henüz kayıtlı bir başvurunuz bulunmuyor.</p>
                    </div>
                ) : (
                    <div className="applications-list-grid">
                        {applications.map((app) => {
                            const statusInfo = statusTurkishMap[app.status] || { text: app.status, icon: null, className: '' };
                            return (
                                <div key={app.id} className="application-card">
                                    <h3 className="app-card-title">{app.jobTitle || 'İlan Başlığı Yok'}</h3>
                                    <p className="app-card-company">
                                        <FaBriefcase /> {app.companyName || 'Şirket Bilgisi Yok'}
                                    </p>
                                    <div className="app-card-info">
                                        <FaCalendarAlt />
                                        <strong>Başvuru Tarihi:</strong> 
                                        {new Date(app.applyDate).toLocaleDateString("tr-TR", {
                                            year: "numeric", month: "short", day: "numeric",
                                        })}
                                    </div>
                                    <div className="app-card-info">
                                        {statusInfo.icon} 
                                        <strong>Durum:</strong> 
                                        <span className={`app-status ${statusInfo.className}`}>
                                            {statusInfo.text}
                                        </span>
                                    </div>
                                    {app.coverLetter && (
                                        <div className="app-cover-letter">
                                            <p><strong><FaFileAlt /> Ön Yazı/Not:</strong> {app.coverLetter}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserApplications;