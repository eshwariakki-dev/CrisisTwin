import React, { useEffect, useState } from "react";
import { getWeather } from "../services/weatherService";
import { getLocation } from "../services/locationService";
import "../styles/alerts.css";

function Alerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const location = getLocation();
const city = location.city;

      const weather = await getWeather(city);

      const generatedAlerts = [];

      const condition = weather.weather[0].main.toLowerCase();
      const temp = weather.main.temp;
      const wind = weather.wind.speed;

      // Flood Alert
      if (condition.includes("rain")) {
        generatedAlerts.push({
          type: "🌧 Flood Alert",
          severity: "High",
          message:
            "Heavy rainfall detected. Avoid low-lying areas and flooded roads.",
          recommendation:
            "Move to higher ground and keep emergency supplies ready.",
        });
      }

      // Thunderstorm
      if (condition.includes("thunderstorm")) {
        generatedAlerts.push({
          type: "⛈ Thunderstorm Warning",
          severity: "High",
          message:
            "Thunderstorms expected. Stay indoors and avoid open areas.",
          recommendation:
            "Disconnect electrical appliances and avoid sheltering under trees.",
        });
      }

      // Strong Wind
      if (wind >= 8) {
        generatedAlerts.push({
          type: "🌬 Strong Wind Alert",
          severity: "Medium",
          message:
            "Strong winds detected. Outdoor movement may be unsafe.",
          recommendation:
            "Secure loose objects and avoid unnecessary travel.",
        });
      }

      // Heatwave
      if (temp >= 35) {
        generatedAlerts.push({
          type: "🔥 Heatwave Alert",
          severity: "High",
          message:
            "Extreme temperatures detected. Risk of heat-related illness.",
          recommendation:
            "Stay hydrated and avoid direct sunlight during peak hours.",
        });
      }

      // Fog / Mist
      if (
        condition.includes("fog") ||
        condition.includes("mist") ||
        condition.includes("haze")
      ) {
        generatedAlerts.push({
          type: "🌫 Low Visibility Alert",
          severity: "Medium",
          message:
            "Reduced visibility due to fog or haze.",
          recommendation:
            "Drive carefully and use headlights when necessary.",
        });
      }

      // Clouds
      if (condition.includes("cloud")) {
        generatedAlerts.push({
          type: "☁ Weather Advisory",
          severity: "Low",
          message:
            "Cloudy weather detected. Continue monitoring local conditions.",
          recommendation:
            "No immediate action required. Stay updated on weather forecasts.",
        });
      }

      setAlerts(generatedAlerts);
    } catch (error) {
      console.error("Alert Error:", error);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>🚨 Disaster Alerts</h1>
        <p>Live weather-based alerts and AI recommendations.</p>
      </div>

      {alerts.length === 0 ? (
        <div className="alert-card low">
          <h2>✅ No Active Alerts</h2>
          <p>No significant weather risks detected.</p>
          <p>
            <strong>🤖 AI Recommendation:</strong> Continue monitoring weather
            conditions.
          </p>
        </div>
      ) : (
        alerts.map((alert, index) => (
          <div
            key={index}
            className={`alert-card ${alert.severity.toLowerCase()}`}
          >
            <h2>{alert.type}</h2>

            <p>
              <strong>Severity:</strong> {alert.severity}
            </p>

            <p>{alert.message}</p>

            <p>
              <strong>🤖 AI Recommendation:</strong> {alert.recommendation}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default Alerts;