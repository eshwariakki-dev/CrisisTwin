import React from "react";
import { shelters } from "../data/resources";

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

function Shelters() {
  const disasterLocation =
    JSON.parse(localStorage.getItem("disasterLocation")) || {
      lat: 12.9716,
      lng: 77.5946,
    };

  const sortedShelters = [...shelters]
    .map((shelter) => ({
      ...shelter,
      distance: calculateDistance(
        disasterLocation.lat,
        disasterLocation.lng,
        shelter.lat,
        shelter.lng
      ),
    }))
    .sort((a, b) => a.distance - b.distance);

  return (
    <div className="page">
      <h1>🏕 Emergency Shelters</h1>

      <p>Nearest shelters based on the selected disaster location.</p>

      {sortedShelters.map((shelter, index) => (
        <div
          key={shelter.id}
          style={{
            background: "#1e293b",
            color: "white",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "15px",
          }}
        >
          <h2>
            #{index + 1} {shelter.name}
          </h2>

          <p>
            <strong>Distance:</strong>{" "}
            {shelter.distance.toFixed(2)} km
          </p>

          <p>
            <strong>Latitude:</strong> {shelter.lat}
          </p>

          <p>
            <strong>Longitude:</strong> {shelter.lng}
          </p>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${shelter.lat},${shelter.lng}`}
            target="_blank"
            rel="noreferrer"
            style={{
              color: "#38bdf8",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            📍 Open in Google Maps
          </a>
        </div>
      ))}
    </div>
  );
}

export default Shelters;