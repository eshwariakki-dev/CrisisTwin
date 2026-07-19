import { useState, useEffect } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMapEvents,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import {
  hospitals,
  fireStations,
  policeStations,
  shelters,
} from "../data/resources";

const DEFAULT_LOCATION = {
  lat: 12.9716,
  lng: 77.5946,
};

// ---------------- ICONS ----------------

const disasterIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const hospitalIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const shelterIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const fireIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const policeIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// ---------------- DISTANCE ----------------

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function sortByDistance(resources, location) {
  return [...resources].sort((a, b) => {
    return (
      calculateDistance(
        location.lat,
        location.lng,
        a.lat,
        a.lng
      ) -
      calculateDistance(
        location.lat,
        location.lng,
        b.lat,
        b.lng
      )
    );
  });
}

// ---------------- MAP CLICK ----------------

function LocationSelector({ onSelect }) {
  useMapEvents({
    click(e) {
      const location = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      };

      localStorage.setItem(
        "disasterLocation",
        JSON.stringify(location)
      );

      onSelect(location);
    },
  });

  return null;
}
export default function GoogleMapView() {

  const [selectedLocation, setSelectedLocation] =
    useState(DEFAULT_LOCATION);

  const [nearbyHospitals, setNearbyHospitals] =
    useState([]);

  const [nearbyShelters, setNearbyShelters] =
    useState([]);

  const [nearbyFireStations, setNearbyFireStations] =
    useState([]);

  const [nearbyPoliceStations, setNearbyPoliceStations] =
    useState([]);

  useEffect(() => {

    setNearbyHospitals(
      sortByDistance(hospitals, selectedLocation)
    );

    setNearbyShelters(
      sortByDistance(shelters, selectedLocation)
    );

    setNearbyFireStations(
      sortByDistance(fireStations, selectedLocation)
    );

    setNearbyPoliceStations(
      sortByDistance(policeStations, selectedLocation)
    );

  }, [selectedLocation]);

  return (
    <MapContainer
      center={[DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng]}
      zoom={13}
      style={{
        height: "600px",
        width: "100%",
        borderRadius: "12px",
      }}
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationSelector
        onSelect={setSelectedLocation}
      />

      <Circle
        center={[
          selectedLocation.lat,
          selectedLocation.lng,
        ]}
        radius={500}
        pathOptions={{
          color: "red",
          fillColor: "red",
          fillOpacity: 0.25,
        }}
      />

      <Marker
        position={[
          selectedLocation.lat,
          selectedLocation.lng,
        ]}
        icon={disasterIcon}
      >
        <Popup>
          <b>🚨 Disaster Location</b>
        </Popup>
      </Marker>
            {/* Hospitals */}
      {nearbyHospitals.map((hospital) => {
        const distance = calculateDistance(
          selectedLocation.lat,
          selectedLocation.lng,
          hospital.lat,
          hospital.lng
        );

        return (
          <Marker
            key={`hospital-${hospital.id}`}
            position={[hospital.lat, hospital.lng]}
            icon={hospitalIcon}
          >
            <Popup>
              <h3>🏥 {hospital.name}</h3>

              <p>
                <strong>Distance:</strong>{" "}
                {distance.toFixed(2)} km
              </p>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${hospital.lat},${hospital.lng}`}
                target="_blank"
                rel="noreferrer"
              >
                🧭 Open in Google Maps
              </a>
            </Popup>
          </Marker>
        );
      })}

      {/* Shelters */}
      {nearbyShelters.map((shelter) => {
        const distance = calculateDistance(
          selectedLocation.lat,
          selectedLocation.lng,
          shelter.lat,
          shelter.lng
        );

        return (
          <Marker
            key={`shelter-${shelter.id}`}
            position={[shelter.lat, shelter.lng]}
            icon={shelterIcon}
          >
            <Popup>
              <h3>🏠 {shelter.name}</h3>

              <p>
                <strong>Distance:</strong>{" "}
                {distance.toFixed(2)} km
              </p>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${shelter.lat},${shelter.lng}`}
                target="_blank"
                rel="noreferrer"
              >
                🧭 Open in Google Maps
              </a>
            </Popup>
          </Marker>
        );
      })}

      {/* Fire Stations */}
      {nearbyFireStations.map((station) => {
        const distance = calculateDistance(
          selectedLocation.lat,
          selectedLocation.lng,
          station.lat,
          station.lng
        );

        return (
          <Marker
            key={`fire-${station.id}`}
            position={[station.lat, station.lng]}
            icon={fireIcon}
          >
            <Popup>
              <h3>🚒 {station.name}</h3>

              <p>
                <strong>Distance:</strong>{" "}
                {distance.toFixed(2)} km
              </p>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${station.lat},${station.lng}`}
                target="_blank"
                rel="noreferrer"
              >
                🧭 Open in Google Maps
              </a>
            </Popup>
          </Marker>
        );
      })}

      {/* Police Stations */}
      {nearbyPoliceStations.map((station) => {
        const distance = calculateDistance(
          selectedLocation.lat,
          selectedLocation.lng,
          station.lat,
          station.lng
        );

        return (
          <Marker
            key={`police-${station.id}`}
            position={[station.lat, station.lng]}
            icon={policeIcon}
          >
            <Popup>
              <h3>🚓 {station.name}</h3>

              <p>
                <strong>Distance:</strong>{" "}
                {distance.toFixed(2)} km
              </p>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${station.lat},${station.lng}`}
                target="_blank"
                rel="noreferrer"
              >
                🧭 Open in Google Maps
              </a>
            </Popup>
          </Marker>
        );
      })}

    </MapContainer>
  );
}