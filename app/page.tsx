import ModelViewer from "./ModelViewer";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
        <span className="text-2xl font-bold tracking-tight text-green-700 dark:text-green-400">
          BinWatch
        </span>
        <nav className="space-x-6">
          <a
            href="#features"
            className="text-zinc-700 dark:text-zinc-200 hover:underline"
          >
            Features
          </a>
          <a
            href="#map"
            className="text-zinc-700 dark:text-zinc-200 hover:underline"
          >
            Map
          </a>
          <a
            href="#dashboard"
            className="text-zinc-700 dark:text-zinc-200 hover:underline"
          >
            Dashboard
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 mb-4">
          Smart QR-Based Waste Reporting for Campuses
        </h1>
        <p className="max-w-xl text-lg text-zinc-700 dark:text-zinc-300 mb-8">
          BinWatch empowers students and staff to keep campuses clean by
          reporting overflowing bins in real time. Scan, report, and make a
          difference—one bin at a time.
        </p>
        {/* 3D Model Viewer */}
        <div className="w-full max-w-xl mx-auto mb-8">
          <ModelViewer />
        </div>
        <a
          href="#report"
          className="inline-block rounded-full bg-green-700 text-white px-8 py-3 font-semibold text-lg shadow hover:bg-green-800 transition-colors"
        >
          Report a Bin
        </a>
      </main>
    </div>
  );
}
