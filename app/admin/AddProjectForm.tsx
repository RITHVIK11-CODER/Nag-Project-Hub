"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function AddProjectForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      setMessage("Please enter a project title.");
      return;
    }

    if (!liveUrl.trim()) {
      setMessage("Please enter the live project URL.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Automatically place new projects at the bottom.
      const { data: lastProject, error: orderError } =
        await supabaseBrowser
          .from("projects")
          .select("display_order")
          .order("display_order", { ascending: false })
          .limit(1)
          .maybeSingle();

      if (orderError) {
        throw new Error(orderError.message);
      }

      const nextOrder =
        lastProject?.display_order != null
          ? lastProject.display_order + 1
          : 1;

      const { error } = await supabaseBrowser
        .from("projects")
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          live_url: liveUrl.trim(),
          github_url: githubUrl.trim() || null,
          display_order: nextOrder,
          image_url: null,
        });

      if (error) {
        throw new Error(error.message);
      }

      setTitle("");
      setDescription("");
      setLiveUrl("");
      setGithubUrl("");

      setMessage("Project published successfully! 🎉");

      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass rounded-3xl p-6 sm:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-xl">
          ✦
        </div>

        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
          Project Management
        </p>

        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Add a New Project
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Add your project details and publish it directly to your
          Project Hub.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Project Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Sreenidhians Hub"
            className="admin-input"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Briefly describe what you built..."
            rows={5}
            className="admin-input resize-none"
          />
        </div>

        {/* Live URL */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Live Project URL
          </label>

          <input
            type="url"
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            placeholder="https://your-project.vercel.app"
            className="admin-input"
            required
          />
        </div>

        {/* GitHub URL */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            GitHub URL{" "}
            <span className="text-slate-600">(optional)</span>
          </label>

          <input
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/username/project"
            className="admin-input"
          />
        </div>

        {/* Image info */}
        <div className="rounded-2xl border border-blue-400/10 bg-blue-500/5 p-4">
          <div className="flex gap-3">
            <span className="text-lg">💡</span>

            <div>
              <p className="text-sm font-medium text-blue-300">
                No image required
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Your project cards use the premium glass visual design,
                so you can publish projects without uploading images.
              </p>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm ${
              message.includes("successfully")
                ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                : "border-red-400/20 bg-red-500/10 text-red-300"
            }`}
          >
            {message}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl border border-blue-400/30 bg-blue-600/20 px-5 py-4 font-semibold text-blue-200 transition hover:-translate-y-0.5 hover:border-blue-300/60 hover:bg-blue-600/30 hover:text-white hover:shadow-[0_0_35px_rgba(37,99,235,0.2)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Publishing..." : "Publish Project →"}
        </button>
      </form>
    </div>
  );
}