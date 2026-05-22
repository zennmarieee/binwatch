"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BrandMark from "@/components/BrandMark";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin() {
    setLoading(true);
    setError("");

    const supabase = createClient();

    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      {
        email,
        password,
      },
    );

    if (signInError || !data.user) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    // Fetch role from profiles
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (!profile) {
      setError("Account has no role assigned. Contact administrator.");
      setLoading(false);
      return;
    }

    // Redirect based on role
    if (profile.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/staff");
    }

    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7faf7] px-4">
      <div className="w-full max-w-sm rounded-3xl border border-black/5 bg-white p-8 shadow-lg">
        <div className="mb-6 flex justify-center text-center">
          <BrandMark
            label="BinWatch"
            subtitle="Staff & Admin Portal"
            size="lg"
            className="justify-center"
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-[#4c616c]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/20"
              placeholder="you@binwatch.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-[#4c616c]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/20"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-xl bg-[#176d25] py-3 font-bold text-white transition-colors hover:bg-[#12581e] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-[#4c616c]">
          Students don&apos;t need to log in.{" "}
          <Link href="/" className="font-bold text-green-700 hover:underline">
            Go to homepage →
          </Link>
        </p>
      </div>
    </div>
  );
}
