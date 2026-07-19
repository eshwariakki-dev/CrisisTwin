export const getNearbyFireStations = async (lat, lon) => {
  const query = `
    [out:json];
    (
      node["amenity"="fire_station"](around:5000,${lat},${lon});
      way["amenity"="fire_station"](around:5000,${lat},${lon});
      relation["amenity"="fire_station"](around:5000,${lat},${lon});
    );
    out center;
  `;

  const response = await fetch(
    "https://overpass.kumi.systems/api/interpreter",
    {
      method: "POST",
      body: query,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch fire stations");
  }

  const data = await response.json();
  return data.elements;
};