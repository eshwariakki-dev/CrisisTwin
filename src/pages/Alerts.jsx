import React from "react";

function Alerts() {
  const disasterLocation =
    JSON.parse(localStorage.getItem("disasterLocation")) || {
      lat: 12.9716,
      lng: 77.5946,
    };

  let area = "Central Bengaluru";
  let alerts = [];

  // Whitefield
  if (disasterLocation.lng > 77.72) {
    area = "Whitefield";

    alerts = [
      {
        color: "#dc2626",
        severity: "🔴 HIGH",
        title: "Flood Warning",
        status: "Active",
        desc: "Heavy rainfall may cause flooding and waterlogging.",
        action:
          "Deploy rescue teams, open nearby shelters, and alert hospitals.",
      },
      {
        color: "#2563eb",
        severity: "🔵 INFO",
        title: "Hospital Alert",
        status: "Ready",
        desc: "Nearest hospital is prepared for emergency admissions.",
        action: "Route injured citizens to the nearest hospital.",
      },
    ];
  }

  // Yelahanka
  else if (disasterLocation.lat > 13.05) {
    area = "Yelahanka";

    alerts = [
      {
        color: "#f97316",
        severity: "🟠 MEDIUM",
        title: "Strong Wind Alert",
        status: "Monitoring",
        desc: "Strong winds expected over the next few hours.",
        action:
          "Keep emergency teams on standby and secure loose structures.",
      },
      {
        color: "#16a34a",
        severity: "🟢 LOW",
        title: "Shelter Update",
        status: "Available",
        desc: "Nearest shelter has sufficient capacity.",
        action: "Direct evacuees to the nearest shelter if required.",
      },
    ];
  }

  // Jayanagar
  else if (disasterLocation.lat < 12.94) {
    area = "Jayanagar";

    alerts = [
      {
        color: "#f97316",
        severity: "🟠 MEDIUM",
        title: "Heavy Rain Alert",
        status: "Active",
        desc: "Continuous rainfall may affect traffic movement.",
        action:
          "Monitor drainage systems and divert traffic where necessary.",
      },
      {
        color: "#2563eb",
        severity: "🔵 INFO",
        title: "Traffic Advisory",
        status: "Monitoring",
        desc: "Slow traffic expected due to waterlogging.",
        action: "Use alternate emergency routes.",
      },
    ];
  }

  // Rajajinagar
  else if (disasterLocation.lng < 77.56) {
    area = "Rajajinagar";

    alerts = [
      {
        color: "#eab308",
        severity: "🟡 LOW",
        title: "Heat Alert",
        status: "Monitoring",
        desc: "High temperatures expected this afternoon.",
        action:
          "Issue heat advisories and keep medical teams prepared.",
      },
      {
        color: "#16a34a",
        severity: "🟢 INFO",
        title: "Resource Status",
        status: "Available",
        desc: "Emergency resources are available nearby.",
        action: "Continue monitoring the situation.",
      },
    ];
  }

  // Default
  else {
    area = "Central Bengaluru";

    alerts = [
      {
        color: "#2563eb",
        severity: "🔵 INFO",
        title: "Weather Update",
        status: "Monitoring",
        desc: "Weather conditions are stable.",
        action: "Continue routine monitoring.",
      },
    ];
  }

  return (
    <div className="page">
      <h1>🚨 Live Disaster Alerts</h1>

      <p>
        AI-generated alerts for <strong>{area}</strong>.
      </p>

      {alerts.map((alert, index) => (
        <div
          key={index}
          style={{
            background: "#1e293b",
            color: "white",
            padding: "20px",
            borderLeft: `8px solid ${alert.color}`,
            borderRadius: "10px",
            marginBottom: "18px",
          }}
        >
          <h2>{alert.severity}</h2>

          <h3>{alert.title}</h3>

          <p>
            <strong>📍 Location:</strong> {area}
          </p>

          <p>
            <strong>📡 Status:</strong> {alert.status}
          </p>

          <p>
            <strong>⚠ Description:</strong> {alert.desc}
          </p>

          <p>
            <strong>🤖 AI Recommendation:</strong> {alert.action}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Alerts;