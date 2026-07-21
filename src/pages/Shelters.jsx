import React, { useEffect, useState } from "react";
import { getNearbyShelters } from "../services/geoapifyService";
import { calculateDistance } from "../utils/distance";

function Shelters() {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShelters = async () => {
      const location =
        JSON.parse(localStorage.getItem("disasterLocation")) || {
          lat: 12.9716,
          lng: 77.5946,
        };

      const data = await getNearbyShelters(
        location.lat,
        location.lng
      );

      const shelterList = data.map((shelter) => {
        const sLat = shelter.geometry.coordinates[1];
        const sLng = shelter.geometry.coordinates[0];

        return {
          id: shelter.properties.place_id,
          name:
            shelter.properties.name ||
            "Unnamed Shelter",
          address:
            shelter.properties.formatted ||
            "Address not available",
          lat: sLat,
          lng: sLng,
          distance: calculateDistance(
            location.lat,
            location.lng,
            sLat,
            sLng
          ),
        };
      });

      shelterList.sort(
        (a, b) => a.distance - b.distance
      );

      setShelters(shelterList);
      setLoading(false);
    };

    fetchShelters();
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1>🏠 Nearby Shelters</h1>
        <p>
          Emergency shelters around the selected
          disaster location.
        </p>
      </div>

      {loading ? (
        <h3>Loading shelters...</h3>
      ) : shelters.length === 0 ? (
        <h3>No shelters found nearby.</h3>
      ) : (
        shelters.map((shelter) => (
          <div className="info-card" key={shelter.id}>
            <h3>{shelter.name}</h3>

            <p>
              <strong>📍 Address:</strong>
              <br />
              {shelter.address}
            </p>

            <p>
              <strong>📏 Distance:</strong>{" "}
              {shelter.distance} km
            </p>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${shelter.lat},${shelter.lng}`}
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

export default Shelters;