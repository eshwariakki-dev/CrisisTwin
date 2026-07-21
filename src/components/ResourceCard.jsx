import React from "react";

function ResourceCard({ resource }) {
  const displayName =
    resource.name === "Unnamed Resource"
      ? resource.address.split(",")[0]
      : resource.name;

  return (
    <div className="resource-card">
      <h3>{displayName}</h3>

      <p>
        <strong>📍 Address:</strong>
        <br />
        {resource.address}
      </p>

      <p>
        <strong>📏 Distance:</strong> {resource.distance} km
      </p>

      <a
        href={`https://www.google.com/maps/search/?api=1&query=${resource.lat},${resource.lng}`}
        target="_blank"
        rel="noreferrer"
      >
        🗺 Open in Google Maps
      </a>
    </div>
  );
}

export default ResourceCard;