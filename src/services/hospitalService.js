export const getNearbyHospitals = async (lat, lon) => {
  const query = `
    [out:json];
    (
      node["amenity"="hospital"](around:5000,${lat},${lon});
      way["amenity"="hospital"](around:5000,${lat},${lon});
      relation["amenity"="hospital"](around:5000,${lat},${lon});
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

  const data = await response.json();

  return data.elements;
};