import { homepageContent } from "../data/homepageContent";
import { PublicHeader } from "../components/PublicHeader";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#f7faf7] text-[#191c1d]">
      <style>{`
        .asymmetric-card {
          border-top-left-radius: 1.5rem;
          border-bottom-right-radius: 1.5rem;
          border-top-right-radius: 0.75rem;
          border-bottom-left-radius: 0.75rem;
        }
        .surface-card {
          background: linear-gradient(165deg, #ffffff 0%, #f6faf6 100%);
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 18px 45px rgba(16, 24, 16, 0.08);
        }
        .hero-grid {
          background-image:
            radial-gradient(circle at 1px 1px, rgba(16, 24, 16, 0.07) 1px, transparent 0);
          background-size: 18px 18px;
        }
        .floating-orb {
          filter: blur(45px);
        }
      `}</style>

      <div className="floating-orb pointer-events-none absolute -left-28 top-14 h-64 w-64 rounded-full bg-[#9eea9f]/45" />
      <div className="floating-orb pointer-events-none absolute -right-24 top-60 h-72 w-72 rounded-full bg-[#8ecdf7]/30" />

      <PublicHeader
        brand={homepageContent.header.brand}
        links={homepageContent.header.links}
        badgeText={homepageContent.header.badgeText}
      />

      <main className="mx-auto max-w-7xl px-6 pb-16 pt-24">
        {/* Hero */}
        <section
          id="hero"
          className="hero-grid relative mx-auto max-w-5xl rounded-4xl border border-black/5 bg-white/70 px-6 py-12 text-center backdrop-blur-sm sm:px-10"
        >
          <span className="mb-5 inline-flex rounded-full border border-[#9adf98] bg-[#d9f6d4] px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#0f4a16]">
            QR-Based Waste Reporting for Campuses
          </span>
          <h1 className="text-4xl font-black leading-tight tracking-[-0.02em] text-[#102013] sm:text-6xl">
            BinWatch: Smart Campus Waste Reporting
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#4c616c] sm:text-lg">
            Scan a bin QR code, report in seconds, and help staff respond
            faster. No login needed. Student ID is optional for points.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="#lookup"
              className="inline-flex items-center justify-center rounded-full bg-[#176d25] px-6 py-3 font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#12581e]"
            >
              Student Lookup
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-[#176d25] bg-white px-6 py-3 font-bold text-[#176d25] transition-all hover:-translate-y-0.5 hover:bg-[#eef8ef]"
            >
              How It Works
            </a>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="mt-16">
          <div className="mb-6 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-green-700">
              Quick flow
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-[#191c1d]">
              How it works
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {homepageContent.howItWorks.map((item) => (
              <article
                key={item.step}
                className="asymmetric-card surface-card p-6"
              >
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-green-700">
                  Step {item.step}
                </p>
                <h3 className="mb-2 text-xl font-bold text-[#191c1d]">
                  {item.title}
                </h3>
                <p className="text-sm leading-6 text-[#4c616c]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Lookup */}
        <section id="lookup" className="surface-card mt-16 rounded-3xl p-8">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <p className="text-sm font-bold uppercase tracking-widest text-green-700">
                Public student lookup
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-[#191c1d]">
                {homepageContent.publicLookup.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#4c616c]">
                {homepageContent.publicLookup.description}
              </p>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <form className="flex flex-col gap-3 rounded-3xl border border-black/5 bg-[#f3f6f3] p-4 sm:flex-row sm:items-center">
                <input
                  className="w-full rounded-full border border-black/5 bg-white px-5 py-4 text-sm font-medium text-[#191c1d] placeholder:text-[#707a6c] focus:ring-2 focus:ring-green-700/20"
                  placeholder="Enter Student ID (e.g. STU-2024)"
                  type="text"
                />
                <button
                  className="rounded-full bg-[#176d25] px-6 py-4 font-bold text-white transition-colors hover:bg-[#12581e]"
                  type="button"
                >
                  Lookup
                </button>
              </form>

              <div className="grid gap-4 md:grid-cols-3">
                {homepageContent.publicLookup.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-2xl border border-black/5 bg-[#f3f6f3] p-4"
                  >
                    <p className="text-xs font-bold uppercase tracking-widest text-[#4c616c]">
                      {metric.label}
                    </p>
                    <p className="mt-1 text-2xl font-black text-green-700">
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl border border-dashed border-green-700/30 bg-[#f7faf7] p-5">
                <p className="text-sm font-bold text-[#191c1d]">
                  Contribution history preview
                </p>
                <ul className="mt-3 space-y-3 text-sm text-[#4c616c]">
                  {homepageContent.publicLookup.history.map((entry) => (
                    <li
                      key={entry.label}
                      className="flex items-center justify-between rounded-2xl bg-white px-4 py-3"
                    >
                      <span>{entry.label}</span>
                      <span className="font-bold text-green-700">
                        {entry.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Public Info */}
        <section className="mt-16 grid gap-6 lg:grid-cols-2">
          <div className="surface-card rounded-3xl p-8">
            <p className="text-sm font-bold uppercase tracking-widest text-green-700">
              Campus stats
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-[#191c1d]">
              Public campus overview
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {homepageContent.campusStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-black/5 bg-[#f3f6f3] p-4"
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-[#4c616c]">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-2xl font-black text-green-700">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-linear-to-br from-[#0e5c88] to-[#0a83b0] p-8 text-[#e9f2ff] shadow-[0_14px_40px_rgba(8,38,58,0.28)]">
            <p className="text-sm font-bold uppercase tracking-widest text-[#cee5ff]">
              Map preview
            </p>
            <h2 className="mt-2 text-2xl font-extrabold">Public map preview</h2>
            <p className="mt-3 text-sm leading-6 text-[#e9f2ff]/85">
              Keep this small so the page stays light.
            </p>
            <div className="mt-6 rounded-3xl bg-white/15 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold">Library - North Wing</span>
                <span className="rounded-full bg-[#a3f69c] px-3 py-1 text-xs font-bold text-[#002204]">
                  Pending
                </span>
              </div>
              <div className="mt-4 h-28 rounded-2xl bg-white/20" />
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="surface-card mt-16 rounded-3xl p-8">
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
              Back to top
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
