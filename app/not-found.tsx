import Link from "next/link";
import BrandMark from "@/components/BrandMark";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7faf7] px-4">
      <div className="w-full max-w-sm rounded-3xl border border-black/5 bg-white p-8 text-center shadow-lg">
        <BrandMark
          label="BinWatch"
          subtitle="Page not found"
          size="lg"
          className="justify-center"
        />
        <h1 className="mt-4 text-6xl font-black text-[#102013]">404</h1>
        <p className="mt-2 text-xl font-extrabold text-[#191c1d]">
          Page Not Found
        </p>
        <p className="mt-2 text-sm text-[#4c616c]">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-[#176d25] px-6 py-3 font-bold text-white transition-colors hover:bg-[#12581e]"
          >
            Back to Homepage
          </Link>
          <Link
            href="/map"
            className="inline-flex items-center justify-center rounded-full border border-[#176d25] px-6 py-3 font-bold text-[#176d25] transition-colors hover:bg-[#eef8ef]"
          >
            View Campus Map
          </Link>
        </div>
      </div>
    </div>
  );
}
