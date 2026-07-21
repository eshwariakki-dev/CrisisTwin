import axios from "axios";

const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;
const BASE_URL = "https://api.geoapify.com/v2/places";

const fetchPlaces = async (category, lat, lng, radius = 10000) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        categories: category,
        filter: `circle:${lng},${lat},${radius}`,
        bias: `proximity:${lng},${lat}`,
        limit: 20,
        apiKey: API_KEY,
      },
    });

    return response.data.features || [];
  } catch (error) {
    console.error("Geoapify Error:", error);
    return [];
  }
};

export const getNearbyHospitals = (lat, lng, radius = 10000) =>
  fetchPlaces("healthcare.hospital", lat, lng, radius);

export const getNearbyShelters = async (lat, lng, radius = 10000) => {
  const categories = [
    "education.school",
    "accommodation.hotel",
    "accommodation.guest_house",
    "religion.temple",
    "religion.church",
    "religion.mosque",
    "service.community_centre",
  ];

  try {
    const results = await Promise.all(
      categories.map((category) =>
        fetchPlaces(category, lat, lng, radius)
      )
    );

    // Merge all results
    const merged = results.flat();

    // Remove duplicates using place_id
    const unique = Array.from(
      new Map(
        merged.map((item) => [item.properties.place_id, item])
      ).values()
    );

    return unique;
  } catch (error) {
    console.error("Shelter Fetch Error:", error);
    return [];
  }
};

export const getNearbyFireStations = (lat, lng, radius = 10000) =>
  fetchPlaces("service.fire_station", lat, lng, radius);

export const getNearbyPoliceStations = (lat, lng, radius = 10000) =>
  fetchPlaces("service.police", lat, lng, radius);