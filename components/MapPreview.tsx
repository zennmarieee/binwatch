"use client";

import { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getBins, type Bin } from "@/lib/bins";

const USTP_CENTER: [number, number] = [8.4858347, 124.6564369];

function getStatusColor(status: Bin["status"]): string {
  switch (status) {
    case "pending":      return "#d62828";
    case "in_progress":  return "#f4a261";
    case "resolved":     return "#2a9d8f";
    default:             return "#4caf50";
  }
}

function getStatusLabel(status: Bin["status"]): string {
  switch (status) {
    case "no_active_report": return "All clear";
    case "pending":          return "Reported — awaiting staff";
    case "in_progress":      return "Being handled";
    case "resolved":         return "Recently resolved";
  }
}

function createBinIcon(fillColor: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
      <path d="M22 12h20l2 6H20l2-6Zm-4 8h28l-3 30c-.3 3-2.8 5-5.8 5H27.8c-3 0-5.5-2-5.8-5L18 20Zm8 7a2 2 0 0 0-2 2v12a2 2 0 1 0 4 0V29a2 2 0 0 0-2-2Zm8 0a2 2 0 0 0-2 2v12a2 2 0 1 0 4 0V29a2 2 0 0 0-2-2Zm8 0a2 2 0 0 0-2 2v12a2 2 0 1 0 4 0V29a2 2 0 0 0-2-2Z"
        fill="${fillColor}" stroke="#1f2937" stroke-width="2" stroke-linejoin="round"/>
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
  const markersRef = useRef<L.Marker[]>([]);

  // Separate function to load and render markers
  const loadMarkers = useCallback(async () => {
    if (!mapRef.current) return;

    const bins = await getBins();

    // Remove existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add updated markers
    bins.forEach((bin) => {
      const color = getStatusColor(bin.status);
      const icon = createBinIcon(color);

      const marker = L.marker([bin.lat, bin.lng], { icon })
        .addTo(mapRef.current!)
        .bindPopup(`
          <div style="min-width:160px">
            <p style="font-weight:700;margin-bottom:4px">${bin.name}</p>
            <p style="font-size:12px;color:#555;margin-bottom:2px">${bin.location_name}</p>
            <p style="font-size:12px;font-weight:600;color:${color}">${getStatusLabel(bin.status)}</p>
          </div>
        `);

      markersRef.current.push(marker);
    });
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const bounds: L.LatLngBoundsExpression = [
      [8.48, 124.65],
      [8.491, 124.662],
    ];

    const map = L.map(mapContainerRef.current, {
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

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution: "&copy; OpenStreetMap & CARTO",
        maxZoom: 19,
      }
    ).addTo(map);

    setTimeout(() => {
      map.invalidateSize();
      loadMarkers();
    }, 100);

    // Poll every 15 seconds
    const interval = setInterval(() => {
      loadMarkers();
    }, 15000);

    return () => {
      clearInterval(interval);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [loadMarkers]);

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
            <span className="h-3 w-3 rounded-full bg-[#4caf50] ring-2 ring-green-100" />
            <span className="font-medium">All clear</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#d62828] ring-2 ring-red-100" />
            <span className="font-medium">Reported — awaiting staff</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#f4a261] ring-2 ring-orange-100" />
            <span className="font-medium">Being handled</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#2a9d8f] ring-2 ring-teal-100" />
            <span className="font-medium">Recently resolved</span>
          </div>
        </div>
      </div>
    </div>
  );
}