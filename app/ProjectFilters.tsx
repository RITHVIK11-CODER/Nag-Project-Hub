"use client";

import { useState } from "react";

type Project = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  live_url: string;
  github_url: string | null;
  category: string | null;
};

export default function ProjectFilters({
  projects,
}: {
  projects: Project[];
}) {
  const [active, setActive] = useState("All");

const categories = [
  "All",
  ...Array.from(
    new Set(
      projects
        .map((project) => project.category)
        .filter(
          (category): category is string =>
            Boolean(category)
        )
    )
  ),
];

  const filteredProjects =
    active === "All"
      ? projects
      : projects.filter(
          (project) => project.category === active
        );

  return (
    <>

      {/* FILTERS */}
      <div className="mb-10 flex gap-2 overflow-x-auto pb-2 no-scrollbar">

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActive(category)}
            className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm transition ${
              active === category
                ? "bg-blue-500 text-white shadow-[0_0_25px_rgba(59,130,246,0.25)]"
                : "glass text-slate-400 hover:text-white"
            }`}
          >
            {category}
          </button>
        ))}

      </div>

      {/* PROJECTS */}
      {filteredProjects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">

          {filteredProjects.map((project, index) => (
            <article
              key={project.id}
              className={`glass glass-hover group overflow-hidden rounded-3xl ${
                index === 0 ? "md:col-span-2" : ""
              }`}
            >

              {/* IMAGE */}
              <div
                className={`relative overflow-hidden bg-slate-950 ${
                  index === 0
                    ? "aspect-[2/1]"
                    : "aspect-video"
                }`}
              >

                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">

                    <div className="absolute h-48 w-48 rounded-full bg-blue-500/20 blur-[100px]" />

                    <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
                      ✦
                    </div>

                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

              </div>

              {/* CONTENT */}
              <div className="p-6 md:p-8">

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <p className="text-xs uppercase tracking-[0.2em] text-blue-400">
                      {project.category || "Project"}
                    </p>

                    <h3 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                      {project.title}
                    </h3>

                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-700/70 bg-slate-900/50 text-slate-400 transition group-hover:border-blue-400/40 group-hover:text-blue-300">
                    ↗
                  </div>

                </div>

                {project.description && (
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
                    {project.description}
                  </p>
                )}

                <div className="mt-7 flex flex-wrap gap-3">

                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-blue-100"
                  >
                    View Live ↗
                  </a>

                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl border border-slate-700/80 bg-slate-900/40 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:border-blue-400/40 hover:text-white"
                    >
                      GitHub ↗
                    </a>
                  )}

                </div>

              </div>

            </article>
          ))}

        </div>
      ) : (
        <div className="glass rounded-3xl p-16 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
            ✦
          </div>

          <h3 className="mt-6 text-xl font-semibold">
            No projects here
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Try another category.
          </p>

        </div>
      )}

    </>
  );
}