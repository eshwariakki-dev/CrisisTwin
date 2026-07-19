import React, { useEffect, useState } from "react";
import { getForecast } from "../services/weatherService";

function Predictions() {
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
  const fetchForecast = async () => {
    const location =
  JSON.parse(localStorage.getItem("disasterLocation")) || {
    lat: 12.9716,
    lng: 77.5946,
  };

const data = await getForecast(location.lat, location.lng);

    if (data) {
      setForecast(data.list.slice(0, 3));
    }
  };

  // Initial fetch
  fetchForecast();

  // Refresh every 5 minutes
  const interval = setInterval(() => {
    fetchForecast();
  }, 5 * 60 * 1000);

  // Cleanup
  return () => clearInterval(interval);
}, []);
  return (
    <div className="page predictions-page">
      <h1>🔮 Disaster Predictions</h1>

      {forecast.length === 0 ? (
        <p>Loading forecast...</p>
      ) : (
        forecast.map((item, index) => {
          let risk = "🟢 LOW";

          if (item.weather[0].main === "Rain") {
            risk = "🟡 MEDIUM";
          }

          if (item.weather[0].main === "Thunderstorm") {
            risk = "🔴 HIGH";
          }

          return (
            <div
              key={index}
              style={{
                background: "#1e293b",
                color: "white",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "10px",
              }}
            >
              <h3>{item.dt_txt}</h3>

              <p>
                <strong>Weather:</strong>{" "}
                {item.weather[0].description}
              </p>

              <p>
                <strong>Temperature:</strong>{" "}
                {item.main.temp} °C
              </p>

              <p>
                <strong>Humidity:</strong>{" "}
                {item.main.humidity}%
              </p>

              <p>
                <strong>Wind Speed:</strong>{" "}
                {item.wind.speed} m/s
              </p>

              <p>
                <strong>Risk:</strong> {risk}
              </p>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Predictions;