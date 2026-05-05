"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";

const USTP_COORDS: [number, number] = [8.455, 124.631];

export default function MapPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !containerRef.current || mapRef.current) {
      console.log("MapPreview: Skipping init", {
        isClient,
        hasContainer: !!containerRef.current,
        hasMap: !!mapRef.current,
      });
      return;
    }

    console.log("MapPreview: Starting initialization");

    try {
      // Ensure container is visible and sized
      const container = containerRef.current;
      container.innerHTML = ""; // Clear any previous content

      console.log("MapPreview: Creating map instance");

      const map = L.map(container, {
        center: USTP_COORDS,
        zoom: 16,
        zoomControl: false,
        attributionControl: false,
      });

      mapRef.current = map;
      console.log("MapPreview: Map instance created");

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      console.log("MapPreview: Tile layer added");

      // Add marker
      L.marker(USTP_COORDS).addTo(map).bindPopup("USTP Campus");

      console.log("MapPreview: Marker added");

      // Invalidate size to render tiles
      setTimeout(() => {
        map.invalidateSize();
        console.log("MapPreview: invalidateSize called");
      }, 200);
    } catch (error) {
      console.error("MapPreview Error:", error);
    }

    return () => {
      console.log("MapPreview: Cleanup");
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isClient]);

  return (
    <div
      ref={containerRef}
      className="h-28 w-full rounded-2xl bg-gray-200"
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    />
  );
}
