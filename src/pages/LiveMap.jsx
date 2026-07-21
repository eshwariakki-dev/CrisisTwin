import React from "react";
import GoogleMapView from "../components/GoogleMapView";

function LiveMap() {
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

          {/* Weather */}
          <div className="info-card">
            <h3>🌦 Live Weather</h3>
            <p>Connected to OpenWeather API</p>
            <p>Current weather is displayed in the map popup.</p>
          </div>

          {/* Disaster */}
          <div className="info-card">
            <h3>🚨 Disaster Risk</h3>
            <p>Flood Risk : Dynamic</p>
            <p>Fire Risk : Dynamic</p>
            <p>Landslide Risk : Dynamic</p>
          </div>

          {/* AI */}
          <div className="info-card">
            <h3>🤖 AI Recommendation</h3>
            <p>
              AI recommendations are generated using the current weather
              conditions and calculated disaster risk.
            </p>
          </div>

         

        </div>
      </div>
    </div>
  );
}

export default LiveMap;