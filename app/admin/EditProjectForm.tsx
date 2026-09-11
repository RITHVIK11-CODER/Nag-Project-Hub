"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

type Project = {
  id: string;
  title: string;
  description: string | null;
  live_url: string;
  github_url: string | null;
  category: string | null;
  image_url: string | null;
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
  const [category, setCategory] = useState(
    project.category || ""
  );

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);
    setErrorMessage("");

    const updatedProject = {
      title,
      description: description || null,
      live_url: liveUrl,
      github_url: githubUrl || null,
      category: category || null,
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
    <div className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-slate-950/75 px-4 py-6 backdrop-blur-md">

      {/* Modal */}
      <div className="glass blue-glow relative w-full max-w-2xl rounded-3xl shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-blue-400/10 p-6 sm:p-8">

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-blue-400">
              Project Manager
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
              Edit Project
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update your project details.
            </p>
          </div>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-700/70 bg-slate-900/50 text-lg text-slate-400 transition hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-white disabled:opacity-50"
          >
            ×
          </button>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6 sm:p-8"
        >

          {/* Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Project Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="admin-input"
            />
          </div>

          {/* Category */}
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
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows={5}
              className="admin-input resize-none"
            />
          </div>

          {/* Live URL */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Live Website URL
            </label>

            <input
              type="url"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              required
              className="admin-input"
            />
          </div>

          {/* GitHub */}
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
              onChange={(e) =>
                setGithubUrl(e.target.value)
              }
              className="admin-input"
            />
          </div>

          {/* Error */}
          {errorMessage && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {errorMessage}
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-slate-700/80 bg-slate-900/50 px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_35px_rgba(59,130,246,0.2)] transition hover:bg-blue-400 hover:shadow-[0_0_55px_rgba(59,130,246,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Changes →"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}