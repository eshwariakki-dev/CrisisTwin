import React, { useState, useEffect } from 'react';

/**
 * Navbar top header component for CrisisTwin.
 * Includes a live date-time clock, menu toggle for mobile, notification badge, and profile indicators.
 * 
 * @param {Object} props
 * @param {Function} props.onToggleSidebar - Callback to open/close mobile sidebar drawer
 */
function Navbar({ onToggleSidebar }) {
  const [dateTime, setDateTime] = useState(new Date());

  // Set up live clock ticking
  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date) => {
    const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        {/* Hamburger menu for mobile/tablet */}
        <button 
          className="menu-toggle-btn" 
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation Menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className="navbar-title">
          <h1>CrisisTwin Control</h1>
        </div>
      </div>

      <div className="navbar-right">
        {/* Live date & time */}
        <div className="navbar-datetime" title="System Time">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="datetime-icon">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>{formatDateTime(dateTime)}</span>
        </div>

        {/* System Online Badge */}
        <div className="navbar-status">
          <span className="status-indicator online"></span>
          <span>SYSTEM RUNNING</span>
        </div>

        {/* Notifications Icon Button */}
        <button className="navbar-action-btn" aria-label="Notifications">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="badge">4</span>
        </button>

        {/* User Profile Info */}
        <div className="navbar-profile">
          <div className="profile-avatar">
            <span>HQ</span>
          </div>
          <div className="profile-details">
            <span className="profile-name">Command HQ</span>
            <span className="profile-role">Incident Cmdr</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
