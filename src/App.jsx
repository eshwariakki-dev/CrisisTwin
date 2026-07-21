import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import LiveMap from './pages/LiveMap';
import Predictions from './pages/Predictions';
import Resources from "./pages/Resources";
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';

function App() {

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "Light";

    if (savedTheme === "Dark") {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="live-map" element={<LiveMap />} />
          <Route path="predictions" element={<Predictions />} />
          <Route path="resources" element={<Resources />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;