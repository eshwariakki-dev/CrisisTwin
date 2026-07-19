import React from "react";
import {
  hospitals,
  fireStations,
  policeStations,
  shelters,
} from "../data/resources";

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

function getNearest(location, places) {
  return places
    .map((place) => ({
      ...place,
      distance: calculateDistance(
        location.lat,
        location.lng,
        place.lat,
        place.lng
      ),
    }))
    .sort((a, b) => a.distance - b.distance)[0];
}

function Resources() {
  const disasterLocation =
    JSON.parse(localStorage.getItem("disasterLocation")) || {
      lat: 12.9716,
      lng: 77.5946,
    };

  const nearestHospital = getNearest(disasterLocation, hospitals);
  const nearestFire = getNearest(disasterLocation, fireStations);
  const nearestPolice = getNearest(disasterLocation, policeStations);
  const nearestShelter = getNearest(disasterLocation, shelters);

  const resources = [
    {
      icon: "🚑",
      name: "Ambulance Service",
      status: "🟢 Available",
      nearest: nearestHospital.name,
      distance: nearestHospital.distance.toFixed(2) + " km",
      response: `${Math.max(
        3,
        Math.round(nearestHospital.distance * 2)
      )} mins`,
      number: "108",
    },
    {
      icon: "🚒",
      name: "Fire & Rescue",
      status: "🟢 Available",
      nearest: nearestFire.name,
      distance: nearestFire.distance.toFixed(2) + " km",
      response: `${Math.max(
        3,
        Math.round(nearestFire.distance * 2)
      )} mins`,
      number: "101",
    },
    {
      icon: "🚓",
      name: "Police",
      status: "🟢 Available",
      nearest: nearestPolice.name,
      distance: nearestPolice.distance.toFixed(2) + " km",
      response: `${Math.max(
        3,
        Math.round(nearestPolice.distance * 2)
      )} mins`,
      number: "100",
    },
    {
      icon: "🏠",
      name: "Emergency Shelter",
      status: "🟢 Beds Available",
      nearest: nearestShelter.name,
      distance: nearestShelter.distance.toFixed(2) + " km",
      response: "Ready",
      number: "Help Desk",
    },
    {
      icon: "📞",
      name: "National Emergency",
      status: "24×7 Active",
      nearest: "India Emergency Service",
      distance: "--",
      response: "Immediate",
      number: "112",
    },
  ];

  return (
    <div className="page">
      <h1>🚨 Emergency Resources</h1>

      <p>Nearest emergency resources based on the selected disaster location.</p>

      {resources.map((resource, index) => (
        <div
          key={index}
          style={{
            background: "#1e293b",
            color: "white",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "18px",
          }}
        >
          <h2>
            {resource.icon} {resource.name}
          </h2>

          <p>
            <strong>Status:</strong> {resource.status}
          </p>

          <p>
            <strong>Nearest Resource:</strong> {resource.nearest}
          </p>

          <p>
            <strong>Distance:</strong> {resource.distance}
          </p>

          <p>
            <strong>Estimated Response:</strong> {resource.response}
          </p>

          <p>
            <strong>Emergency Contact:</strong> {resource.number}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Resources;