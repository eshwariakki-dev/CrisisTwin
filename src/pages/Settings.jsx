import React, { useState } from "react";

function Settings() {
  const [city, setCity] = useState("Bengaluru");
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="page">
      <h1>⚙️ Settings</h1>

      <div
        style={{
          background: "#1e293b",
          color: "white",
          padding: "20px",
          borderRadius: "10px",
          maxWidth: "600px",
        }}
      >
        <h2>Application Settings</h2>

        <div style={{ marginBottom: "20px" }}>
          <label>
            <strong>Preferred City</strong>
          </label>
          <br />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "8px",
              borderRadius: "5px",
              border: "none",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
            {" "}Enable Weather & Disaster Alerts
          </label>
        </div>

        <hr />

        <h3>Current Configuration</h3>

        <p>📍 City: {city}</p>

        <p>
          🔔 Notifications:
          {" "}
          {notifications ? "Enabled" : "Disabled"}
        </p>

        <p>🌦 Weather Source: OpenWeather API</p>

        <p>🗺 Map Source: OpenStreetMap + Leaflet</p>

        <p>🤖 Prediction Engine: Forecast-based Risk Analysis</p>

        <p>Version: 1.0.0</p>
      </div>
    </div>
  );
}

export default Settings;