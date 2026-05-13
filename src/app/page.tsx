import { auth } from "@clerk/nextjs/server";
import AuthButtons from "@/components/AuthButtons";
import HeroButtons from "@/components/HeroButtons";

export default async function Home() {
  const { userId } = await auth();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
        <div className="absolute right-6 top-6 flex items-center gap-4">
          <AuthButtons userId={userId} />
        </div>

        <div className="mb-4 rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300">
          AI Career Assistant for Students
        </div>

        <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
          Build your internship path with AI-powered resume analysis.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-300">
          InternPilot AI helps students analyze resumes, detect missing skills,
          generate project ideas, create learning roadmaps, and track internship
          applications in one place.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <HeroButtons userId={userId} />
        </div>

        <div className="mt-16 grid w-full gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left">
            <h3 className="text-xl font-semibold">Resume Analysis</h3>
            <p className="mt-3 text-slate-400">
              Get a resume score, strengths, weaknesses, missing skills, and
              improvement suggestions.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left">
            <h3 className="text-xl font-semibold">Project Recommendations</h3>
            <p className="mt-3 text-slate-400">
              Receive personalized project ideas based on your current skills and
              target internship role.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left">
            <h3 className="text-xl font-semibold">Internship Tracker</h3>
            <p className="mt-3 text-slate-400">
              Track companies, roles, application status, deadlines, links, and
              notes from one dashboard.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}