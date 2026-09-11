"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { supabaseBrowser } from "@/lib/supabase-browser";
import EditProjectForm from "./EditProjectForm";

type Project = {
  id: string;
  title: string;
  description: string | null;
  live_url: string;
  github_url: string | null;
  image_url: string | null;
  display_order: number;
};

type SortableProjectProps = {
  project: Project;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
};

function SortableProject({
  project,
  index,
  onEdit,
  onDelete,
}: SortableProjectProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: project.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`glass overflow-hidden rounded-2xl transition ${
        isDragging
          ? "relative z-20 scale-[1.02] border-blue-400/50 shadow-[0_0_50px_rgba(37,99,235,0.2)]"
          : ""
      }`}
    >
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        {/* Drag Handle */}
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="flex h-11 w-11 cursor-grab touch-none items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-xl text-blue-300 transition hover:border-blue-400/50 hover:bg-blue-500/20 active:cursor-grabbing"
            title="Drag to reorder"
            aria-label={`Drag ${project.title} to reorder`}
          >
            ⠿
          </button>

          <div className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-slate-900/70 px-2 text-xs font-bold text-slate-500">
            {index + 1}
          </div>
        </div>

        {/* Project Details */}
        <div className="min-w-0 flex-1">
          <div className="mb-1">
            <span className="text-xs text-slate-600">
              Position {index + 1} · Drag to rearrange
            </span>
          </div>

          <h3 className="truncate text-lg font-semibold text-white">
            {project.title}
          </h3>

          {project.description && (
            <p className="mt-1 line-clamp-2 text-sm text-slate-500">
              {project.description}
            </p>
          )}

          <a
            href={project.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block max-w-full truncate text-xs text-blue-400 hover:text-blue-300"
          >
            {project.live_url}
          </a>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-xl border border-blue-400/20 bg-blue-500/10 px-4 py-2.5 text-sm font-medium text-blue-300 transition hover:border-blue-400/50 hover:bg-blue-500/20 hover:text-white"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="rounded-xl border border-red-400/20 bg-red-500/5 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:border-red-400/40 hover:bg-red-500/10"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingOrder, setSavingOrder] = useState(false);

  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingProject, setEditingProject] =
    useState<Project | null>(null);
  const [deleteProject, setDeleteProject] =
    useState<Project | null>(null);

  async function loadProjects() {
    const { data, error } = await supabaseBrowser
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProjects(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function saveOrder(updatedProjects: Project[]) {
    setSavingOrder(true);

    try {
      for (let index = 0; index < updatedProjects.length; index++) {
        const project = updatedProjects[index];

        const { error } = await supabaseBrowser
          .from("projects")
          .update({
            display_order: index + 1,
          })
          .eq("id", project.id);

        if (error) {
          throw new Error(error.message);
        }
      }

      setProjects(
        updatedProjects.map((project, index) => ({
          ...project,
          display_order: index + 1,
        }))
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? `Unable to save order: ${error.message}`
          : "Unable to save project order."
      );

      await loadProjects();
    } finally {
      setSavingOrder(false);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = projects.findIndex(
      (project) => project.id === active.id
    );

    const newIndex = projects.findIndex(
      (project) => project.id === over.id
    );

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const reorderedProjects = arrayMove(
      projects,
      oldIndex,
      newIndex
    );

    setProjects(reorderedProjects);

    await saveOrder(reorderedProjects);
  }

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

    const remainingProjects = projects.filter(
      (project) => project.id !== deleteProject.id
    );

    setProjects(remainingProjects);
    setDeleteProject(null);
    setDeleting(null);

    await saveOrder(remainingProjects);
  }

  function handleUpdated(updatedProject: Project) {
    setProjects((current) =>
      current
        .map((project) =>
          project.id === updatedProject.id
            ? updatedProject
            : project
        )
        .sort(
          (a, b) =>
            a.display_order - b.display_order
        )
    );

    setEditingProject(null);
  }

  if (loading) {
    return (
      <div className="glass rounded-3xl p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-40 rounded bg-slate-800" />
          <div className="h-24 rounded-2xl bg-slate-900" />
          <div className="h-24 rounded-2xl bg-slate-900" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="glass rounded-3xl p-6 sm:p-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
              Published Projects
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Manage Your Work
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Drag and drop projects to change their order.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {savingOrder && (
              <span className="text-xs text-blue-400">
                Saving...
              </span>
            )}

            <div className="rounded-xl border border-blue-400/20 bg-blue-500/10 px-3 py-2 text-sm font-semibold text-blue-300">
              {projects.length} Projects
            </div>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/30 p-10 text-center">
            <div className="mb-3 text-3xl">✦</div>

            <p className="font-medium text-slate-300">
              No projects yet
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Add your first project using the form above.
            </p>
          </div>
        ) : (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={projects.map((project) => project.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <SortableProject
                    key={project.id}
                    project={project}
                    index={index}
                    onEdit={() =>
                      setEditingProject(project)
                    }
                    onDelete={() =>
                      setDeleteProject(project)
                    }
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Edit Modal */}
      {editingProject && (
        <EditProjectForm
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onUpdated={handleUpdated}
        />
      )}

      {/* Delete Modal */}
      {deleteProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 backdrop-blur-md">
          <div className="glass w-full max-w-md rounded-3xl p-6 shadow-2xl sm:p-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 text-xl">
              ⚠
            </div>

            <h3 className="text-xl font-bold text-white">
              Delete Project?
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Are you sure you want to delete{" "}
              <span className="font-medium text-white">
                {deleteProject.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteProject(null)}
                disabled={deleting !== null}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting !== null}
                className="flex-1 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 hover:text-red-200 disabled:opacity-50"
              >
                {deleting
                  ? "Deleting..."
                  : "Delete Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}