import React, { useEffect, useState } from "react";
import { getNearbyHospitals } from "../services/geoapifyService";
import { calculateDistance } from "../utils/distance";

function Hospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospitals = async () => {
      const location =
        JSON.parse(localStorage.getItem("disasterLocation")) || {
          lat: 12.9716,
          lng: 77.5946,
        };

      const data = await getNearbyHospitals(location.lat, location.lng);

      const hospitalList = data.map((hospital) => {
        const hLat = hospital.geometry.coordinates[1];
        const hLng = hospital.geometry.coordinates[0];

        return {
          id: hospital.properties.place_id,
          name:
            hospital.properties.name ||
            "Unnamed Hospital",
          address:
            hospital.properties.formatted ||
            "Address not available",
          lat: hLat,
          lng: hLng,
          distance: calculateDistance(
            location.lat,
            location.lng,
            hLat,
            hLng
          ),
        };
      });

      hospitalList.sort(
        (a, b) => a.distance - b.distance
      );

      setHospitals(hospitalList);
      setLoading(false);
    };

    fetchHospitals();
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1>🏥 Nearby Hospitals</h1>
        <p>Nearest hospitals around the selected disaster location.</p>
      </div>

      {loading ? (
        <h3>Loading hospitals...</h3>
      ) : (
        hospitals.map((hospital) => (
          <div className="info-card" key={hospital.id}>
            <h3>{hospital.name}</h3>

            <p>
              <strong>📍 Address:</strong>
              <br />
              {hospital.address}
            </p>

            <p>
              <strong>📏 Distance:</strong>{" "}
              {hospital.distance} km
            </p>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${hospital.lat},${hospital.lng}`}
              target="_blank"
              rel="noreferrer"
            >
              🗺 Open in Google Maps
            </a>
          </div>
        ))
      )}
    </div>
  );
}

export default Hospitals;