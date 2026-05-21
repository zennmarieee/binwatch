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
      <div className="mx-auto max-w-7xl pb-10">
        <PublicMapClient />
      </div>
      {/* Bottom Info Section */}
<div className="border-t border-black/5 bg-white">
  <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 md:grid-cols-3">
    {/* Status Guide */}
    <div>
      <h3 className="text-sm font-black text-[#102013]">
        Bin Status Guide
      </h3>

      <div className="mt-3 space-y-2 text-sm text-[#4c616c]">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-green-500" />
          Available
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-yellow-400" />
          Nearly Full
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          Overflowing
        </div>
      </div>
    </div>

    {/* About */}
    <div>
      <h3 className="text-sm font-black text-[#102013]">
        About BinWatch
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-[#4c616c]">
        BinWatch helps monitor campus waste bins in real-time,
        improving maintenance response and campus cleanliness
        through smart reporting and live status tracking.
      </p>
    </div>

    {/* System Info */}
    <div>
      <h3 className="text-sm font-black text-[#102013]">
        System Information
      </h3>

      <div className="mt-3 space-y-2 text-sm text-[#4c616c]">
        <p>• Updates every 15 seconds</p>
        <p>• Reports verified by maintenance staff</p>
        <p>• Designed for USTP campus monitoring</p>
      </div>
    </div>
  </div>
</div>
    </div>
  );
}
