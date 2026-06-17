"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import type { MarketLocation } from "../types/market.types";
import "leaflet/dist/leaflet.css";

// Fix default icon paths (required in Next.js)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const TYPE_COLORS: Record<string, string> = {
  APMC: "#16a34a",
  Wholesale: "#2563eb",
  Retail: "#f97316",
  Export: "#7c3aed",
};

function createIcon(type: MarketLocation["type"]) {
  const color = TYPE_COLORS[type] ?? "#374151";
  return L.divIcon({
    className: "",
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

function RecenterMap({ locations }: { locations: MarketLocation[] }) {
  const map = useMap();
  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map((l) => [l.latitude, l.longitude]));
      map.fitBounds(bounds, { padding: [32, 32] });
    }
  }, [locations, map]);
  return null;
}

interface LeafletMapInnerProps {
  locations: MarketLocation[];
}

export default function LeafletMapInner({ locations }: LeafletMapInnerProps) {
  const center: [number, number] = [19.7515, 75.7139]; // Maharashtra center

  return (
    <MapContainer
      center={center}
      zoom={7}
      style={{ height: "100%", width: "100%", background: "#f8fafc" }}
      aria-label="Market locations map"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <RecenterMap locations={locations} />
      {locations.map((loc) => (
        <Marker key={loc.id} position={[loc.latitude, loc.longitude]} icon={createIcon(loc.type)}>
          <Popup>
            <div className="space-y-1 text-sm">
              <p className="font-bold">{loc.name}</p>
              <p className="text-gray-500">
                {loc.district}, {loc.state}
              </p>
              <p>
                <span className="font-medium">Type:</span> {loc.type}
              </p>
              <p>
                <span className="font-medium">Timings:</span> {loc.timings}
              </p>
              <p>
                <span className="font-medium">Distance:</span> {loc.distance} km
              </p>
              {loc.topCrops.length > 0 && (
                <p>
                  <span className="font-medium">Top Crops:</span> {loc.topCrops.join(", ")}
                </p>
              )}
            </div>
          </Popup>
          {/* Demand zone radius circle */}
          <Circle
            center={[loc.latitude, loc.longitude]}
            radius={8000}
            pathOptions={{
              color: TYPE_COLORS[loc.type] ?? "#374151",
              fillColor: TYPE_COLORS[loc.type] ?? "#374151",
              fillOpacity: 0.05,
              weight: 1,
            }}
          />
        </Marker>
      ))}
    </MapContainer>
  );
}
