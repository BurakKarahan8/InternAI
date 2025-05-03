import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import MailControlPage from './components/MailControlPage';
import MainPage from './components/MainPage';
import UserProfilePage from './components/UserProfilePage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage/>} />
        <Route path="/mailcontrol" element={<MailControlPage/>} />
        <Route path="/main" element={<MainPage/>} />
        <Route path="/user-profile" element={<UserProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;

