// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AuthForm from './components/AuthForm';
import Verify from './pages/Verify'; // Make sure this file exists
import './components/AuthForm.css';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AnalyzeFile from './pages/AnalyzeFile'; 
import AnalysisHistory from './pages/AnalysisHistory';
import LandingPage from "./pages/LandingPage";
import ProfilePage from "./pages/ProfilePage";
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import SuperadminLogin from "./pages/SuperadminLogin";  
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/home" element={<LandingPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthForm />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/dashboard/user" element={<UserDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/analyze-file" element={<AnalyzeFile />} />
          <Route path="/analysis-history" element={<AnalysisHistory />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard/superadmin" element={<SuperAdminDashboard />} />
          <Route path="/superadmin-login" element={<SuperadminLogin />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
