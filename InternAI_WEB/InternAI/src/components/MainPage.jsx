// MainPage.js
import React, { useEffect, useState, useCallback } from "react";
import "./MainPage.css"; // Güncellenmiş CSS
import { useLocation, useNavigate } from "react-router-dom";
import HeaderBar from "./HeaderBar"; // veya ../components/HeaderBar
import { FaMapMarkerAlt, FaCalendarAlt, FaBriefcase, FaCode, FaSearchMinus } from "react-icons/fa"; // İkonlar
import { Oval } from 'react-loader-spinner'; // Yükleme göstergesi için

const MainPage = () => {
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [allTechnologies, setAllTechnologies] = useState(new Set()); // Set olarak başlat
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [loading, setLoading] = useState(true); // Yükleme durumu

  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state?.userdata || null;

  const fetchInternships = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/jobposts/jobposts");
      if (!response.ok) throw new Error("İlanlar çekilemedi: " + response.statusText);
      const data = await response.json();
      const transformed = data.map((item) => ({
        ...item, // id, title, description, companyName, city, country, deadline zaten geliyor
        technologiesArray: item.technologies ? item.technologies.split(",").map((tech) => tech.trim()).filter(t => t) : [],
      }));

      setInternships(transformed);
      setFilteredInternships(transformed); // Başlangıçta hepsi

      const techSet = new Set();
      transformed.forEach((item) =>
        item.technologiesArray.forEach((tech) => techSet.add(tech))
      );
      setAllTechnologies(techSet);
    } catch (err) {
      console.error("Staj ilanları alınırken hata:", err);
      alert("Staj ilanları yüklenirken bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  }, []); // Boş bağımlılık, sadece mount'ta çalışır

  useEffect(() => {
    fetchInternships();
  }, [fetchInternships]);

  const applyFilters = useCallback(() => {
    if (selectedTechnologies.length === 0) {
      setFilteredInternships(internships);
    } else {
      setFilteredInternships(
        internships.filter((item) =>
          selectedTechnologies.every((selectedTech) =>
            item.technologiesArray.includes(selectedTech)
          )
        )
      );
    }
  }, [internships, selectedTechnologies]);

  useEffect(() => {
    applyFilters();
  }, [selectedTechnologies, applyFilters]);


  const handleFilter = (tech) => {
    setSelectedTechnologies((prevSelected) =>
      prevSelected.includes(tech)
        ? prevSelected.filter((t) => t !== tech)
        : [...prevSelected, tech]
    );
  };

  const clearFilters = () => {
    setSelectedTechnologies([]);
  };

  return (
    <div className="main-page-gradient">
      <HeaderBar userData={userData} mainPage={true} />
      <div className="main-content-wrapper">
        <aside className="sidebar">
          <h3><FaCode style={{ marginRight: '8px'}} />Teknolojilere Göre Filtrele</h3>
          {loading && allTechnologies.size === 0 ? (
             <Oval height={30} width={30} color="#82E0AA" secondaryColor="rgba(130, 224, 170, 0.3)" strokeWidth={4} />
          ) : (
            <ul className="tech-list">
                {Array.from(allTechnologies).sort().map((tech, index) => (
                <li
                    key={index}
                    className={`tech-item ${selectedTechnologies.includes(tech) ? "active" : ""}`}
                    onClick={() => handleFilter(tech)}
                >
                    {tech}
                </li>
                ))}
            </ul>
          )}
          {selectedTechnologies.length > 0 && (
            <button className="clear-button" onClick={clearFilters}>
              Filtreyi Temizle
            </button>
          )}
        </aside>

        <main className="content">
          <h2 className="main-header">Staj İlanları</h2>
          {loading ? (
            <div className="loading-message">
                <Oval height={80} width={80} color="#82E0AA" secondaryColor="rgba(130, 224, 170, 0.3)" strokeWidth={3} />
                <p>İlanlar yükleniyor...</p>
            </div>
          ) : filteredInternships.length === 0 ? (
            <div className="empty-message">
                <FaSearchMinus />
                <p>Aradığınız kriterlere uygun ilan bulunamadı.</p>
            </div>
          ) : (
            <div className="cardList">
              {filteredInternships.map((item) => (
                <div
                  key={item.id}
                  className="card"
                  onClick={() => navigate(`/apply/${item.id}`, { state: { job: item, userdata: userData } })}
                >
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-company"><FaBriefcase style={{ marginRight: '6px', color: '#f0b500' }} />{item.companyName}</p>
                  <p className="card-description">{item.description}</p>

                  {item.technologiesArray && item.technologiesArray.length > 0 && (
                    <>
                        <p className="card-technologies-label">Aranan Yetkinlikler:</p>
                        <div className="card-tech-container">
                        {item.technologiesArray.map((tech, index) => (
                            <span key={index} className="card-tech-badge">
                            {tech}
                            </span>
                        ))}
                        </div>
                    </>
                  )}
                  <div className="card-footer">
                    <span className="card-location card-footer-item">
                        <FaMapMarkerAlt /> {item.city}, {item.country}
                    </span>
                    <span className="card-deadline card-footer-item">
                        <FaCalendarAlt /> <strong>Son Başvuru:</strong> {new Date(item.deadline).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
export default MainPage;