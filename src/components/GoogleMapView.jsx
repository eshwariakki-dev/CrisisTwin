import { useState, useEffect } from "react";
import { getWeather } from "../services/weatherService";
import { getLocation, setLocation } from "../services/locationService";
import { useMap } from "react-leaflet";
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
      const current = getLocation();

const location = {
  city: current.city,
  lat: e.latlng.lat,
  lng: e.latlng.lng,
};


setLocation(location);

onSelect(location);
    },
  });

  return null;
}
function ChangeMapView({ center }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}
export default function GoogleMapView() {

  const [selectedLocation, setSelectedLocation] =
  useState(getLocation());

 const [nearbyHospitals, setNearbyHospitals] = useState([]);
const [nearbyShelters, setNearbyShelters] = useState([]);
const [nearbyFireStations, setNearbyFireStations] = useState([]);
const [nearbyPoliceStations, setNearbyPoliceStations] = useState([]);
    const [weather, setWeather] = useState(null);
const [riskColor, setRiskColor] = useState("green");
const [riskLevel, setRiskLevel] = useState("LOW");
useEffect(() => {
  setSelectedLocation(getLocation());
}, []);

  useEffect(() => {

   const fetchNearbyPlaces = async () => {
  const radius = 5000;

  const query = `
  [out:json];
  (
    node["amenity"="hospital"](around:${radius},${selectedLocation.lat},${selectedLocation.lng});
    node["amenity"="police"](around:${radius},${selectedLocation.lat},${selectedLocation.lng});
    node["amenity"="fire_station"](around:${radius},${selectedLocation.lat},${selectedLocation.lng});
    node["amenity"="shelter"](around:${radius},${selectedLocation.lat},${selectedLocation.lng});
  );
  out body;
  `;

  try {
  const response = await fetch(
    "https://overpass.kumi.systems/api/interpreter",
    {
      method: "POST",
      body: query,
    }
  );

  const data = await response.json();
  console.log(data.elements);

  // Rest of your code...
} catch (err) {
  console.error("Overpass API Error:", err);
}

  const data = await response.json();
  console.log(data.elements);

  const hospitals = [];
  const shelters = [];
  const fireStations = [];
  const policeStations = [];

  data.elements.forEach((place) => {
    const obj = {
      id: place.id,
      name: place.tags?.name || "Unknown",
      lat: place.lat,
      lng: place.lon,
    };

    if (place.tags.amenity === "hospital")
      hospitals.push(obj);

    if (place.tags.amenity === "shelter")
      shelters.push(obj);

    if (place.tags.amenity === "fire_station")
      fireStations.push(obj);

    if (place.tags.amenity === "police")
      policeStations.push(obj);
  });

  setNearbyHospitals(hospitals);
  setNearbyShelters(shelters);
  setNearbyFireStations(fireStations);
  setNearbyPoliceStations(policeStations);
};

fetchNearbyPlaces();
    const loadWeather = async () => {
  try {
    const location = getLocation();

const data = await getWeather(location.city);

    setWeather(data);

    let score = 0;

    if (data.weather[0].main === "Rain") score += 40;
    if (data.weather[0].main === "Thunderstorm") score += 60;
    if (data.wind.speed >= 8) score += 20;
    if (data.main.temp >= 35) score += 20;

    if (score >= 60) {
      setRiskLevel("HIGH");
      setRiskColor("red");
    } else if (score >= 30) {
      setRiskLevel("MEDIUM");
      setRiskColor("orange");
    } else {
      setRiskLevel("LOW");
      setRiskColor("green");
    }
  } catch (err) {
    console.log(err);
  }
};

loadWeather();

  }, [selectedLocation]);

  return (
    <MapContainer
     center={[
  selectedLocation.lat,
  selectedLocation.lng,
]}
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
      <ChangeMapView
  center={[
    selectedLocation.lat,
    selectedLocation.lng,
  ]}
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
          color: riskColor,
fillColor: riskColor,
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
  <h3>🚨 Disaster Zone</h3>

  <p><strong>Risk:</strong> {riskLevel}</p>

  <p><strong>Weather:</strong> {weather?.weather?.[0]?.main}</p>

  <p><strong>Temperature:</strong> {weather?.main?.temp?.toFixed(1)}°C</p>

  <p><strong>Humidity:</strong> {weather?.main?.humidity}%</p>

  <p><strong>Wind:</strong> {weather?.wind?.speed} m/s</p>
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