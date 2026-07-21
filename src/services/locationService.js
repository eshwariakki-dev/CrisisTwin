// src/services/locationService.js

const DEFAULT_LOCATION = {
  city: "Bengaluru",
  lat: 12.9716,
  lng: 77.5946,
};

export const getLocation = () => {
  const saved = localStorage.getItem("disasterLocation");

  if (!saved) return DEFAULT_LOCATION;

  try {
    return JSON.parse(saved);
  } catch {
    return DEFAULT_LOCATION;
  }
};

export const setLocation = (location) => {
  localStorage.setItem(
    "disasterLocation",
    JSON.stringify(location)
  );
};

export default DEFAULT_LOCATION;