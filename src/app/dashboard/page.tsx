import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <section className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-slate-400">
          Welcome to InternPilot AI. Start by uploading your resume.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/upload-resume"
            className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:bg-slate-800"
          >
            <h2 className="text-xl font-semibold">Upload Resume</h2>
            <p className="mt-3 text-sm text-slate-400">
              Upload your resume and get AI-powered feedback.
            </p>
          </Link>

          <Link
            href="/analysis"
            className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:bg-slate-800"
          >
            <h2 className="text-xl font-semibold">Resume Analysis</h2>
            <p className="mt-3 text-sm text-slate-400">
              View your score, strengths, weaknesses, and missing skills.
            </p>
          </Link>

          <Link
            href="/projects"
            className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:bg-slate-800"
          >
            <h2 className="text-xl font-semibold">Projects</h2>
            <p className="mt-3 text-sm text-slate-400">
              Generate resume-worthy project ideas based on your profile.
            </p>
          </Link>

          <Link
            href="/tracker"
            className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:bg-slate-800"
          >
            <h2 className="text-xl font-semibold">Tracker</h2>
            <p className="mt-3 text-sm text-slate-400">
              Track internship applications, deadlines, and status.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}