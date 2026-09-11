
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");

    const { error } =
      await supabaseBrowser.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5">

      {/* Background */}
      <div className="fixed inset-0 -z-10 grid-background" />

      <div className="fixed left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/20 blur-[160px]" />

      <div className="fixed left-[-150px] top-[20%] -z-10 h-[350px] w-[350px] rounded-full bg-cyan-500/10 blur-[140px]" />

      {/* Login Card */}
      <div className="glass blue-glow w-full max-w-md rounded-3xl p-7 sm:p-10">

        {/* Logo */}
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/15 ring-1 ring-blue-400/30">
            <div className="h-3 w-3 rounded-full bg-blue-400 shadow-[0_0_20px_rgba(96,165,250,1)]" />
          </div>
        </div>

        {/* Heading */}
        <div className="mt-7 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-blue-400">
            Private Access
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
            Nag Login
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Sign in to manage your projects.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="mt-8 space-y-5"
        >

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/50 px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-blue-400/60 focus:bg-slate-950/70 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/50 px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-blue-400/60 focus:bg-slate-950/70 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>

          {/* Error */}
          {errorMessage && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {errorMessage}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-500 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_0_35px_rgba(59,130,246,0.2)] transition hover:bg-blue-400 hover:shadow-[0_0_50px_rgba(59,130,246,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

        {/* Back */}
        <div className="mt-7 text-center">
          <a
            href="/"
            className="text-sm text-slate-500 transition hover:text-blue-300"
          >
            ← Back to projects
          </a>
        </div>

      </div>

    </main>
  );
}
