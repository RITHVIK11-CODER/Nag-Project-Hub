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

              {/* PROJECT VISUAL */}
              <div
                className={`relative overflow-hidden bg-slate-950 ${
                  index === 0
                    ? "aspect-[2/1]"
                    : "aspect-video"
                }`}
              >

                {/* Ambient glow */}
                <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/20 blur-[90px] transition duration-700 group-hover:bg-blue-500/30" />

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12),transparent_60%)]" />

                {/* Decorative grid */}
                <div className="absolute inset-0 opacity-30">
                  <div
                    className="h-full w-full"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px)",
                      backgroundSize: "40px 40px",
                    }}
                  />
                </div>

                {/* Center project identity */}
                <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-2xl text-blue-300 shadow-[0_0_35px_rgba(37,99,235,0.15)] transition duration-500 group-hover:scale-110 group-hover:border-blue-400/40">
                    ✦
                  </div>

                  <p className="mt-5 text-xs font-medium uppercase tracking-[0.3em] text-blue-400">
                    {project.category || "Project"}
                  </p>

                  <h3 className="mt-2 max-w-xl text-2xl font-bold tracking-tight text-white md:text-4xl">
                    {project.title}
                  </h3>

                  <p className="mt-3 max-w-lg text-sm text-slate-500">
                    Built from idea to deployment
                  </p>

                </div>

                {/* Top shine */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

                {/* Bottom gradient */}
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

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-2xl text-blue-300">
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