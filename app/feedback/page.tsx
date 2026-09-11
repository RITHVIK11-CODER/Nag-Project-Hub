"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function FeedbackPage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!message.trim()) {
      setErrorMessage("Please enter your feedback.");
      return;
    }

    setLoading(true);
    setSuccess(false);
    setErrorMessage("");

    const { error } = await supabaseBrowser
      .from("feedback")
      .insert({
        name: name.trim() || null,
        message: message.trim(),
      });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    setName("");
    setMessage("");
    setSuccess(true);
    setLoading(false);
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-5 py-10 flex items-center justify-center">
      {/* Background */}
      <div className="fixed inset-0 -z-10 grid-background" />

      <div className="fixed -top-40 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[140px]" />

      <div className="fixed bottom-[-200px] right-[-100px] -z-10 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[140px]" />

      {/* Card */}
      <section className="glass blue-glow w-full max-w-xl rounded-3xl p-6 sm:p-10">
        {/* Back */}
        <a
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          ← Back to Project Hub
        </a>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-2xl">
            💬
          </div>

          <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-blue-400">
            Feedback
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Tell me what you think.
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
            Your feedback helps me improve my projects and build better
            products.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Name <span className="text-slate-600">(optional)</span>
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="admin-input"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Feedback
            </label>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your thoughts, suggestions, or ideas..."
              rows={6}
              required
              className="admin-input resize-none"
            />
          </div>

          {/* Messages */}
          {success && (
            <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              ✓ Thanks! Your feedback has been submitted.
            </div>
          )}

          {errorMessage && (
            <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {errorMessage}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl border border-blue-400/30 bg-blue-600/20 px-5 py-3.5 font-semibold text-blue-200 transition hover:-translate-y-0.5 hover:border-blue-300/60 hover:bg-blue-600/30 hover:text-white hover:shadow-[0_0_30px_rgba(37,99,235,0.2)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Send Feedback →"}
          </button>
        </form>

        <div className="mt-8 border-t border-white/5 pt-6 text-center text-xs text-slate-600">
          Rithvik Nag&apos;s Project Hub
        </div>
      </section>
    </main>
  );
}