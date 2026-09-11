"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

type Project = {
  id: string;
  title: string;
  description: string | null;
  live_url: string;
  github_url: string | null;
  image_url: string | null;
  display_order: number;
};

type EditProjectFormProps = {
  project: Project;
  onClose: () => void;
  onUpdated: (project: Project) => void;
};

export default function EditProjectForm({
  project,
  onClose,
  onUpdated,
}: EditProjectFormProps) {
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(
    project.description || ""
  );
  const [liveUrl, setLiveUrl] = useState(project.live_url);
  const [githubUrl, setGithubUrl] = useState(
    project.github_url || ""
  );

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage("Please enter a project title.");
      return;
    }

    if (!liveUrl.trim()) {
      setErrorMessage("Please enter the live project URL.");
      return;
    }

    setSaving(true);
    setErrorMessage("");

    const updatedProject = {
      title: title.trim(),
      description: description.trim() || null,
      live_url: liveUrl.trim(),
      github_url: githubUrl.trim() || null,
    };

    const { data, error } = await supabaseBrowser
      .from("projects")
      .update(updatedProject)
      .eq("id", project.id)
      .select()
      .single();

    if (error) {
      setErrorMessage(error.message);
      setSaving(false);
      return;
    }

    if (data) {
      onUpdated(data);
    }

    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 px-5 py-10 backdrop-blur-md">
      <div className="glass w-full max-w-2xl rounded-3xl p-6 shadow-2xl sm:p-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
              Edit Project
            </p>

            <h2 className="text-2xl font-bold text-white">
              Update Project
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Update your project details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-700 bg-slate-900/50 px-3 py-2 text-slate-400 transition hover:border-slate-600 hover:text-white"
          >
            ✕
          </button>
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
              className="admin-input"
            />
          </div>

          {/* Error */}
          {errorMessage && (
            <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {errorMessage}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 rounded-xl border border-slate-700 bg-slate-900/50 px-5 py-3.5 font-medium text-slate-300 transition hover:border-slate-600 hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl border border-blue-400/30 bg-blue-600/20 px-5 py-3.5 font-semibold text-blue-200 transition hover:-translate-y-0.5 hover:border-blue-300/60 hover:bg-blue-600/30 hover:text-white hover:shadow-[0_0_30px_rgba(37,99,235,0.2)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}