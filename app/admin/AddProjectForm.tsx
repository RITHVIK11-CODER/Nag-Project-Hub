
"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function AddProjectForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabaseBrowser
        .from("projects")
        .insert({
          title,
          description: description || null,
          live_url: liveUrl,
          github_url: githubUrl || null,
          category: category || null,
          image_url: null,
        });

      if (error) {
        throw new Error(error.message);
      }

      setTitle("");
      setDescription("");
      setLiveUrl("");
      setGithubUrl("");
      setCategory("");

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
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* TITLE */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Project Title
        </label>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Sreenidhians Hub"
          required
          className="admin-input"
        />
      </div>

      {/* CATEGORY */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Category
        </label>

        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. Web App, AI, Hackathon"
          className="admin-input"
        />

        <p className="mt-2 text-xs text-slate-600">
          This automatically becomes a homepage filter.
        </p>
      </div>

      {/* DESCRIPTION */}
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

      {/* LIVE URL */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Live Website URL
        </label>

        <input
          type="url"
          value={liveUrl}
          onChange={(e) => setLiveUrl(e.target.value)}
          placeholder="https://your-project.vercel.app"
          required
          className="admin-input"
        />
      </div>

      {/* GITHUB */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          GitHub URL
          <span className="ml-2 text-xs text-slate-600">
            Optional
          </span>
        </label>

        <input
          type="url"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          placeholder="https://github.com/username/project"
          className="admin-input"
        />
      </div>

      {/* INFO */}
      <div className="rounded-2xl border border-blue-400/10 bg-blue-500/5 px-4 py-4">
        <div className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-300">
            ℹ
          </div>

          <div>
            <p className="text-sm font-medium text-slate-300">
              No image required
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Projects are published directly to your portfolio.
              You can add screenshots later if needed.
            </p>
          </div>
        </div>
      </div>

      {/* MESSAGE */}
      {message && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            message.includes("successfully")
              ? "border-blue-400/20 bg-blue-500/10 text-blue-300"
              : "border-red-500/20 bg-red-500/10 text-red-300"
          }`}
        >
          {message}
        </div>
      )}

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-blue-500 px-5 py-4 text-sm font-semibold text-white shadow-[0_0_35px_rgba(59,130,246,0.18)] transition hover:bg-blue-400 hover:shadow-[0_0_55px_rgba(59,130,246,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Publishing Project..."
          : "Publish Project →"}
      </button>

    </form>
  );
}
