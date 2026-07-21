import React, { useState, useEffect } from "react";
import { getWeather, getForecast } from "../services/weatherService";
import { getLocation, setLocation } from "../services/locationService";

function Dashboard() {

  const [currentTime, setCurrentTime] = useState(new Date());
const [city, setCity] = useState(getLocation().city);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  const [risk, setRisk] = useState({
    level: "Loading...",
    color: "gray",
    recommendation: "Analyzing weather...",
  });

  const [riskScore, setRiskScore] = useState(0);

  const [prediction, setPrediction] = useState("");
const handleSearch = async () => {
  if (!city.trim()) return;

  const data = await getWeather(city.trim());

  if (!data) return;

  setLocation({
    city: data.name,
    lat: data.coord.lat,
    lng: data.coord.lon,
  });

  setCity(data.name);
};
  useEffect(() => {
    const fetchWeather = async () => {
      try {
  
const location = getLocation();
const data = await getWeather(location.city);
if (!data) return;
const forecastData = await getForecast(
  data.coord.lat,
  data.coord.lon
);
if (!forecastData) return;
        setWeather(data);
        setForecast(forecastData);

        const nextForecast = forecastData.list.slice(0, 3);

        let predictionMessage =
          "✅ No severe weather expected in the next 9 hours.";

        const rain = nextForecast.find(
          (item) => item.weather[0].main === "Rain"
        );

        const storm = nextForecast.find(
          (item) => item.weather[0].main === "Thunderstorm"
        );

        if (storm) {
          predictionMessage =
            "⛈ Thunderstorms expected within the next 9 hours. High disaster risk.";
        } else if (rain) {
          predictionMessage =
            "🌧 Rain expected within the next 9 hours. Monitor low-lying areas for possible flooding.";
        }

        setPrediction(predictionMessage);

        let score = 0;

        if (data.weather[0].main === "Rain") score += 50;

        if (data.weather[0].main === "Thunderstorm") score += 70;

        if (data.main.humidity >= 75) score += 20;

        if (data.wind.speed >= 8) score += 20;

        if (data.main.temp >= 35) score += 10;

        setRiskScore(score);

        if (score >= 60) {
          setRisk({
            level: "HIGH 🔴",
            color: "red",
            recommendation:
              "Deploy rescue teams, alert hospitals, and prepare evacuation.",
          });
        } else if (score >= 30) {
          setRisk({
            level: "MEDIUM 🟡",
            color: "orange",
            recommendation:
              "Monitor the situation closely and keep emergency teams ready.",
          });
        } else {
          setRisk({
            level: "LOW 🟢",
            color: "green",
            recommendation:
              "No immediate action required. Continue monitoring.",
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchWeather();
  }, [city]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatBannerTime = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const weatherCondition = weather?.weather?.[0]?.main || "Loading";

  const humidity = weather?.main?.humidity || 0;

  const temperature = weather?.main?.temp || 0;

  const windSpeed = weather?.wind?.speed || 0;
  const pressure = weather?.main?.pressure || 0;
const visibility = weather?.visibility
  ? (weather.visibility / 1000).toFixed(1)
  : 0;

  const summaryCards = [
    {
      id: "risk",
      title: "Disaster Risk",
      value: risk.level,
      status: `Risk Score ${riskScore}/100`,
      statusType:
        riskScore >= 60
          ? "danger"
          : riskScore >= 30
          ? "warning"
          : "success",

      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="card-icon"
        >
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      ),
    },
        {
      id: "weather",
      title: "Weather Status",
      value: weatherCondition,
      status: `${temperature.toFixed(1)}°C • Humidity ${humidity}%`,
      statusType:
        weatherCondition === "Thunderstorm" || weatherCondition === "Rain"
          ? "danger"
          : weatherCondition === "Clouds"
          ? "warning"
          : "success",

      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="card-icon"
        >
          <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 8.58" />
          <line x1="8" y1="19" x2="8" y2="21" />
          <line x1="8" y1="13" x2="8" y2="15" />
          <line x1="16" y1="19" x2="16" y2="21" />
          <line x1="16" y1="13" x2="16" y2="15" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="12" y1="15" x2="12" y2="17" />
        </svg>
      ),
    },

    {
      id: "temperature",
      title: "Temperature",
      value: `${temperature.toFixed(1)}°C`,
      status: "Current Temperature",
      statusType: "info",

      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="card-icon"
        >
          <path d="M14 14.76V3.5a2 2 0 1 0-4 0v11.26a4 4 0 1 0 4 0z" />
        </svg>
      ),
    },

    {
      id: "humidity",
      title: "Humidity",
      value: `${humidity}%`,
      status:
        humidity >= 75
          ? "High moisture detected"
          : "Normal humidity",

      statusType: humidity >= 75 ? "warning" : "success",

      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="card-icon"
        >
          <path d="M12 2C8 7 6 10 6 14a6 6 0 0 0 12 0c0-4-2-7-6-12z" />
        </svg>
      ),
    },

    {
      id: "wind",
      title: "Wind Speed",
      value: `${windSpeed} m/s`,
      status:
        windSpeed >= 8
          ? "Strong wind detected"
          : "Wind conditions stable",

      statusType: windSpeed >= 8 ? "warning" : "success",

      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="card-icon"
        >
          <path d="M4 12h12" />
          <path d="M12 6h8" />
          <path d="M8 18h10" />
        </svg>
      ),
    },
    {
  id: "pressure",
  title: "Pressure",
  value: `${pressure} hPa`,
  status: "Atmospheric Pressure",
  statusType: "info",
  icon: "🌡️",
},

{
  id: "visibility",
  title: "Visibility",
  value: `${visibility} km`,
  status: visibility < 5 ? "Low Visibility" : "Clear Visibility",
  statusType: visibility < 5 ? "warning" : "success",
  icon: "👁️",
},

    {
      id: "forecast",
      title: "Prediction",
      value:
        prediction.includes("Thunder")
          ? "Storm Alert"
          : prediction.includes("Rain")
          ? "Rain Alert"
          : "Safe",

      status: prediction,
      statusType:
        riskScore >= 60
          ? "danger"
          : riskScore >= 30
          ? "warning"
          : "success",

      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="card-icon"
        >
          <path d="M21 15.5A8.38 8.38 0 0 1 12 22a8.5 8.5 0 0 1-8.48-8A8.5 8.5 0 0 1 12 2a8.38 8.38 0 0 1 9 6.5" />
        </svg>
      ),
    },
  ];

 let recentAlerts = [];

if (forecast?.list) {
  const next24Hours = forecast.list.slice(0, 8);

  const hasRain = next24Hours.some(
    item => item.weather[0].main === "Rain"
  );

  const hasThunderstorm = next24Hours.some(
    item => item.weather[0].main === "Thunderstorm"
  );

  const hasHeatwave = next24Hours.some(
    item => item.main.temp >= 40
  );

  const hasStrongWind = next24Hours.some(
    item => item.wind.speed >= 8
  );

  if (hasThunderstorm) {
    recentAlerts.push({
      id: 1,
      message: "⛈ Thunderstorm expected within 24 hours",
      time: "Forecast",
      priority: "HIGH",
      priorityType: "danger",
    });
  }

  if (hasRain) {
    recentAlerts.push({
      id: 2,
      message: "🌧 Rain expected within 24 hours",
      time: "Forecast",
      priority: "MEDIUM",
      priorityType: "warning",
    });
  }

  if (hasHeatwave) {
    recentAlerts.push({
      id: 3,
      message: "🌡 Heatwave conditions expected",
      time: "Forecast",
      priority: "HIGH",
      priorityType: "danger",
    });
  }

  if (hasStrongWind) {
    recentAlerts.push({
      id: 4,
      message: "💨 Strong winds expected",
      time: "Forecast",
      priority: "MEDIUM",
      priorityType: "warning",
    });
  }

  if (recentAlerts.length === 0) {
    recentAlerts.push({
      id: 5,
      message: "🟢 No severe weather expected in the next 24 hours",
      time: "Forecast",
      priority: "SAFE",
      priorityType: "success",
    });
  }
}
  const systemStatus = [
    {
      name: "AI Engine",
      status: riskScore >= 60 ? "High Load" : "Online",
    },
    {
      name: "Weather API",
      status: weather ? "Connected" : "Connecting",
    },
    {
      name: "Forecast Engine",
      status: forecast ? "Online" : "Loading",
    },
    {
      name: "Prediction Model",
      status: prediction ? "Running" : "Waiting",
    },
    {
      name: "Risk Analyzer",
      status: `${riskScore}/100`,
    },
  ];
    return (
    <div className="page dashboard-page-content">

      <section className="welcome-banner">
        <div className="banner-text">
          <h1>CrisisTwin</h1>

          <p className="banner-subtitle">
            AI Powered Disaster Intelligence Platform
          </p>

          <p
            style={{
              marginTop: "12px",
              color: "#ffffff",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            🌤️ {weather?.name}:: {weather?.main?.temp?.toFixed(1)}°C |{" "}
            {weather?.weather?.[0]?.description}
          </p>

          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              background: "#1e293b",
              borderRadius: "10px",
              borderLeft: `5px solid ${risk.color}`,
              color: "white",
              maxWidth: "500px",
            }}
          >
            <h3 style={{ marginBottom: "10px" }}>
              🤖 AI Risk Assessment
            </h3>

            <p>
              <strong>Risk Score:</strong> {riskScore}/100
            </p>

            <p>
              <strong>Risk Level:</strong> {risk.level}
            </p>

            <p>
              <strong>Recommendation:</strong>
              {" "}
              {risk.recommendation}
            </p>
          </div>
        </div>
        <div
  style={{
    marginTop: "20px",
    display: "flex",
    gap: "10px",
    alignItems: "center",
  }}
>
  <input
    type="text"
    value={city}
    onChange={(e) => setCity(e.target.value)}
    onKeyDown={(e) => {
  if (e.key === "Enter") handleSearch();
}}
    placeholder="Enter City..."
    style={{
      padding: "10px",
      width: "250px",
      borderRadius: "8px",
      border: "none",
      outline: "none",
    }}
  />

 <button
  onClick={handleSearch}
  style={{
    padding: "10px 18px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  }}
>
  Search
</button>
</div>

        <div className="banner-time">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="banner-clock-icon"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>

          <span>{formatBannerTime(currentTime)}</span>
        </div>
      </section>

      <section className="summary-cards-section">
        <div className="summary-cards-grid">
          {summaryCards.map((card) => (
            <div
              key={card.id}
              className={`summary-card card-${card.statusType}`}
            >
              <div className="card-header">
                <span className="card-title">
                  {card.title}
                </span>

                {card.icon}
              </div>

              <div className="card-body">
                <span className="card-value">
                  {card.value}
                </span>

                <span
                  className={`card-status status-${card.statusType}`}
                >
                  {card.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="details-layout-grid">

        <section className="details-panel recent-alerts-panel">

          <div className="panel-header">
            <h2>Recent Alerts</h2>
            <span className="panel-badge">
              LIVE FEED
            </span>
          </div>

          <div className="panel-body">
            <ul className="alerts-feed-list">
              {recentAlerts.map((alert) => (
                <li
                  key={alert.id}
                  className={`alert-feed-item border-${alert.priorityType}`}
                >
                  <div className="alert-item-main">

                    <span className="alert-message">
                      {alert.message}
                    </span>

                    <span className="alert-time">
                      {alert.time}
                    </span>

                  </div>

                  <span
                    className={`priority-badge priority-${alert.priorityType}`}
                  >
                    {alert.priority}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </section>

        <div className="details-sidebar-grid">

          <section className="details-panel system-status-panel">

            <div className="panel-header">
              <h2>System Status</h2>
            </div>

            <div className="panel-body">
              <ul className="status-list">
                {systemStatus.map((service, index) => (
                  <li
                    key={index}
                    className="status-list-item"
                  >
                    <span className="service-name">
                      {service.name}
                    </span>

                    <div className="service-health">
                      <span className="health-dot active"></span>

                      <span className="health-label">
                        {service.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

          </section>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;