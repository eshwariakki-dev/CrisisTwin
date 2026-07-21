import React, { useEffect, useState } from "react";
import ResourceTabs from "../components/ResourceTabs";
import ResourceCard from "../components/ResourceCard";
import {
  getNearbyHospitals,
  getNearbyShelters,
  getNearbyFireStations,
  getNearbyPoliceStations,
} from "../services/geoapifyService";
import { getLocation } from "../services/locationService";
import { calculateDistance } from "../utils/distance";
import "../styles/resources.css";

function Resources() {
  const [activeTab, setActiveTab] = useState("hospital");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [radius, setRadius] = useState(10000);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchResources();
  }, [activeTab, radius]);

  const fetchResources = async () => {
    setLoading(true);

    try {
      const location = getLocation();

      let data = [];

      switch (activeTab) {
        case "hospital":
          data = await getNearbyHospitals(
            location.lat,
            location.lng,
            radius
          );
          break;

        case "shelter":
          data = await getNearbyShelters(
            location.lat,
            location.lng,
            radius
          );
          break;

        case "fire":
          data = await getNearbyFireStations(
            location.lat,
            location.lng,
            radius
          );
          break;

        case "police":
          data = await getNearbyPoliceStations(
            location.lat,
            location.lng,
            radius
          );
          break;

        default:
          data = [];
      }

      const list = data.map((item) => {
        const lat = item.geometry.coordinates[1];
        const lng = item.geometry.coordinates[0];

        return {
          id: item.properties.place_id,
          name: item.properties.name || "Unknown",
          address:
            item.properties.formatted || "No address available",
          lat,
          lng,
          distance: calculateDistance(
            location.lat,
            location.lng,
            lat,
            lng
          ),
          phone:
            item.properties.contact?.phone || "Not Available",
        };
      });

      list.sort((a, b) => a.distance - b.distance);

      setResources(list);
    } catch (error) {
      console.error("Resources Error:", error);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = resources.filter((resource) =>
    resource.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1>🚨 Emergency Resources</h1>
        <p>Resources near the selected disaster location.</p>
      </div>

      <div className="resource-controls">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
        >
          <option value={5000}>5 km</option>
          <option value={10000}>10 km</option>
          <option value={20000}>20 km</option>
          <option value={50000}>50 km</option>
        </select>
      </div>

      <ResourceTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {loading ? (
        <h3>Loading...</h3>
      ) : filteredResources.length === 0 ? (
        <h3>No resources found.</h3>
      ) : (
        <div className="resource-grid">
          {filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Resources;