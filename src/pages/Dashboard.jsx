import React, { useState, useEffect } from "react";
import { getWeather, getForecast } from "../services/weatherService";

function Dashboard() {

  const [currentTime, setCurrentTime] = useState(new Date());

  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  const [risk, setRisk] = useState({
    level: "Loading...",
    color: "gray",
    recommendation: "Analyzing weather...",
  });

  const [riskScore, setRiskScore] = useState(0);

  const [prediction, setPrediction] = useState("");

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const location =
  JSON.parse(localStorage.getItem("disasterLocation")) || {
    lat: 12.9716,
    lng: 77.5946,
  };

const data = await getWeather(location.lat, location.lng);
const forecastData = await getForecast(location.lat, location.lng);
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
  }, []);

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

  const disasterLocation =
  JSON.parse(localStorage.getItem("disasterLocation")) || null;

let recentAlerts = [];

if (!disasterLocation) {
  recentAlerts = [
    {
      id: 1,
      message: "🟢 No disaster location selected.",
      time: "Live",
      priority: "INFO",
      priorityType: "info",
    },
  ];
} else {
  const { lat, lng } = disasterLocation;

  // Whitefield
  if (lat >= 12.95 && lat <= 13.05 && lng >= 77.70 && lng <= 77.78) {
    recentAlerts = [
      {
        id: 1,
        message: "🚨 Flood Warning - Whitefield",
        time: "Now",
        priority: "HIGH",
        priorityType: "danger",
      },
      {
        id: 2,
        message: "🏥 Manipal Hospital assigned",
        time: "1 min ago",
        priority: "READY",
        priorityType: "success",
      },
      {
        id: 3,
        message: "🏠 Shelter Activated",
        time: "2 mins ago",
        priority: "OPEN",
        priorityType: "info",
      },
      {
        id: 4,
        message: "🚒 Rescue Team Dispatched",
        time: "3 mins ago",
        priority: "ACTIVE",
        priorityType: "warning",
      },
    ];
  }

  // Yelahanka
  else if (
    lat >= 13.06 &&
    lat <= 13.15 &&
    lng >= 77.55 &&
    lng <= 77.65
  ) {
    recentAlerts = [
      {
        id: 1,
        message: "🌬 Strong Wind Alert - Yelahanka",
        time: "Now",
        priority: "MEDIUM",
        priorityType: "warning",
      },
      {
        id: 2,
        message: "🏠 Shelter Ready",
        time: "2 mins ago",
        priority: "READY",
        priorityType: "success",
      },
      {
        id: 3,
        message: "🚓 Police Monitoring Roads",
        time: "5 mins ago",
        priority: "ACTIVE",
        priorityType: "info",
      },
      {
        id: 4,
        message: "🏥 Columbia Asia Hospital Ready",
        time: "6 mins ago",
        priority: "READY",
        priorityType: "success",
      },
    ];
  }

  // Everywhere else
  else {
    recentAlerts = [
      {
        id: 1,
        message: "🟢 No major incidents reported.",
        time: "Live",
        priority: "LOW",
        priorityType: "success",
      },
    ];
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