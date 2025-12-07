import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import MainPage from './components/MainPage';
import UserProfilePage from './components/UserProfilePage';
import UserProfileSettings from './components/UserProfileSettings';
import CompanyLoginPage from './components/CompanyLoginPage';
import CompanySignupPage from './components/CompanySignupPage';
import CompanyDashboard from './components/CompanyDashboard';
import LandingPage from './components/LandingPage';
import ApplicationPage from './components/ApplicationPage';
import UserApplications from './components/UserApplications';
import JobPostDetail from './components/JobPostDetail';
import AiAssistantPage from './components/AiAssistantPage';
import CvAnalysis from './components/CvAnalysis';


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
        <Route path="/main" element={<MainPage/>} />
        <Route path="/ai-assistant" element={<AiAssistantPage />} />
        <Route path="/cv-analysis" element={<CvAnalysis />} />
        <Route path="/apply/:jobId" element={<ApplicationPage />} />
        <Route path="/user-profile" element={<UserProfilePage />} />
        <Route path="/user-settings" element={<UserProfileSettings />} />
        <Route path="/user-applications" element={<UserApplications/>} />
        <Route path="/jobpost/:id" element={<JobPostDetail />} />
      </Routes>
    </Router>
  );
}

export default App;

