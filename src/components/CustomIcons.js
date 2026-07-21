import L from "leaflet";
import "leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css";
import "leaflet-extra-markers";

export const hospitalIcon = L.ExtraMarkers.icon({
  icon: "fa-hospital",
  markerColor: "green",
  shape: "circle",
  prefix: "fa",
});

export const shelterIcon = L.ExtraMarkers.icon({
  icon: "fa-house",
  markerColor: "blue",
  shape: "circle",
  prefix: "fa",
});

export const floodIcon = L.ExtraMarkers.icon({
  icon: "fa-water",
  markerColor: "red",
  shape: "circle",
  prefix: "fa",
});

export const rescueIcon = L.ExtraMarkers.icon({
  icon: "fa-truck-medical",
  markerColor: "orange",
  shape: "circle",
  prefix: "fa",
});