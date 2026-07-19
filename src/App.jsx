import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import LiveMap from './pages/LiveMap';
import Predictions from './pages/Predictions';
import Hospitals from './pages/Hospitals';
import Shelters from './pages/Shelters';
import Resources from './pages/Resources';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';

/**
 * App component setting up the React Router with all application paths.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="live-map" element={<LiveMap />} />
          <Route path="predictions" element={<Predictions />} />
          <Route path="hospitals" element={<Hospitals />} />
          <Route path="shelters" element={<Shelters />} />
          <Route path="resources" element={<Resources />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
