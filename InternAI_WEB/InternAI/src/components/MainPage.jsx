import React, { useState } from "react";
import "./MainPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderBar from "./HeaderBar"; // HeaderBar bileşenini dahil et

const internships = [
  { id: "1", title: "Frontend Stajı", company: "ABC Teknoloji", location: "İstanbul" },
  { id: "2", title: "Backend Stajı", company: "XYZ Yazılım", location: "Ankara" },
];

const MainPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false); // Drawer'ın açık/kapalı durumu için state
  const location = useLocation(); // Kullanıcı verisini almak için kullanılır
  const userData = location.state?.userdata || null; // Kullanıcı verisini al

  const navigate = useNavigate(); // React Router'dan yönlendirme için

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <div className="gradient">
      <HeaderBar 
      userData={userData} // Kullanıcı adını HeaderBar'a gönder
      toggleDrawer={toggleDrawer} 
      mainPage={true}
      />

      <h2 className="header">Mevcut Staj İlanları</h2>
      <div className="cardList">
        {internships.map((item) => (
          <div key={item.id} className="card">
            <p className="title">{item.title}</p>
            <p className="company">{item.company}</p>
            <p className="location">{item.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainPage;
