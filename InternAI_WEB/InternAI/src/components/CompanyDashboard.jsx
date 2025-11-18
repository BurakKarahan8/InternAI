// CompanyDashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeaderBar from '../components/HeaderBar'; // veya ./HeaderBar
import './CompanyDashboard.css'; // Güncellenmiş CSS
import { FaPlusCircle, FaTrashAlt, FaSpinner, FaExclamationCircle } from 'react-icons/fa'; // İkonlar
import { Oval } from 'react-loader-spinner'; // Yükleme göstergesi

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { companyData } = location.state || {};

  const [jobPosts, setJobPosts] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [isAddingJob, setIsAddingJob] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    deadline: '', // date -> deadline olarak değiştirdim (API ile uyumlu)
    technologies: '',
    city: '',
    country: 'Türkiye',
  });

  const fetchJobPosts = useCallback(async () => {
    if (!companyData?.companyId) {
        setIsLoadingJobs(false);
        return;
    }
    setIsLoadingJobs(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/jobposts/company/${companyData.companyId}`);
      // Tarihe göre en yeniden eskiye sırala
      const sortedJobs = response.data.sort((a, b) => new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id));
      setJobPosts(sortedJobs);
    } catch (error) {
      console.error("İlanlar çekilirken hata oluştu:", error);
      alert("İlanlar yüklenirken bir sorun oluştu.");
    } finally {
      setIsLoadingJobs(false);
    }
  }, [companyData?.companyId]);

  useEffect(() => {
    if (!companyData) {
        alert("Şirket bilgileri bulunamadı. Lütfen tekrar giriş yapın.");
        navigate("/company-login"); // veya landing page
        return;
    }
    fetchJobPosts();
  }, [companyData, fetchJobPosts, navigate]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob({ ...newJob, [name]: value });
  };

  const handleAddJob = async () => {
    const { title, description, deadline, technologies, city, country } = newJob;
    if (!title || !description || !deadline || !technologies || !city || !country) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }
    setIsAddingJob(true);
    const jobData = {
      ...newJob, // title, description, deadline, technologies, city, country
      companyName: companyData.companyName,
      companyId: companyData.companyId
    };

    try {
      const response = await axios.post("http://localhost:8080/api/jobposts/create", jobData);
      // Yeni eklenen ilanı listenin başına ekle
      setJobPosts(prevPosts => [response.data, ...prevPosts]);
      setNewJob({ title: '', description: '', deadline: '', technologies: '', city: '', country: 'Türkiye' });
      alert("İlan başarıyla eklendi!");
    } catch (error) {
      console.error("İlan eklenirken hata oluştu:", error.response?.data || error.message);
      alert(`İlan eklenirken bir hata oluştu: ${error.response?.data?.message || error.message}`);
    } finally {
        setIsAddingJob(false);
    }
  };

  if (!companyData) {
    // Bu durum useEffect içinde zaten ele alınıyor, ama bir fallback olarak kalabilir.
    return (
        <div className="company-dashboard-wrapper">
            <div style={{ textAlign: 'center', paddingTop: '50px', color: 'white' }}>
                Şirket bilgileri yükleniyor veya bulunamadı...
            </div>
        </div>
    );
  }

  return (
    <div className="company-dashboard-wrapper">
      <HeaderBar userData={companyData} /> {/* userProfilePage prop'u şirket için gereksiz olabilir */}

      <div className="company-dashboard-container">
        <div className="dashboard-section add-job-section">
          <h2><FaPlusCircle style={{ marginRight: '10px', color: '#82E0AA' }} />Yeni Staj İlanı Ekle</h2>
          <input
            type="text"
            value={companyData.companyName}
            disabled
            className="form-input"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)', cursor: 'not-allowed' }}
          />
          <input
            type="text" name="title" placeholder="İlan Başlığı*"
            value={newJob.title} onChange={handleInputChange} className="form-input"
          />
          <textarea
            name="description" placeholder="Açıklama*"
            value={newJob.description} onChange={handleInputChange} className="form-textarea"
          />
          <input
            type="text" name="technologies" placeholder="Teknolojiler (virgülle ayırın: Java,React)*"
            value={newJob.technologies} onChange={handleInputChange} className="form-input"
          />
          <div style={{ display: 'flex', gap: '15px', marginBottom: '18px' }}>
            <input
              type="text" name="city" placeholder="Şehir*"
              value={newJob.city} onChange={handleInputChange} className="form-input" style={{ flex: 1, marginBottom: 0 }}
            />
            <input /* Ülke inputu default Türkiye ve değiştirilemez olabilir */
              type="text" name="country" placeholder="Ülke*"
              value={newJob.country} onChange={handleInputChange} className="form-input" style={{ flex: 1, marginBottom: 0 }}
            />
          </div>
          <input
            type="date" name="deadline" value={newJob.deadline}
            onChange={handleInputChange} className="form-input date-input-company"
          />
          <button className="dashboard-button" onClick={handleAddJob} disabled={isAddingJob}>
            {isAddingJob ? <Oval height={20} width={20} color="#1D2B4A" secondaryColor="#3A506B" strokeWidth={5} /> : 'İlanı Ekle'}
          </button>
        </div>

        <div className="dashboard-section job-list-section">
          <h2>Yayınladığım Staj İlanları</h2>
          {isLoadingJobs ? (
            <div style={{display: 'flex', justifyContent: 'center', padding: '30px'}}>
                <Oval height={50} width={50} color="#82E0AA" secondaryColor="rgba(130, 224, 170, 0.3)" strokeWidth={4} />
            </div>
          ) : jobPosts.length === 0 ? (
            <p className="empty-job-list">
                <FaExclamationCircle style={{marginRight: '8px'}} />
                Henüz yayınlanmış bir ilanınız bulunmuyor.
            </p>
          ) : (
            <div className="job-post-list">
                {jobPosts.map((job) => (
                <div
                    key={job.id}
                    className="job-post-card"
                    onClick={() => navigate(`/jobpost/${job.id}` , { state: { companyData: companyData } })}
                    style={{ cursor: 'pointer' }}
                >
                    <h4>{job.title}</h4>
                    <p>{job.description}</p>
                    <small>Son Başvuru: {new Date(job.deadline).toLocaleDateString('tr-TR')}</small>
                </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;