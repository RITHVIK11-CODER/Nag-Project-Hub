"use client";

type Project = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  live_url: string;
  github_url: string | null;
  display_order: number;
};

export default function ProjectFilters({
  projects,
}: {
  projects: Project[];
}) {
  return (
    <div className="space-y-6">
      {projects.length === 0 ? (
        <div className="glass rounded-3xl p-10 text-center">
          <div className="mb-4 text-4xl">✦</div>

          <h3 className="text-xl font-semibold text-white">
            Projects coming soon
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            I'm currently building and shipping new ideas.
          </p>
        </div>
      ) : (
        projects.map((project, index) => (
          <article
            key={project.id}
            className="glass glass-hover group overflow-hidden rounded-3xl"
          >
            <div className="grid md:grid-cols-[0.9fr_1.1fr]">
              {/* Project Visual */}
              <div className="relative flex min-h-[240px] items-center justify-center overflow-hidden border-b border-white/5 bg-slate-950/50 md:min-h-[300px] md:border-b-0 md:border-r">
                {/* Blue ambient glow */}
                <div className="absolute h-48 w-48 rounded-full bg-blue-600/20 blur-[90px] transition duration-500 group-hover:bg-blue-500/30" />

                {/* Grid */}
                <div className="absolute inset-0 opacity-40 grid-background" />

                {/* Decorative lines */}
                <div className="absolute left-8 top-8 h-20 w-20 border-l border-t border-blue-400/20" />
                <div className="absolute bottom-8 right-8 h-20 w-20 border-b border-r border-blue-400/20" />

                {/* Center visual */}
                <div className="relative flex flex-col items-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-3xl text-blue-300 shadow-[0_0_40px_rgba(37,99,235,0.15)] transition duration-500 group-hover:scale-110 group-hover:border-blue-300/40 group-hover:shadow-[0_0_60px_rgba(37,99,235,0.25)]">
                    ✦
                  </div>

                  <span className="mt-4 text-xs uppercase tracking-[0.25em] text-slate-600">
                    Project {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Project Content */}
              <div className="flex flex-col justify-center p-6 sm:p-8 md:p-10">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
                  Built & Shipped
                </p>

                <h3 className="text-2xl font-bold tracking-tight text-white transition group-hover:text-blue-100 sm:text-3xl">
                  {project.title}
                </h3>

                {project.description && (
                  <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                    {project.description}
                  </p>
                )}

                <div className="mt-7 flex flex-wrap gap-3">
                  {/* Live Project */}
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border border-blue-400/30 bg-blue-600/15 px-5 py-3 text-sm font-semibold text-blue-200 transition hover:-translate-y-0.5 hover:border-blue-300/60 hover:bg-blue-600/25 hover:text-white hover:shadow-[0_0_30px_rgba(37,99,235,0.18)]"
                  >
                    View Live
                    <span className="ml-2">↗</span>
                  </a>

                  {/* GitHub */}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/40 px-5 py-3 text-sm font-medium text-slate-300 transition hover:-translate-y-0.5 hover:border-slate-500 hover:bg-slate-800/60 hover:text-white"
                    >
                      GitHub
                      <span className="ml-2">↗</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))
      )}
    </div>
  );
}