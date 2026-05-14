import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <section className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold">Unauthorized</h1>
          <p className="mt-2 text-slate-400">
            Please sign in to view your dashboard.
          </p>
        </section>
      </main>
    );
  }

  const analyses = await prisma.resumeAnalysis.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const applications = await prisma.internshipApplication.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const latestAnalysis = analyses[0];

  const appliedCount = applications.filter(
    (app) => app.status === "Applied"
  ).length;

  const interviewCount = applications.filter(
    (app) => app.status === "Interview"
  ).length;

  const selectedCount = applications.filter(
    (app) => app.status === "Selected"
  ).length;

  const missingSkills = analyses.flatMap((analysis) => analysis.missingSkills);

  const topMissingSkills = Array.from(new Set(missingSkills)).slice(0, 8);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <section className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="mt-2 text-slate-400">
              Track your resume progress, project ideas, and internship
              applications.
            </p>
          </div>

          <Link
            href="/upload-resume"
            className="rounded-xl bg-white px-5 py-3 text-center font-semibold text-slate-950 hover:bg-slate-200"
          >
            Analyze New Resume
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Resumes Analyzed"
            value={analyses.length.toString()}
            description="Total saved resume analyses"
          />

          <StatCard
            title="Latest Score"
            value={
              latestAnalysis ? `${latestAnalysis.resumeScore}/100` : "N/A"
            }
            description="Most recent resume score"
          />

          <StatCard
            title="Applications"
            value={applications.length.toString()}
            description="Total tracked applications"
          />

          <StatCard
            title="Interviews"
            value={interviewCount.toString()}
            description="Applications in interview stage"
          />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">
            <h2 className="text-2xl font-bold">Application Status</h2>
            <p className="mt-2 text-sm text-slate-400">
              Quick overview of your internship progress.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <StatusBox title="Applied" value={appliedCount} />
              <StatusBox title="Interview" value={interviewCount} />
              <StatusBox title="Selected" value={selectedCount} />
            </div>

            <div className="mt-6">
              <Link
                href="/tracker"
                className="inline-block rounded-xl border border-slate-700 px-5 py-3 font-semibold text-white hover:bg-slate-800"
              >
                Open Tracker
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">Top Missing Skills</h2>
            <p className="mt-2 text-sm text-slate-400">
              Skills detected from your resume analysis.
            </p>

            {topMissingSkills.length === 0 ? (
              <p className="mt-6 text-sm text-slate-300">
                No missing skills found yet. Analyze a resume first.
              </p>
            ) : (
              <div className="mt-6 flex flex-wrap gap-2">
                {topMissingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-sm text-slate-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <ActionCard
            title="Resume Analysis"
            description="View your saved resume scores, strengths, weaknesses, and suggestions."
            href="/analysis"
          />

          <ActionCard
            title="Project Recommendations"
            description="Explore AI-generated project ideas based on your resume."
            href="/projects"
          />

          <ActionCard
            title="Internship Tracker"
            description="Add, track, and manage your internship applications."
            href="/tracker"
          />
        </div>
      </section>
    </main>
    </>
  );
}

function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-3 text-4xl font-bold">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function StatusBox({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

function ActionCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:bg-slate-800"
    >
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-3 text-sm text-slate-400">{description}</p>
    </Link>
  );
}