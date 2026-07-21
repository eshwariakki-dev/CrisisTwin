import React, { useEffect, useState } from "react";
import { getForecast } from "../services/weatherService";
import { getLocation } from "../services/locationService";

function Predictions() {
  const [forecast, setForecast] = useState([]);
  const [city, setCity] = useState("");

  useEffect(() => {
    const fetchForecast = async () => {
      const location = getLocation();

      setCity(location.city);

      const data = await getForecast(
        location.lat,
        location.lng
      );

      if (data) {
        setForecast(data.list.slice(0, 8));
      }
    };

    fetchForecast();

    const interval = setInterval(() => {
      fetchForecast();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  const getPrediction = (item) => {
    const weather =
      item.weather[0].main.toLowerCase();

    const temp = item.main.temp;
    const wind = item.wind.speed;
    const humidity = item.main.humidity;

    let risk = "🟢 LOW";
    let prediction = "Weather is stable.";
    let recommendation =
      "Continue monitoring weather.";

    if (
      weather.includes("thunderstorm")
    ) {
      risk = "🔴 CRITICAL";

      prediction =
        "Thunderstorms are forecast during this period. Lightning, heavy rainfall and temporary power interruptions are possible.";

      recommendation =
        "Stay indoors, avoid trees and postpone unnecessary travel.";
    }

    else if (
      weather.includes("rain")
    ) {
      if (humidity > 85) {
        risk = "🔴 HIGH";

        prediction =
          "Continuous rainfall with high humidity may cause waterlogging and localized flooding.";

        recommendation =
          "Avoid low-lying roads and keep emergency kits ready.";
      }

      else {
        risk = "🟡 MEDIUM";

        prediction =
          "Rain is expected. Roads may become slippery and traffic delays are possible.";

        recommendation =
          "Drive carefully and monitor weather updates.";
      }
    }

    else if (
      temp >= 38
    ) {
      risk = "🟠 HIGH";

      prediction =
        "Very high temperatures may result in heatwave conditions.";

      recommendation =
        "Stay hydrated and avoid outdoor activity during peak afternoon hours.";
    }

    else if (
      wind >= 10
    ) {
      risk = "🟠 HIGH";

      prediction =
        "Strong winds may affect traffic and could cause minor damage to loose objects.";

      recommendation =
        "Secure outdoor items and avoid unnecessary travel.";
    }

    else if (
      weather.includes("fog") ||
      weather.includes("mist") ||
      weather.includes("haze")
    ) {
      risk = "🟡 MEDIUM";

      prediction =
        "Visibility is expected to reduce significantly.";

      recommendation =
        "Drive slowly using headlights.";
    }

    const confidence =
      risk.includes("CRITICAL")
        ? "96%"
        : risk.includes("HIGH")
        ? "90%"
        : risk.includes("MEDIUM")
        ? "80%"
        : "72%";

    return {
      risk,
      prediction,
      recommendation,
      confidence,
    };
  };
    return (
  <div className="page predictions-page">
    <div className="page-header">
      <h1>🤖 AI Disaster Intelligence</h1>
      <p>Real-time disaster risk assessment and preventive recommendations for <strong>{city}</strong>.</p>
    </div>

    {forecast.length === 0 ? (
      <h2>Loading forecast...</h2>
    ) : (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
          gap: "20px",
        }}
      >
        {forecast.slice(0, 4).map((item, index) => {
          const result = getPrediction(item);

          const borderColor = result.risk.includes("CRITICAL")
            ? "#ef4444"
            : result.risk.includes("HIGH")
            ? "#f97316"
            : result.risk.includes("MEDIUM")
            ? "#eab308"
            : "#22c55e";

          return (
            <div
              key={index}
              style={{
                background: "#1e293b",
                borderRadius: "14px",
                padding: "18px",
                borderTop: `5px solid ${borderColor}`,
                color: "white",
                boxShadow: "0 6px 15px rgba(0,0,0,0.25)",
              }}
            >
              <h3>
  🕒 {new Date(item.dt * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}
</h3>

<h2
  style={{
    color: borderColor,
    marginTop: "15px",
    marginBottom: "15px",
  }}
>
  {result.risk} RISK
</h2>

<div
  style={{
    background: "#111827",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "12px",
  }}
>
  <strong>🤖 AI Prediction</strong>

  <p style={{ marginTop: "8px" }}>
    {result.prediction}
  </p>
</div>

<div
  style={{
    background: "#111827",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "12px",
  }}
>
  <strong>⚠ Possible Impact</strong>

  <ul
    style={{
      marginTop: "8px",
      paddingLeft: "18px",
      lineHeight: "1.8",
    }}
  >
    {result.risk.includes("LOW") && (
      <>
        <li>Road conditions remain normal.</li>
        <li>No significant disaster expected.</li>
        <li>Outdoor activities are safe.</li>
      </>
    )}

    {result.risk.includes("MEDIUM") && (
      <>
        <li>Traffic delays may occur.</li>
        <li>Localized water accumulation possible.</li>
        <li>Travel with caution.</li>
      </>
    )}

    {result.risk.includes("HIGH") && (
      <>
        <li>Flooding may occur.</li>
        <li>Strong winds can affect transport.</li>
        <li>Emergency services may be required.</li>
      </>
    )}

    {result.risk.includes("CRITICAL") && (
      <>
        <li>Severe weather expected.</li>
        <li>Possible power outages.</li>
        <li>Avoid outdoor movement.</li>
      </>
    )}
  </ul>
</div>

<div
  style={{
    background: "#0f172a",
    padding: "12px",
    borderRadius: "10px",
  }}
>
  <strong>✅ Recommended Action</strong>

  <p
    style={{
      marginTop: "8px",
      lineHeight: "1.7",
    }}
  >
    {result.recommendation}
  </p>
</div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);
}

export default Predictions;