export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";
import ProjectFilters from "./ProjectFilters";

export default async function Home() {
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen overflow-hidden">

      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10 grid-background" />

      <div className="fixed left-1/2 top-[-300px] -z-10 h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[170px]" />

      <div className="fixed right-[-200px] top-[35%] -z-10 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[160px]" />

      <div className="fixed bottom-[-250px] left-[-200px] -z-10 h-[500px] w-[500px] rounded-full bg-blue-700/10 blur-[160px]" />

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 px-4 py-4 sm:px-5 sm:py-5">
        <div className="glass mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 sm:px-6 sm:py-4">

          {/* BRAND */}
          <a
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 ring-1 ring-blue-400/30">
              <div className="h-2.5 w-2.5 rounded-full bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,1)]" />
            </div>

            <div>
              <p className="text-sm font-semibold tracking-tight text-white">
                Rithvik Nag&apos;s
              </p>

              <p className="text-[10px] uppercase tracking-[0.2em] text-blue-400">
                Project Hub
              </p>
            </div>
          </a>

          {/* NAV */}
          <div className="flex items-center gap-2 sm:gap-3">

            <a
              href="#projects"
              className="hidden rounded-xl px-3 py-2 text-sm text-slate-400 transition hover:text-white sm:block"
            >
              Projects
            </a>

            <a
              href="#feedback"
              className="hidden rounded-xl px-3 py-2 text-sm text-slate-400 transition hover:text-white sm:block"
            >
              Feedback
            </a>

            <a
              href="/login"
              className="nag-login"
            >
              Nag Login
            </a>

          </div>

        </div>
      </nav>

      {/* HERO */}
      <section className="relative px-5 pb-28 pt-24 md:pb-36 md:pt-32">

        <div className="mx-auto max-w-5xl text-center">

          {/* STATUS */}
          <div className="glass mx-auto inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-blue-300 sm:text-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,1)]" />

            Building ideas into products
          </div>

          {/* NAME */}
          <p className="mt-8 text-sm font-medium uppercase tracking-[0.35em] text-blue-400 sm:text-base">
            Rithvik Nag
          </p>

          {/* MAIN HEADING */}
          <h1 className="mt-4 text-5xl font-bold tracking-[-0.05em] md:text-7xl lg:text-8xl">
            Ideas.
            <br />

            <span className="text-gradient">
              Built. Shipped. Live.
            </span>
          </h1>

          {/* DESCRIPTION */}
          <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-slate-400 md:text-lg">
            Welcome to my project hub — a collection of things I&apos;ve
            imagined, designed, built and brought to life.
          </p>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
            Explore the products, experiments and platforms I&apos;m
            building along the way.
          </p>

          {/* BUTTONS */}
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">

            <a
              href="#projects"
              className="rounded-xl bg-blue-500 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_40px_rgba(59,130,246,0.25)] transition hover:-translate-y-0.5 hover:bg-blue-400 hover:shadow-[0_0_60px_rgba(59,130,246,0.35)]"
            >
              Explore My Projects ↓
            </a>

            <a
              href="#feedback"
              className="glass rounded-xl px-7 py-3.5 text-sm font-medium text-slate-300 transition hover:-translate-y-0.5 hover:border-blue-400/40 hover:text-white"
            >
              Leave Feedback
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

          {/* SECTION HEADER */}
          <div className="mb-10 flex items-end justify-between">

            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-blue-400">
                My Work
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Things I&apos;ve built.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                Real projects, real experiments and ideas turned into
                working products.
              </p>
            </div>

            <span className="hidden text-sm text-slate-500 sm:block">
              {projects?.length || 0} projects
            </span>

          </div>

          {/* PROJECTS + FILTERS */}
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

      {/* FEEDBACK */}
      <section
        id="feedback"
        className="px-5 pb-32"
      >
        <div className="mx-auto max-w-4xl">

          <div className="glass blue-glow rounded-3xl p-8 text-center sm:p-12">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-xl text-blue-300">
              💬
            </div>

            <p className="mt-6 text-xs font-medium uppercase tracking-[0.3em] text-blue-400">
              Your Thoughts Matter
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Have feedback?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400 md:text-base">
              Tried one of my projects? Found something interesting?
              I&apos;d love to hear what you think.
            </p>

            <a
              href="/feedback"
              className="mt-7 inline-flex rounded-xl bg-blue-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_35px_rgba(59,130,246,0.2)] transition hover:bg-blue-400 hover:shadow-[0_0_55px_rgba(59,130,246,0.3)]"
            >
              Send Feedback →
            </a>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-blue-500/10 px-5 py-10">

        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="font-medium text-slate-400">
              Rithvik Nag&apos;s Project Hub
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Building ideas into real products.
            </p>
          </div>

          <p>
            © {new Date().getFullYear()} Rithvik Nag
          </p>

        </div>

      </footer>

    </main>
  );
}