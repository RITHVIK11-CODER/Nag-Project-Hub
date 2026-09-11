
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import AddProjectForm from "./AddProjectForm";
import ProjectList from "./ProjectList";
import LogoutButton from "./LogoutButton";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-5 py-6 sm:px-8 sm:py-10">

      {/* Background */}
      <div className="fixed inset-0 -z-10 grid-background" />

      <div className="fixed left-1/2 top-[-250px] -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[170px]" />

      <div className="fixed right-[-200px] top-[35%] -z-10 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[160px]" />

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <header className="glass blue-glow flex flex-col gap-5 rounded-3xl p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/15 ring-1 ring-blue-400/30">
              <div className="h-3 w-3 rounded-full bg-blue-400 shadow-[0_0_20px_rgba(96,165,250,1)]" />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-blue-400">
                Admin Panel
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Project Manager
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Add, edit and manage your projects.
              </p>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <a
              href="/"
              className="flex-1 rounded-xl border border-slate-700/80 bg-slate-900/40 px-4 py-2.5 text-center text-sm font-medium text-slate-300 transition hover:border-blue-400/40 hover:text-white sm:flex-none"
            >
              View Site
            </a>

            <LogoutButton />

          </div>

        </header>

        {/* ADD PROJECT */}
        <section className="mt-8">

          <div className="mb-5">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-blue-400">
              Create
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              Add New Project
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Upload your project details and screenshot.
            </p>
          </div>

          <div className="glass rounded-3xl p-5 sm:p-8">
            <AddProjectForm />
          </div>

        </section>

        {/* PROJECT LIST */}
        <section className="mt-12 pb-16">

          <div className="mb-5">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-blue-400">
              Manage
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              Your Projects
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Edit or remove projects already published.
            </p>
          </div>

          <ProjectList />

        </section>

      </div>

    </main>
  );
}
