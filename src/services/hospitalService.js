export const getNearbyHospitals = async (lat, lon) => {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="hospital"](around:5000,${lat},${lon});
      way["amenity"="hospital"](around:5000,${lat},${lon});
      relation["amenity"="hospital"](around:5000,${lat},${lon});
    );
    out center;
  `;

  try {
    const response = await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method: "POST",
        body: query,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }

    const data = await response.json();

    return data.elements || [];
  } catch (error) {
    console.error("Hospital API Error:", error);
    return [];
  }
};