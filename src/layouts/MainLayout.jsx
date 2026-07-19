import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

/**
 * MainLayout component managing the responsive structural framework.
 * Maintains state for sidebar drawer visibility on mobile.
 */
function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`dashboard-wrapper ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Sidebar navigation */}
      <Sidebar onClose={() => setSidebarOpen(false)} />

      {/* Backdrop for mobile overlays */}
      <div 
        className="sidebar-backdrop" 
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Primary content area */}
      <div className="main-container">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="content-outlet">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
