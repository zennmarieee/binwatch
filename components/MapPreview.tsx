"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix Leaflet's default icon paths when using Next.js bundler
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: (markerIcon2x as any).default || markerIcon2x,
  iconUrl: (markerIcon as any).default || markerIcon,
  shadowUrl: (markerShadow as any).default || markerShadow,
});

const USTP_COORDS: [number, number] = [8.455, 124.631];

export default function MapPreview() {
  const mapEl = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapEl.current) return;

    // Create a locked overview map: fixed zoom, no interactions, bounded to campus area
    const map = L.map(mapEl.current, {
      center: USTP_COORDS,
      zoom: 16,
      minZoom: 15,
      maxZoom: 17,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      touchZoom: false,
      tap: false,
      keyboard: false,
    });

    // Small bounding box around the campus to prevent panning outside
    // tightened to a smaller area so tiles stay within the preview
    const bounds = L.latLngBounds([
      [USTP_COORDS[0] - 0.006, USTP_COORDS[1] - 0.006],
      [USTP_COORDS[0] + 0.006, USTP_COORDS[1] + 0.006],
    ]);
    map.setMaxBounds(bounds);
    map.setMaxBounds(bounds, { padding: [0, 0] });
    map.options.maxBoundsViscosity = 1.0;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    // Use a subtle circle marker instead of a popup to avoid overlays
    L.circleMarker(USTP_COORDS, {
      radius: 6,
      color: "#dff6e1",
      weight: 2,
      fillColor: "#97f69c",
      fillOpacity: 1,
    }).addTo(map);

    // Fit to the tightened bounds without animation so tiles load centered
    map.fitBounds(bounds, { animate: false, padding: [6, 6] });

    // Ensure the map container inherits rounded corners and clips tiles
    const container = map.getContainer();
    if (container) {
      (container as HTMLElement).style.borderRadius = "inherit";
      (container as HTMLElement).style.overflow = "hidden";
    }

    // Fix rendering when inside animated/rounded containers: invalidate size a couple times
    map.whenReady(() => {
      setTimeout(() => map.invalidateSize(), 80);
      setTimeout(() => map.invalidateSize(), 220);
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl">
      <div ref={mapEl} className="h-28 w-full" />
    </div>
  );
}
