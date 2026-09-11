
import { supabase } from "@/lib/supabase";
import ProjectFilters from "./ProjectFilters";

export default async function Home() {
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen overflow-hidden">

      {/* Ambient background */}
      <div className="fixed inset-0 -z-10 grid-background" />

      <div className="fixed left-1/2 top-[-300px] -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[160px]" />

      <div className="fixed right-[-200px] top-[30%] -z-10 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[160px]" />

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 px-4 py-4 sm:px-5 sm:py-5">
        <div className="glass mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 sm:px-5 sm:py-4">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 ring-1 ring-blue-400/30">
              <div className="h-2.5 w-2.5 rounded-full bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,1)]" />
            </div>

            <span className="font-semibold tracking-tight">
              PROJECTS
            </span>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2 sm:gap-3">

            <a
              href="#projects"
              className="hidden text-sm text-slate-400 transition hover:text-white sm:block"
            >
              Explore
            </a>

            <a
              href="/login"
              className="rounded-xl border border-blue-400/30 bg-blue-500/10 px-3 py-2 text-xs font-medium text-blue-300 transition hover:border-blue-400/50 hover:bg-blue-500/20 hover:text-white sm:px-4 sm:text-sm"
            >
              Nag Login
            </a>

          </div>

        </div>
      </nav>

      {/* HERO */}
      <section className="relative px-5 pb-24 pt-24 md:pb-32 md:pt-32">

        <div className="mx-auto max-w-5xl text-center">

          {/* Badge */}
          <div className="glass mx-auto inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-blue-300">
            <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,1)]" />

            Building • Designing • Shipping
          </div>

          {/* Heading */}
          <h1 className="mt-8 text-5xl font-bold tracking-[-0.04em] md:text-7xl lg:text-8xl">
            Turning ideas into
            <br />

            <span className="text-gradient">
              real products.
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-slate-400 md:text-lg">
            A collection of applications, platforms and experiments
            I&apos;ve built — from idea to deployment.
          </p>

          {/* CTA */}
          <div className="mt-10 flex justify-center">
            <a
              href="#projects"
              className="group rounded-xl bg-blue-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_40px_rgba(59,130,246,0.25)] transition hover:bg-blue-400 hover:shadow-[0_0_60px_rgba(59,130,246,0.35)]"
            >
              Explore Projects

              <span className="ml-2 transition group-hover:translate-y-0.5">
                ↓
              </span>
            </a>
          </div>

        </div>
      </section>

      {/* PROJECTS */}
      <section
        id="projects"
        className="px-5 pb-32"
      >
        <div className="mx-auto max-w-6xl">

          {/* Section heading */}
          <div className="mb-10 flex items-end justify-between">

            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-blue-400">
                Selected Work
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                Projects
              </h2>
            </div>

            <span className="hidden text-sm text-slate-500 sm:block">
              {projects?.length || 0} projects
            </span>

          </div>

          {/* Project filters */}
          {projects && projects.length > 0 ? (
            <ProjectFilters projects={projects} />
          ) : (
            <div className="glass rounded-3xl p-16 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-2xl text-blue-300">
                ✦
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                Projects coming soon
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                New work will appear here.
              </p>

            </div>
          )}

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-blue-500/10 px-5 py-10">

        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 text-sm text-slate-500 sm:flex-row">

          <p>
            Built with Next.js + Supabase
          </p>

          <p>
            © {new Date().getFullYear()}
          </p>

        </div>

      </footer>

    </main>
  );
}