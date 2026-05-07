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
      const bounds: L.LatLngBoundsExpression = [
        [8.48, 124.65],
        [8.491, 124.662],
      ];
      const container = mapContainerRef.current;

      const map = L.map(container, {
        center: USTP_CENTER,
        zoom: 17,
        minZoom: 16,
        maxZoom: 19,
        zoomSnap: 0.5,
        zoomDelta: 0.5,
        maxBounds: bounds,
        maxBoundsViscosity: 1.0,
      });

      mapRef.current = map;

      // Add tile layer (OSM)
      // L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      //   attribution: "&copy; OpenStreetMap contributors",
      //   maxZoom: 19,
      // }).addTo(map);

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution: "&copy; OpenStreetMap & CARTO",
          maxZoom: 19,
        },
      ).addTo(map);

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
    <div className="flex w-full flex-col gap-3">
      <div
        ref={mapContainerRef}
        className="w-full overflow-hidden rounded-xl"
        style={{ height: "320px" }}
      />

      <div className="rounded-xl border border-white/50 bg-white/90 px-3 py-2.5 text-xs text-[#1f3340] backdrop-blur-sm">
        <p className="mb-2 font-semibold uppercase tracking-wide text-[#2a4a5c]">
          Legend
        </p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-600 ring-2 ring-red-100" />
            <span className="font-medium">Overflow bin</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-teal-600 ring-2 ring-teal-100" />
            <span className="font-medium">Available bin</span>
          </div>
        </div>
      </div>
    </div>
  );
}
