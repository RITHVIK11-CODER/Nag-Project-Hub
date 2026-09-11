"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import EditProjectForm from "./EditProjectForm";

type Project = {
  id: string;
  title: string;
  description: string | null;
  live_url: string;
  github_url: string | null;
  category: string | null;
  image_url: string | null;
};

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [editingProject, setEditingProject] =
    useState<Project | null>(null);

  const [deleteProject, setDeleteProject] =
    useState<Project | null>(null);

  async function loadProjects() {
    const { data, error } = await supabaseBrowser
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProjects(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function handleDelete() {
    if (!deleteProject) return;

    setDeleting(deleteProject.id);

    const { error } = await supabaseBrowser
      .from("projects")
      .delete()
      .eq("id", deleteProject.id);

    if (error) {
      alert("Unable to delete project: " + error.message);
      setDeleting(null);
      return;
    }

    setProjects((current) =>
      current.filter(
        (project) => project.id !== deleteProject.id
      )
    );

    setDeleting(null);
    setDeleteProject(null);
  }

  function handleUpdated(updatedProject: Project) {
    setProjects((current) =>
      current.map((project) =>
        project.id === updatedProject.id
          ? updatedProject
          : project
      )
    );

    setEditingProject(null);
  }

  if (loading) {
    return (
      <div className="glass rounded-3xl p-10 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-400/20 border-t-blue-400" />

        <p className="mt-4 text-sm text-slate-500">
          Loading projects...
        </p>
      </div>
    );
  }

  return (
    <>
      {/* PROJECT LIST */}
      <div className="space-y-4">

        {projects.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-xl text-blue-300">
              ✦
            </div>

            <h3 className="mt-5 text-lg font-semibold">
              No projects yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Your published projects will appear here.
            </p>
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="glass glass-hover rounded-2xl p-5"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                {/* Project Info */}
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-400">
                    {project.category || "Project"}
                  </p>

                  <h3 className="mt-1 truncate text-lg font-semibold text-white">
                    {project.title}
                  </h3>

                  {project.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                      {project.description}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex shrink-0 gap-2">

                  <button
                    onClick={() =>
                      setEditingProject(project)
                    }
                    className="flex-1 rounded-xl border border-blue-400/20 bg-blue-500/10 px-4 py-2.5 text-sm font-medium text-blue-300 transition hover:border-blue-400/50 hover:bg-blue-500/20 hover:text-white sm:flex-none"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      setDeleteProject(project)
                    }
                    className="flex-1 rounded-xl border border-red-400/20 bg-red-500/5 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:border-red-400/40 hover:bg-red-500/10 sm:flex-none"
                  >
                    Delete
                  </button>

                </div>

              </div>
            </div>
          ))
        )}

      </div>

      {/* EDIT POPUP */}
      {editingProject && (
        <EditProjectForm
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onUpdated={handleUpdated}
        />
      )}

      {/* DELETE CONFIRMATION POPUP */}
      {deleteProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 px-5 backdrop-blur-md">

          <div className="glass blue-glow w-full max-w-md rounded-3xl p-6 shadow-2xl sm:p-8">

            {/* Icon */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 text-2xl text-red-300">
              !
            </div>

            {/* Heading */}
            <h2 className="mt-6 text-2xl font-bold tracking-tight text-white">
              Delete project?
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              You are about to permanently delete:
            </p>

            {/* Project name */}
            <div className="mt-4 rounded-2xl border border-red-400/10 bg-red-500/5 px-4 py-3">
              <p className="font-medium text-red-200">
                {deleteProject.title}
              </p>

              {deleteProject.category && (
                <p className="mt-1 text-xs text-red-300/60">
                  {deleteProject.category}
                </p>
              )}
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-600">
              This action cannot be undone.
            </p>

            {/* Buttons */}
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                onClick={() => setDeleteProject(null)}
                disabled={deleting !== null}
                className="rounded-xl border border-slate-700/80 bg-slate-900/50 px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting !== null}
                className="rounded-xl bg-red-500/90 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(239,68,68,0.15)] transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting
                  ? "Deleting..."
                  : "Yes, Delete Project"}
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}