"use client";

import dynamic from "next/dynamic";
import { ArrowUp, MapPinned, QrCode, Send, ShieldCheck } from "lucide-react";
import Link from "next/link";
import CampusStats from "../components/CampusStats";
import { homepageContent } from "../data/homepageContent";
import { PublicHeader } from "../components/PublicHeader";
import PublicStudentLookup from "../components/PublicStudentLookup";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

const MapPreview = dynamic(() => import("../components/MapPreview"), {
  ssr: false,
  loading: () => <div className="h-80 w-full rounded-xl bg-white/20" />,
});

export default function Home() {
  const howItWorksIcons = [QrCode, Send, ShieldCheck] as const;

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#f7faf7] text-[#191c1d]">
      <div className="floating-orb pointer-events-none absolute -left-28 top-14 h-64 w-64 rounded-full bg-[#9eea9f]/45" />
      <div className="floating-orb pointer-events-none absolute -right-24 top-60 h-72 w-72 rounded-full bg-[#8ecdf7]/30" />

      <PublicHeader
        brand={homepageContent.header.brand}
        links={homepageContent.header.links}
        badgeText={homepageContent.header.badgeText}
      />

      <main className="mx-auto max-w-7xl space-y-20 px-6 pb-20 pt-28 sm:space-y-24">
        {/* Hero */}
        <Hero />
        {/* Lookup (moved above How It Works) */}
        <PublicStudentLookup />

        {/* How It Works (moved below Lookup) */}
        <section id="how-it-works">
          <div className="mb-6 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-green-700">
              Quick flow
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-[#191c1d]">
              How it works
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {homepageContent.howItWorks.map((item, index) => {
              const Icon = howItWorksIcons[index] ?? QrCode;

              return (
                <article
                  key={item.step}
                  className="asymmetric-card surface-card p-6"
                >
                  <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-green-700">
                    <Icon
                      className="mr-1 inline-block h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                    Step {item.step}
                  </p>
                  <h3 className="mb-2 text-xl font-bold text-[#191c1d]">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-6 text-[#4c616c]">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Public Info */}
        <section className="surface-card rounded-3xl p-8">
          <p className="text-sm font-bold uppercase tracking-widest text-green-700">
            Campus stats
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-[#191c1d]">
            Public campus overview
          </h2>
          <CampusStats />
        </section>

        {/* Map Preview */}
        <section className="map-card rounded-3xl bg-linear-to-br from-[#0e5c88] to-[#0a83b0] p-8 text-[#e9f2ff]">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold uppercase tracking-widest text-[#cee5ff]">
              <MapPinned
                className="mr-1 inline-block h-3.5 w-3.5"
                aria-hidden="true"
              />
              Map preview
            </p>
            <Link
              href="/map"
              className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-white/30"
            >
              Full map →
            </Link>
          </div>

          <h2 className="mt-2 text-2xl font-extrabold">Public map preview</h2>
          <p className="mt-3 text-sm leading-6 text-[#e9f2ff]/85">
            Live bin status across USTP campus.
          </p>

          <div className="mt-6 rounded-3xl bg-white/15 p-4 backdrop-blur-sm">
            <MapPreview />
          </div>
        </section>

        {/* Footer */}
        <section className="surface-card rounded-3xl p-8 sm:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-[#191c1d]">
                Ready to keep campus clean?
              </h2>
              <p className="mt-1 text-sm text-[#4c616c]">
                Scan a QR code on a bin to report it instantly.
              </p>
            </div>
            <a
              href="#hero"
              className="inline-flex items-center justify-center rounded-full bg-green-700 px-6 py-3 font-bold text-white transition-colors hover:bg-green-800"
            >
              <ArrowUp className="mr-2 h-4 w-4" aria-hidden="true" />
              Back to top
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
