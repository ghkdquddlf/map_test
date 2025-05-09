import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import FileUpload from './pages/FileUpload';
import MapView from './pages/MapView';
import UploadHistory from './pages/UploadHistory';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider } from './context/AuthContext';

function AppContent() {
  const location = useLocation();
  const isMapPage = location.pathname === '/map';

  return (
    isMapPage ? (
      <>
        <Header />
        <Routes>
          <Route path="/map" element={<MapView />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/upload" element={<FileUpload />} />
          <Route path="/history" element={<UploadHistory />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </>
    ) : (
      <div className="container">
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/upload" element={<FileUpload />} />
          <Route path="/history" element={<UploadHistory />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    )
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
