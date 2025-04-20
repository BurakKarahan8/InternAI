import React, { useState } from "react";
import "./MainPage.css";
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation } from "react-router-dom";

const internships = [
  { id: '1', title: 'Frontend Stajı', company: 'ABC Teknoloji', location: 'İstanbul' },
  { id: '2', title: 'Backend Stajı', company: 'XYZ Yazılım', location: 'Ankara' },
  { id: '3', title: 'Frontend Stajı', company: 'ABC Teknoloji', location: 'İstanbul' },
  { id: '4', title: 'Backend Stajı', company: 'XYZ Yazılım', location: 'Ankara' },
  { id: '5', title: 'Frontend Stajı', company: 'ABC Teknoloji', location: 'İstanbul' },
  { id: '6', title: 'Backend Stajı', company: 'XYZ Yazılım', location: 'Ankara' },
  { id: '7', title: 'Frontend Stajı', company: 'ABC Teknoloji', location: 'İstanbul' },
  { id: '8', title: 'Backend Stajı', company: 'XYZ Yazılım', location: 'Ankara' },
  { id: '9', title: 'Frontend Stajı', company: 'ABC Teknoloji', location: 'İstanbul' },
  { id: '10', title: 'Backend Stajı', company: 'XYZ Yazılım', location: 'Ankara' },
  { id: '11', title: 'Frontend Stajı', company: 'ABC Teknoloji', location: 'İstanbul' },
  { id: '12', title: 'Backend Stajı', company: 'XYZ Yazılım', location: 'Ankara' },
  // Daha fazla staj eklenebilir
];

const MainPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const userData = location.state?.userdata || null;

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <div className="gradient">
      <div className="headerBar">
        <div className="logoWrapper">
          <div className="logoText">
            <span className="internText">Intern</span>
            <span className="aiText">AI</span>
          </div>
          <div className="userText">{userData}</div>
        </div>
        <IconButton onClick={toggleDrawer(true)}>
          <MenuIcon style={{ color: "white" }} />
        </IconButton>
      </div>

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

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <div className="drawer-container">
          <p className="drawer-title">Menü</p>
          <ul className="drawer-list">
            <li>
              <a href="/" className="drawer-link">Giriş Yap</a>
            </li>
            <li>
              <a href="/signup" className="drawer-link">Kayıt Ol</a>
            </li>
          </ul>
        </div>
      </Drawer>
    </div>
  );
};

export default MainPage;
