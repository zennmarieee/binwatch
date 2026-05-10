"use client";

import PublicMapClient from "./PublicMapClient";
import Link from "next/link";

export default function PublicMapPage() {
  return (
    <div className="min-h-screen bg-[#f7faf7]">
      {/* Header */}
      <div className="border-b border-black/5 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm font-bold text-green-700 hover:underline"
            >
              ← Back
            </Link>
            <span className="text-black/20">|</span>
            <div>
              <h1 className="text-lg font-black text-[#102013]">
                BinWatch Campus Map
              </h1>
              <p className="text-xs text-[#4c616c]">
                Live bin status across USTP campus
              </p>
            </div>
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-600" />
            </span>
            <span className="text-xs font-bold text-green-700">
              Live — updates every 15s
            </span>
          </div>
        </div>
      </div>

      {/* Map + Sidebar */}
      <div className="mx-auto max-w-7xl">
        <PublicMapClient />
      </div>
    </div>
  );
}
