import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import './CvAnalysis.css'; 
import { FaUpload, FaSearch, FaCheckCircle, FaTimes, FaCodeBranch, FaBook, FaCode, FaFilePdf, FaUserCircle, FaSpinner } from 'react-icons/fa';
import HeaderBar from '../components/HeaderBar'; 
import { Oval } from 'react-loader-spinner';

const API_BASE_URL = 'http://localhost:8080'; 

const CvAnalysis = ({ userData: propUserData }) => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Kullanıcı verisini Kullanıcı Ayarları sayfasındaki gibi alma
    const navigatedUserData = location.state?.userdata;
    const finalUserData = propUserData || navigatedUserData;

    const [cvFile, setCvFile] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!finalUserData && !propUserData) {
            console.warn("Kullanıcı verisi eksik.");
            // navigate("/"); // Kullanıcı Ayarları sayfasındaki gibi yönlendirme
        }
    }, [finalUserData, propUserData, navigate]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
            setCvFile(file);
            setAnalysisResult(null); 
        } else {
            alert('Lütfen sadece PDF dosyası yükleyin.');
            setCvFile(null);
        }
    };

    const analyzeCv = async () => {
        if (!cvFile) {
            alert('Lütfen önce bir CV yükleyin.');
            return;
        }

        setLoading(true);
        setAnalysisResult(null);

        const formData = new FormData();
        formData.append('file', cvFile);

        try {
            const response = await fetch(`${API_BASE_URL}/api/cv/analyze`, {
                method: 'POST',
                body: formData,
            });

            const responseText = await response.text();
            
            if (!response.ok) {
                let errorMessage = `Analiz başarısız: ${response.status}`;
                try {
                    const errorData = JSON.parse(responseText);
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    errorMessage = responseText || errorMessage;
                }
                throw new Error(errorMessage);
            }

            const data = JSON.parse(responseText);
            setAnalysisResult(data);
            
        } catch (error) {
            console.error("Analiz hatası:", error);
            alert(`CV analizi sırasında bir sorun oluştu: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const renderResults = () => {
        if (!analysisResult) return null;
        
        const { 
            extractedSkills = [], 
            extractedProjects = [],
            githubLanguages = [], 
            compatibilityScore, 
            compatibilityMessage 
        } = analysisResult;
        
        return (
            <div className="form-section results-section"> 
                <h3 className="form-section-title result-title"><FaCheckCircle /> Analiz Sonuçları</h3>
                
                {/* Uyum Skoru */}
                <div className="result-group score-group">
                    <p className="result-label">CV & GitHub Uyum Skoru:</p>
                    <div className="score-display">
                        <span className="score-value">{compatibilityScore.toFixed()}%</span>
                        <p className="score-message">{compatibilityMessage}</p>
                    </div>
                </div>

                {/* Tüm Beceriler */}
                <div className="result-group">
                    <p className="result-label"><FaBook /> CV'de Tespit Edilen Beceriler:</p>
                    <div className="tag-container">
                        {extractedSkills.length > 0 ? (
                            extractedSkills.map((skill, index) => (
                                <span key={index} className="result-tag">
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <p className="no-data-message">Tespit edilen beceri yok.</p>
                        )}
                    </div>
                </div>

                {/* Projeler */}
                <div className="result-group">
                    <p className="result-label"><FaCodeBranch /> Projeler ve Deneyimler:</p>
                    <div className="tag-container">
                        {extractedProjects.length > 0 ? (
                            extractedProjects.map((project, index) => (
                                <span key={index} className="result-tag project-tag">
                                    {project}
                                </span>
                            ))
                        ) : (
                            <p className="no-data-message">Tespit edilen proje yok.</p>
                        )}
                    </div>
                </div>

                {/* GitHub Dil Dağılımı */}
                <div className="result-group last-result-group">
                    <p className="result-label"><FaCode /> GitHub Dil Dağılımı:</p>
                    {githubLanguages.length > 0 ? (
                        githubLanguages.sort((a, b) => b.percentage - a.percentage).map((lang, index) => (
                            <div key={index} className="language-progress-item">
                                <span className="lang-name">{lang.name}</span>
                                <div className="progress-bar-bg">
                                    <div 
                                        className="progress-bar-fill" 
                                        style={{ width: `${lang.percentage}%` }} 
                                    />
                                </div>
                                <span className="lang-percentage">{lang.percentage.toFixed(1)}%</span>
                            </div>
                        ))
                    ) : (
                        <p className="no-data-message">GitHub verisi bulunamadı. Profil ayarlarınızı kontrol edin.</p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="analysis-page-wrapper user-settings-page-wrapper">
            <HeaderBar userData={finalUserData} /> 
            <div className="analysis-container user-settings-container">
                <h2>CV Analizi 🎯</h2>

                <div className="user-settings-form"> 
                    
                    {/* CV Yükleme Bölümü */}
                    <div className="form-section upload-section">
                        <h3 className="form-section-title"><FaFilePdf /> CV Yükleme</h3>
                        
                        <div className="upload-box">
                            
                            <label className="file-input-label" htmlFor="cvUpload">
                                <FaUpload /> {cvFile ? "CV'yi Değiştir" : "PDF CV Yüklemek İçin Tıklayın"}
                            </label>

                            <input 
                                id="cvUpload"
                                type="file" 
                                accept="application/pdf" 
                                onChange={handleFileChange} 
                                style={{ display: 'none' }} 
                                disabled={loading}
                            />
                            
                            {cvFile ? (
                                <div className="uploaded-file-info">
                                    <span className="file-name-text">
                                        <FaFilePdf className="file-icon" /> {cvFile.name}
                                    </span>
                                    <button 
                                        onClick={() => { setCvFile(null); setAnalysisResult(null); }} 
                                        className="remove-file-button"
                                        type="button"
                                        title="Dosyayı Kaldır"
                                        disabled={loading}
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            ) : (
                                <p className="no-data-message">Sadece **PDF** formatı desteklenmektedir.</p>
                            )}

                        </div>

                        <button
                            className={`user-settings-button analyze-button`}
                            onClick={analyzeCv}
                            disabled={!cvFile || loading}
                            type="button"
                        >
                            {loading ? (
                                <>
                                    <Oval height={20} width={20} color="#1D2B4A" strokeWidth={5}/> Analiz Ediliyor...
                                </>
                            ) : (
                                <><FaSearch /> CV ve GitHub Uyumluluğunu Analiz Et</>
                            )}
                        </button>
                    </div>

                    {/* Sonuçları Göster */}
                    {analysisResult && renderResults()}
                    
                    {/* Loading/Başlangıç Mesajı */}
                    {!analysisResult && !loading && (
                         <div className="form-section empty-result-section">
                            <h3 className="form-section-title empty-title">
                                <FaUserCircle /> Başlangıç
                            </h3>
                            <p className="no-data-message" style={{textAlign: 'center', margin: '20px 0'}}>
                                Lütfen bir CV dosyası yükleyin ve analiz butonuna basarak sonuçları görüntüleyin.
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default CvAnalysis;