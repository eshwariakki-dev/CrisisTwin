import React from "react";
import { hospitals } from "../data/resources";

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function Hospitals() {

  const disasterLocation =
    JSON.parse(localStorage.getItem("disasterLocation")) || {
      lat: 12.9716,
      lng: 77.5946,
    };

  console.log("Disaster Location:", disasterLocation);

  const sortedHospitals = [...hospitals]
    .map((hospital) => ({
      ...hospital,
      distance: calculateDistance(
        disasterLocation.lat,
        disasterLocation.lng,
        hospital.lat,
        hospital.lng
      ),
    }))
    .sort((a, b) => a.distance - b.distance);

  return (
    <div className="page">
      <h1>🏥 Emergency Hospitals</h1>

      <p>Hospitals nearest to the current disaster location.</p>

      {sortedHospitals.map((hospital) => (
        <div
          key={hospital.id}
          style={{
            background: "#1e293b",
            color: "white",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "15px",
          }}
        >
          <h2>{hospital.name}</h2>

          <p>
            <strong>Distance:</strong>{" "}
            {hospital.distance.toFixed(2)} km
          </p>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${hospital.lat},${hospital.lng}`}
            target="_blank"
            rel="noreferrer"
            style={{
              color: "#38bdf8",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            📍 View on Google Maps
          </a>
        </div>
      ))}
    </div>
  );
}

export default Hospitals;