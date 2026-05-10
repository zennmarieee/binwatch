"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getBins, type Bin } from "@/lib/bins";

const USTP_CENTER: [number, number] = [8.4858347, 124.6564369];

function getStatusColor(status: Bin["status"]): string {
  switch (status) {
    case "pending":
      return "#d62828";
    case "in_progress":
      return "#f4a261";
    case "resolved":
      return "#2a9d8f";
    default:
      return "#4caf50";
  }
}

function getStatusLabel(status: Bin["status"]): string {
  switch (status) {
    case "no_active_report":
      return "All clear";
    case "pending":
      return "Reported — awaiting staff";
    case "in_progress":
      return "Being handled";
    case "resolved":
      return "Recently resolved";
  }
}

function getStatusBadgeClass(status: Bin["status"]): string {
  switch (status) {
    case "pending":
      return "bg-red-100 text-red-700";
    case "in_progress":
      return "bg-orange-100 text-orange-700";
    case "resolved":
      return "bg-teal-100 text-teal-700";
    default:
      return "bg-green-100 text-green-700";
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
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -34],
  });
}

export default function PublicMapClient() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [bins, setBins] = useState<Bin[]>([]);
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const loadBins = useCallback(async () => {
    const data = await getBins();
    setBins(data);
    setLastUpdated(new Date());
    return data;
  }, []);

  const renderMarkers = useCallback((data: Bin[]) => {
    if (!mapRef.current) return;

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add new markers
    data.forEach((bin) => {
      const color = getStatusColor(bin.status);
      const icon = createBinIcon(color);

      const marker = L.marker([bin.lat, bin.lng], { icon })
        .addTo(mapRef.current!)
        .bindPopup(
          `
          <div style="min-width:180px;font-family:sans-serif">
            <p style="font-weight:800;font-size:14px;margin-bottom:4px;color:#102013">
              ${bin.name}
            </p>
            <p style="font-size:12px;color:#4c616c;margin-bottom:6px">
              ${bin.location_name}
            </p>
            <span style="
              background:${color}22;
              color:${color};
              font-size:11px;
              font-weight:700;
              padding:3px 10px;
              border-radius:999px;
            ">
              ${getStatusLabel(bin.status)}
            </span>
          </div>
        `,
        )
        .on("click", () => setSelectedBin(bin));

      markersRef.current.push(marker);
    });
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const bounds: L.LatLngBoundsExpression = [
      [8.48, 124.65],
      [8.491, 124.662],
    ];

    const map = L.map(mapContainerRef.current, {
      center: USTP_CENTER,
      zoom: 17,
      minZoom: 15,
      maxZoom: 19,
      maxBounds: bounds,
      maxBoundsViscosity: 1.0,
    });

    mapRef.current = map;

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution: "&copy; OpenStreetMap & CARTO",
        maxZoom: 19,
      },
    ).addTo(map);

    setTimeout(() => map.invalidateSize(), 100);
    setTimeout(() => map.invalidateSize(), 500);
    setTimeout(() => map.invalidateSize(), 1000);

    // Initial load
    loadBins().then(renderMarkers);

    // Poll every 15 seconds
    const interval = setInterval(async () => {
      const data = await loadBins();
      renderMarkers(data);
    }, 15000);

    return () => {
      clearInterval(interval);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [loadBins, renderMarkers]);

  // Stats
  const stats = {
    total: bins.length,
    clear: bins.filter((b) => b.status === "no_active_report").length,
    pending: bins.filter((b) => b.status === "pending").length,
    inProgress: bins.filter((b) => b.status === "in_progress").length,
    resolved: bins.filter((b) => b.status === "resolved").length,
  };

  return (
    <div className="flex h-[calc(100vh-65px)] flex-col lg:flex-row">
      {/* Map */}
      <div className="relative flex-1">
        <div
          ref={mapContainerRef}
          style={{ height: "100%", width: "100%", minHeight: "400px" }}
        />
        {/* Last updated badge */}
        <div className="absolute bottom-4 left-4 z-1000 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-[#4c616c] shadow backdrop-blur-sm">
          Updated {lastUpdated.toLocaleTimeString()}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full overflow-y-auto border-t border-black/5 bg-white lg:w-80 lg:border-l lg:border-t-0">
        {/* Stats */}
        <div className="border-b border-black/5 p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#4c616c]">
            Campus Overview
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-[#f3f6f3] p-3">
              <p className="text-xs text-[#4c616c]">Total Bins</p>
              <p className="text-xl font-black text-[#102013]">{stats.total}</p>
            </div>
            <div className="rounded-2xl bg-green-50 p-3">
              <p className="text-xs text-green-700">All Clear</p>
              <p className="text-xl font-black text-green-700">{stats.clear}</p>
            </div>
            <div className="rounded-2xl bg-red-50 p-3">
              <p className="text-xs text-red-700">Pending</p>
              <p className="text-xl font-black text-red-700">{stats.pending}</p>
            </div>
            <div className="rounded-2xl bg-orange-50 p-3">
              <p className="text-xs text-orange-700">In Progress</p>
              <p className="text-xl font-black text-orange-700">
                {stats.inProgress}
              </p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="border-b border-black/5 p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#4c616c]">
            Legend
          </p>
          <div className="space-y-2">
            {[
              { color: "#4caf50", label: "All clear" },
              { color: "#d62828", label: "Reported — awaiting staff" },
              { color: "#f4a261", label: "Being handled" },
              { color: "#2a9d8f", label: "Recently resolved" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs font-medium text-[#4c616c]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bin List */}
        <div className="p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#4c616c]">
            All Bins
          </p>
          <div className="space-y-2">
            {bins.map((bin) => (
              <button
                key={bin.id}
                onClick={() => {
                  setSelectedBin(bin);
                  mapRef.current?.flyTo([bin.lat, bin.lng], 19, {
                    animate: true,
                    duration: 0.8,
                  });
                }}
                className={`w-full rounded-2xl border p-3 text-left transition-all hover:border-green-200 hover:bg-green-50 ${
                  selectedBin?.id === bin.id
                    ? "border-green-300 bg-green-50"
                    : "border-black/5 bg-[#f9faf9]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-bold text-[#191c1d]">
                      {bin.name}
                    </p>
                    <p className="truncate text-xs text-[#4c616c]">
                      {bin.location_name}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${getStatusBadgeClass(bin.status)}`}
                  >
                    {bin.status === "no_active_report"
                      ? "Clear"
                      : bin.status === "in_progress"
                        ? "Active"
                        : bin.status.charAt(0).toUpperCase() +
                          bin.status.slice(1)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
