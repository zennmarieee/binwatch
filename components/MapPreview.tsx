"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { bins } from "@/data/bins";

const USTP_CENTER: [number, number] = [8.4858347, 124.6564369];

function createBinIcon(fillColor: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
      <path d="M22 12h20l2 6H20l2-6Zm-4 8h28l-3 30c-.3 3-2.8 5-5.8 5H27.8c-3 0-5.5-2-5.8-5L18 20Zm8 7a2 2 0 0 0-2 2v12a2 2 0 1 0 4 0V29a2 2 0 0 0-2-2Zm8 0a2 2 0 0 0-2 2v12a2 2 0 1 0 4 0V29a2 2 0 0 0-2-2Zm8 0a2 2 0 0 0-2 2v12a2 2 0 1 0 4 0V29a2 2 0 0 0-2-2Z" fill="${fillColor}" stroke="#1f2937" stroke-width="2" stroke-linejoin="round"/>
    </svg>`;

  return new L.Icon({
    iconUrl: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -30],
  });
}

export default function MapPreview() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    try {
      const container = mapContainerRef.current;

      const map = L.map(container, {
        center: USTP_CENTER,
        zoom: 17,
        minZoom: 16,
        maxZoom: 19,
        zoomSnap: 0.5,
        zoomDelta: 0.5,
      });

      mapRef.current = map;

      // Add tile layer (OSM)
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      // Invalidate size to render properly
      setTimeout(() => {
        map.invalidateSize();
      }, 100);

      // Create icons
      const greenIcon = createBinIcon("#2a9d8f");
      const redIcon = createBinIcon("#d62828");

      // Add bin markers from bins.ts
      bins.forEach((bin) => {
        const icon = bin.status === "overflow" ? redIcon : greenIcon;

        L.marker([bin.lat, bin.lng], { icon }).addTo(map).bindPopup(`
            <b>${bin.name}</b><br/>
            Status: ${bin.status}
          `);
      });
    } catch (error) {
      console.error("MapPreview Error:", error);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full flex flex-col gap-3">
      <div
        ref={mapContainerRef}
        className="w-full rounded-xl overflow-hidden"
        style={{ height: "320px" }}
      />

      <div className="text-xs space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-600"></span>
          <span className="text-gray-600">Overflow bin</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-teal-600"></span>
          <span className="text-gray-600">Available bin</span>
        </div>
      </div>
    </div>
  );
}
