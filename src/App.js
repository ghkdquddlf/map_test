import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import FileUpload from './pages/FileUpload';
import MapView from './pages/MapView';
import UploadHistory from './pages/UploadHistory';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/upload" element={<FileUpload />} />
          <Route path="/history" element={<UploadHistory />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/" element={<Navigate to="/upload" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
