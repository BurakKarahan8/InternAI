import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './CompanyDashboard.css';

const CompanyDashboard = () => {
  const location = useLocation();
  const { companyData } = location.state || {};

  const [refreshList, setRefreshList] = useState(false);

  const handleRefresh = () => {
    setRefreshList(!refreshList);
  };

  if (!companyData) {
    return <p>Veriler yüklenemedi. Lütfen tekrar giriş yapın.</p>;
  }

  return (
    <div className="company-dashboard">
      <h1>Merhaba, {companyData.companyName}</h1>

      <div className="dashboard-section">
        <h2>Yeni Staj İlanı Ekle</h2>
      </div>

      <div className="dashboard-section">
        <h2>Staj İlanlarım</h2>
      </div>
    </div>
  );
};

export default CompanyDashboard;
