// JobPostDetail.js
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './JobPostDetail.css';
import HeaderBar from '../components/HeaderBar';
import { useLocation as useRouteLocation } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';
import { FaUserGraduate, FaEnvelope, FaHourglassHalf, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Durum ikonları eklendi

// --- YENİ: Durumları Türkçeye çevirmek için eşleme ---
const applicationStatusTurkishMap = {
    PENDING: { text: "Beklemede", icon: <FaHourglassHalf style={{ color: '#f0b500', marginRight: '5px' }} />, className: 'status-pending' },
    ACCEPTED: { text: "Kabul Edildi", icon: <FaCheckCircle style={{ color: '#82E0AA', marginRight: '5px' }} />, className: 'status-accepted' }, // APPROVED yerine ACCEPTED için
    REJECTED: { text: "Reddedildi", icon: <FaTimesCircle style={{ color: '#E74C3C', marginRight: '5px' }} />, className: 'status-rejected' },
    // Gerekirse diğer durumlar da eklenebilir
};
// --- BİTTİ: Durumları Türkçeye çevirmek için eşleme ---


const JobPostDetail = () => {
    const { id: jobId } = useParams();
    const navigate = useNavigate();
    const routeLocation = useRouteLocation();
    const companyData = routeLocation.state?.companyData || null;

    const [job, setJob] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [isLoadingJob, setIsLoadingJob] = useState(true);
    const [isLoadingApplicants, setIsLoadingApplicants] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchJobDetail = useCallback(async () => {
        // ... (mevcut fetchJobDetail kodu aynı kalacak)
        setIsLoadingJob(true);
        try {
            const jobRes = await axios.get(`http://localhost:8080/api/jobposts/${jobId}`);
            if (jobRes.data && jobRes.data.deadline) {
                jobRes.data.deadline = new Date(jobRes.data.deadline).toISOString().split('T')[0];
            }
            setJob(jobRes.data);
        } catch (error) {
            console.error('İlan detayları alınamadı:', error);
            alert("İlan detayları yüklenirken bir hata oluştu.");
        } finally {
            setIsLoadingJob(false);
        }
    }, [jobId]);

    const fetchApplicants = useCallback(async () => {
        // ... (mevcut fetchApplicants kodu aynı kalacak)
        setIsLoadingApplicants(true);
        try {
            const applicantsRes = await axios.get(`http://localhost:8080/api/applications/job/${jobId}`);
            // Başvuranları tarihe göre sıralayabiliriz (isteğe bağlı)
            const sortedApplicants = applicantsRes.data.sort((a, b) => new Date(b.applyDate) - new Date(a.applyDate));
            setApplicants(sortedApplicants);
        } catch (error) {
            console.error('Başvuranlar alınamadı:', error);
        } finally {
            setIsLoadingApplicants(false);
        }
    }, [jobId]);


    useEffect(() => {
        fetchJobDetail();
        fetchApplicants();
    }, [fetchJobDetail, fetchApplicants]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setJob({ ...job, [name]: value });
    };

    const handleUpdate = async () => {
        // ... (mevcut handleUpdate kodu aynı kalacak)
        if (!job) return;
        setIsUpdating(true);
        try {
            await axios.put(`http://localhost:8080/api/jobposts/update/${jobId}`, job);
            alert("İlan başarıyla güncellendi.");
        } catch (error) {
            console.error("Güncelleme hatası:", error.response?.data || error.message);
            alert(`Güncelleme sırasında bir hata oluştu: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        // ... (mevcut handleDelete kodu aynı kalacak)
        const confirmDelete = window.confirm("Bu ilanı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.");
        if (!confirmDelete) return;
        setIsDeleting(true);
        try {
            await axios.delete(`http://localhost:8080/api/jobposts/delete/${jobId}`);
            alert("İlan başarıyla silindi.");
            navigate("/company-dashboard", { state: { companyData: companyData } });
        } catch (error) {
            console.error("Silme hatası:", error);
            alert("Silme işlemi başarısız oldu.");
        } finally {
            setIsDeleting(false);
        }
    };

    // ... (isLoadingJob ve !job return blokları aynı kalacak)
    if (isLoadingJob) {
        return (
            <div className="jobpost-detail-page-wrapper">
                <HeaderBar userData={companyData} />
                <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Oval height={80} width={80} color="#82E0AA" secondaryColor="rgba(130, 224, 170, 0.3)" strokeWidth={3} />
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="jobpost-detail-page-wrapper">
                <HeaderBar userData={companyData} />
                <div className="jobpost-container" style={{ textAlign: 'center', color: '#B0B0B0' }}>
                    İlan bulunamadı veya yüklenirken bir sorun oluştu.
                </div>
            </div>
        );
    }


    return (
        <div className="jobpost-detail-page-wrapper">
            <HeaderBar userData={companyData} />
            <div className="jobpost-container">
                <h2>İlan Detaylarını Düzenle</h2>
                {/* ... (form kısmı aynı kalacak) ... */}
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="jobpost-form-field">
                        <label htmlFor="title">İlan Başlığı</label>
                        <input id="title" name="title" type='text' value={job.title} onChange={handleInputChange} placeholder="Başlık" />
                    </div>
                    <div className="jobpost-form-field">
                        <label htmlFor="description">Açıklama</label>
                        <textarea id="description" name="description"  value={job.description} onChange={handleInputChange} placeholder="Açıklama" />
                    </div>
                    <div className="jobpost-form-field">
                        <label htmlFor="technologies">Teknolojiler (virgülle ayırın)</label>
                        <input id="technologies" name="technologies" type="text" value={job.technologies} onChange={handleInputChange} placeholder="Örn: Java,React,Node.js" />
                    </div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div className="jobpost-form-field" style={{ flex: 1 }}>
                            <label htmlFor="city">Şehir</label>
                            <input id="city" name="city" type='text' value={job.city} onChange={handleInputChange} placeholder="Şehir" />
                        </div>
                        <div className="jobpost-form-field" style={{ flex: 1 }}>
                            <label htmlFor="country">Ülke</label>
                            <input id="country" name="country" type='text' value={job.country} onChange={handleInputChange} placeholder="Ülke" />
                        </div>
                    </div>
                    <div className="jobpost-form-field">
                        <label htmlFor="deadline">Son Başvuru Tarihi</label>
                        <input id="deadline" name="deadline" type="date" value={job.deadline} onChange={handleInputChange} />
                    </div>

                    <div className="jobpost-buttons">
                        <button onClick={handleUpdate} className="jobpost-button-update" disabled={isUpdating || isDeleting}>
                            {isUpdating ? <Oval height={18} width={18} color="#1D2B4A" strokeWidth={5} /> : "Değişiklikleri Kaydet"}
                        </button>
                        <button onClick={handleDelete} className="jobpost-button-delete" disabled={isUpdating || isDeleting}>
                            {isDeleting ? <Oval height={18} width={18} color="#FFFFFF" strokeWidth={5} /> : "İlanı Sil"}
                        </button>
                    </div>
                </form>


                <h3>Bu İlana Başvuranlar ({applicants.length})</h3>
                {isLoadingApplicants ? (
                    <p className="loading-applicants">
                        <Oval height={20} width={20} color="#82E0AA" strokeWidth={5} />
                        Başvuranlar yükleniyor...
                    </p>
                ) : applicants.length > 0 ? (
                    <ul className="applicants-list">
                        {applicants.map(app => {
                            // --- YENİ: Durumu Türkçe ve ikonlu al ---
                            const statusInfo = applicationStatusTurkishMap[app.status] || { text: app.status, icon: null, className: '' };
                            return (
                                <li key={app.id || app.userId} className={`applicant-item ${statusInfo.className}`}>
                                    <strong><FaUserGraduate style={{ marginRight: '6px' }} />{app.fullName || 'Bilinmeyen Kullanıcı'}</strong>
                                    <br />
                                    <FaEnvelope style={{ marginRight: '6px', color: '#B0B0B0' }} />
                                    <a href={`mailto:${app.email}`} className="applicant-email-link">{app.email}</a>
                                    <br />
                                    <i className="applicant-cover-letter">Ön Yazı/Link: {app.coverLetter || "N/A"}</i>
                                    <br />
                                    <small className="applicant-apply-date">
                                        Başvuru Tarihi: {new Date(app.applyDate).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </small>
                                    <br />
                                    {/* --- YENİ: Türkçe ve ikonlu durum gösterimi --- */}
                                    <div className="applicant-status-container">
                                        {statusInfo.icon}
                                        <span className={`applicant-status-text ${statusInfo.className}`}>
                                            {statusInfo.text}
                                        </span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="no-applicants">Bu ilana henüz başvuran olmadı.</p>
                )}
            </div>
        </div>
    );
};

export default JobPostDetail;