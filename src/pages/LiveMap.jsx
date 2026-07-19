import React, { useEffect, useState } from "react";
import GoogleMapView from "../components/GoogleMapView";
import { getNearbyHospitals } from "../services/hospitalService";

function LiveMap() {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const loadHospitals = async () => {
      try {
        const data = await getNearbyHospitals(12.9716, 77.5946);
        setHospitals(data);
      } catch (error) {
        console.error("Error loading hospitals:", error);
      }
    };

    loadHospitals();
  }, []);

  return (
    <div className="page live-map-page">
      <div className="page-header">
        <h1>Live Disaster Map</h1>
        <p>Real-time monitoring of disaster affected areas.</p>
      </div>

      <div className="live-map-container">

        {/* Left Side */}
        <div className="map-section">
          <GoogleMapView />
        </div>

        {/* Right Side */}
        <div className="info-section">

          <div className="info-card">
            <h3>🌦 Weather</h3>
            <p>Temperature : 29°C</p>
            <p>Humidity : 84%</p>
            <p>Wind : 18 km/h</p>
          </div>

          <div className="info-card">
            <h3>🚨 Active Disaster</h3>
            <p>Flood Risk : High</p>
            <p>Fire Risk : Low</p>
            <p>Landslide : Moderate</p>
          </div>

          <div className="info-card">
            <h3>🤖 AI Recommendation</h3>
            <p>
              Heavy rainfall expected.
              Deploy rescue teams near Zone 4.
            </p>
          </div>

          <div className="info-card">
            <h3>🏥 Nearby Hospitals</h3>

            {hospitals.length === 0 ? (
              <p>Loading hospitals...</p>
            ) : (
              hospitals.slice(0, 5).map((hospital) => (
                <div
                  key={hospital.id}
                  style={{
                    marginBottom: "12px",
                    borderBottom: "1px solid #444",
                    paddingBottom: "8px",
                  }}
                >
                  <strong>
                    {hospital.tags?.name || "Unnamed Hospital"}
                  </strong>

                  <br />

                  <small>
                    Latitude: {hospital.lat || hospital.center?.lat}
                  </small>

                  <br />

                  <small>
                    Longitude: {hospital.lon || hospital.center?.lon}
                  </small>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default LiveMap;