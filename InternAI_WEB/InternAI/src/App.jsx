import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import MailControlPage from './components/MailControlPage';
import MainPage from './components/MainPage';
import UserProfilePage from './components/UserProfilePage';
import UserProfileSettings from './components/UserProfileSettings';
import CompanyLoginPage from './components/CompanyLoginPage';
import CompanySignupPage from './components/CompanySignupPage';
import CompanyDashboard from './components/CompanyDashboard';
import LandingPage from './components/LandingPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage/>} />
        <Route path="/company-login" element={<CompanyLoginPage />} />
        <Route path="/company-signup" element={<CompanySignupPage />} />
        <Route path="/company-dashboard" element={<CompanyDashboard />} />
        <Route path="/mailcontrol" element={<MailControlPage/>} />
        <Route path="/main" element={<MainPage/>} />
        <Route path="/user-profile" element={<UserProfilePage />} />
        <Route path="/user-settings" element={<UserProfileSettings />} />
      </Routes>
    </Router>
  );
}

export default App;

