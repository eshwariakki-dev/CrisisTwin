import React, { useEffect, useState } from "react";
import "../styles/settings.css";

function Settings() {
  const [theme, setTheme] = useState("Light");
  const [refreshRate, setRefreshRate] = useState("30");
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("theme") || "Light";

    const savedRefresh =
      localStorage.getItem("refreshRate") || "30";

    const savedNotifications =
      localStorage.getItem("notifications");

    setTheme(savedTheme);
    setRefreshRate(savedRefresh);

    if (savedNotifications !== null) {
      setNotifications(savedNotifications === "true");
    }

    applyTheme(savedTheme);
  }, []);

  const applyTheme = (selectedTheme) => {
    if (selectedTheme === "Dark") {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  };

  const handleThemeChange = (value) => {
    setTheme(value);

    localStorage.setItem("theme", value);

    applyTheme(value);
  };

  const handleRefreshChange = (value) => {
    setRefreshRate(value);

    localStorage.setItem("refreshRate", value);
  };

  const handleNotificationChange = () => {
    const value = !notifications;

    setNotifications(value);

    localStorage.setItem(
      "notifications",
      value
    );
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>⚙️ Settings</h1>
        <p>Configure your CrisisTwin dashboard.</p>
      </div>

      <div className="settings-card">
        <h2>🎨 Dashboard Theme</h2>

        <select
          value={theme}
          onChange={(e) =>
            handleThemeChange(e.target.value)
          }
        >
          <option>Light</option>
          <option>Dark</option>
        </select>
      </div>

      <div className="settings-card">
        <h2>🔄 Auto Refresh</h2>

        <select
          value={refreshRate}
          onChange={(e) =>
            handleRefreshChange(e.target.value)
          }
        >
          <option value="15">
            15 Seconds
          </option>

          <option value="30">
            30 Seconds
          </option>

          <option value="60">
            1 Minute
          </option>

          <option value="300">
            5 Minutes
          </option>
        </select>

        <p style={{ marginTop: "10px" }}>
          Current Refresh : {refreshRate} Seconds
        </p>
      </div>

      <div className="settings-card">
        <h2>🔔 Notifications</h2>

        <label className="toggle">
          <input
            type="checkbox"
            checked={notifications}
            onChange={handleNotificationChange}
          />

          Enable Disaster Alerts
        </label>

        <p style={{ marginTop: "10px" }}>
          Status :
          <strong>
            {notifications
              ? " Enabled"
              : " Disabled"}
          </strong>
        </p>
      </div>

      <div className="settings-card">
        <h2>ℹ️ Project Information</h2>

        <p>
          <strong>Project:</strong> CrisisTwin
        </p>

        <p>
          <strong>Version:</strong> 1.0
        </p>

        <p>
          <strong>Purpose:</strong> AI Powered Predictive
          Disaster Intelligence Platform
        </p>

        <p>
          <strong>Theme:</strong> {theme}
        </p>

        <p>
          <strong>Refresh:</strong>{" "}
          {refreshRate} Seconds
        </p>

        <p>
          <strong>Notifications:</strong>{" "}
          {notifications
            ? "Enabled"
            : "Disabled"}
        </p>
      </div>
    </div>
  );
}

export default Settings;