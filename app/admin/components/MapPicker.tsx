"use client";

import { useEffect, useRef } from "react";

type LeafletModule = typeof import("leaflet");

interface ExistingBin {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface Props {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
  existingBins?: ExistingBin[];
  currentBinId?: string;
}

const USTP_CENTER: [number, number] = [8.4858347, 124.6564369];

function createPinIcon(leaflet: LeafletModule) {
  return leaflet.divIcon({
    className: "",
    html: `
      <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none">
        <path d="M22 42s10-11.2 10-20a10 10 0 1 0-20 0c0 8.8 10 20 10 20Z" fill="#e11d48"/>
        <circle cx="22" cy="22" r="5.5" fill="#ffffff"/>
      </svg>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 42],
    popupAnchor: [0, -40],
  });
}

function formatCoordinate(value: number) {
  return parseFloat(value.toFixed(7));
}

export default function MapPicker({
  lat,
  lng,
  onChange,
  existingBins = [],
  currentBinId,
}: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markerRef = useRef<import("leaflet").Marker | null>(null);
  const existingMarkersRef = useRef<import("leaflet").Marker[]>([]);
  const leafletRef = useRef<LeafletModule | null>(null);
  const onChangeRef = useRef(onChange);
  const existingBinsRef = useRef<ExistingBin[]>(existingBins);
  const currentBinIdRef = useRef<string | undefined>(currentBinId);

  function renderExistingMarkers() {
    if (!mapRef.current || !leafletRef.current) return;

    existingMarkersRef.current.forEach((marker) => marker.remove());
    existingMarkersRef.current = [];

    const leaflet = leafletRef.current;
    const map = mapRef.current;

    const existingIcon = leaflet.divIcon({
      className: "",
      html: `
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M14 26s7-7.4 7-13a7 7 0 1 0-14 0c0 5.6 7 13 7 13Z" fill="#4caf50" stroke="#1f2937" stroke-width="1.5"/>
          <circle cx="14" cy="13" r="2.2" fill="#ffffff"/>
        </svg>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 26],
      popupAnchor: [0, -22],
    });

    existingBinsRef.current
      .filter((bin) => bin.id !== currentBinIdRef.current)
      .forEach((bin) => {
        const marker = leaflet
          .marker([bin.lat, bin.lng], {
            icon: existingIcon,
            interactive: true,
          })
          .addTo(map);

        marker.bindPopup(`
          <div style="min-width:140px;font-family:sans-serif">
            <p style="margin:0;font-size:13px;font-weight:700;color:#102013">${bin.name}</p>
            <p style="margin:4px 0 0;font-size:11px;color:#4c616c">Existing bin</p>
          </div>
        `);

        existingMarkersRef.current.push(marker);
      });
  }

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    existingBinsRef.current = existingBins;
    currentBinIdRef.current = currentBinId;

    renderExistingMarkers();
  }, [existingBins, currentBinId]);

  useEffect(() => {
    let cancelled = false;

    async function initializeMap() {
      if (!mapContainerRef.current || mapRef.current) return;

      const leaflet = await import("leaflet");
      if (cancelled || !mapContainerRef.current) return;

      leafletRef.current = leaflet;

      const map = leaflet.map(mapContainerRef.current, {
        center: lat !== null && lng !== null ? [lat, lng] : USTP_CENTER,
        zoom: 18,
        minZoom: 16,
        maxZoom: 19,
      });

      mapRef.current = map;

      leaflet
        .tileLayer(
          "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
          {
            attribution: "&copy; OpenStreetMap & CARTO",
            maxZoom: 19,
          },
        )
        .addTo(map);

      const attachDragHandler = (marker: import("leaflet").Marker) => {
        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          onChangeRef.current?.(
            formatCoordinate(pos.lat),
            formatCoordinate(pos.lng),
          );
        });
      };

      if (lat !== null && lng !== null) {
        const marker = leaflet
          .marker([lat, lng], {
            draggable: true,
            icon: createPinIcon(leaflet),
          })
          .addTo(map);
        markerRef.current = marker;
        attachDragHandler(marker);
      }

      map.on("click", (event) => {
        const { lat: clickLat, lng: clickLng } = event.latlng;

        if (markerRef.current) {
          markerRef.current.setLatLng([clickLat, clickLng]);
        } else {
          const marker = leaflet
            .marker([clickLat, clickLng], {
              draggable: true,
              icon: createPinIcon(leaflet),
            })
            .addTo(map);
          markerRef.current = marker;
          attachDragHandler(marker);
        }

        map.setView([clickLat, clickLng], map.getZoom() ?? 18);
        onChangeRef.current?.(
          formatCoordinate(clickLat),
          formatCoordinate(clickLng),
        );
      });

      setTimeout(() => map.invalidateSize(), 100);

      renderExistingMarkers();
    }

    initializeMap();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
      leafletRef.current = null;
      existingMarkersRef.current = [];
    };
  }, [lat, lng]);

  useEffect(() => {
    if (!mapRef.current || !leafletRef.current) return;

    const map = mapRef.current;
    const leaflet = leafletRef.current;

    if (lat === null || lng === null) {
      markerRef.current?.remove();
      markerRef.current = null;
      return;
    }

    const nextPosition: [number, number] = [lat, lng];

    if (!markerRef.current) {
      markerRef.current = leaflet
        .marker(nextPosition, {
          draggable: true,
          icon: createPinIcon(leaflet),
        })
        .addTo(map);
      markerRef.current.on("dragend", () => {
        const pos = markerRef.current?.getLatLng();
        if (!pos) return;
        onChangeRef.current?.(
          formatCoordinate(pos.lat),
          formatCoordinate(pos.lng),
        );
      });
    } else {
      markerRef.current.setLatLng(nextPosition);
    }

    map.setView(nextPosition, map.getZoom() ?? 18);
  }, [lat, lng]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
          Existing bins
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-rose-600" />
          New / selected bin
        </div>
      </div>
      <p className="text-xs text-slate-500">
        Click on the map to place the bin marker. You can also drag it to
        adjust.
      </p>
      <div
        ref={mapContainerRef}
        className="w-full overflow-hidden rounded-xl border border-slate-200"
        style={{ height: "300px" }}
      />
    </div>
  );
}
