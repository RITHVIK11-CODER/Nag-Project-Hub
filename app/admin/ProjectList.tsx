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
  const [editingProject, setEditingProject] = useState<Project | null>(
    null
  );

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

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    setDeleting(id);

    const { error } = await supabaseBrowser
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Unable to delete project: " + error.message);
      setDeleting(null);
      return;
    }

    setProjects((current) =>
      current.filter((project) => project.id !== id)
    );

    setDeleting(null);
  }

  function handleUpdated(updatedProject: Project) {
    setProjects((current) =>
      current.map((project) =>
        project.id === updatedProject.id
          ? updatedProject
          : project
      )
    );
  }

  if (loading) {
    return (
      <p className="text-gray-400 mt-10">
        Loading projects...
      </p>
    );
  }

  return (
    <>
      <div className="mt-12">
        <h2 className="text-2xl font-semibold">
          Your Projects
        </h2>

        <div className="mt-6 space-y-4">
          {projects.length === 0 ? (
            <p className="text-gray-400">
              No projects yet.
            </p>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                className="border border-gray-800 rounded-xl p-5 flex items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-semibold text-lg">
                    {project.title}
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    {project.category || "No category"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingProject(project)}
                    className="border border-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-900"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(project.id)}
                    disabled={deleting === project.id}
                    className="border border-red-900 text-red-400 px-4 py-2 rounded-lg text-sm disabled:opacity-50"
                  >
                    {deleting === project.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {editingProject && (
        <EditProjectForm
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onUpdated={handleUpdated}
        />
      )}
    </>
  );
}