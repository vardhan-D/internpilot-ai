import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import type { ResumeAnalysis } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function AnalysisPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <section className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold">Unauthorized</h1>
          <p className="mt-2 text-slate-400">
            Please sign in to view your resume analyses.
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

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <section className="mx-auto max-w-6xl">
        <div>
          <h1 className="text-3xl font-bold">Saved Resume Analyses</h1>
          <p className="mt-2 text-slate-400">
            View all resume analysis results saved in your database.
          </p>
        </div>

        {analyses.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-slate-300">
              No resume analyses saved yet. Upload a resume first.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {analyses.map((item: ResumeAnalysis) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {item.fileName || "Resume Analysis"}
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                      Saved on {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-950 px-5 py-3 text-center">
                    <p className="text-sm text-slate-400">Score</p>
                    <p className="text-3xl font-bold text-green-400">
                      {item.resumeScore}/100
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-slate-300">{item.summary}</p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <ResultList title="Strengths" items={item.strengths} />
                  <ResultList title="Weaknesses" items={item.weaknesses} />
                  <ResultList
                    title="Missing Skills"
                    items={item.missingSkills}
                  />
                  <ResultList
                    title="Recommended Roles"
                    items={item.recommendedRoles}
                  />
                </div>

                <ResultList
                  title="Improvement Suggestions"
                  items={item.improvementSuggestions}
                  className="mt-4"
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function ResultList({
  title,
  items,
  className = "",
}: {
  title: string;
  items: string[];
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-slate-800 bg-slate-950 p-4 ${className}`}
    >
      <h3 className="font-semibold">{title}</h3>

      <ul className="mt-3 space-y-2">
        {items.map((item, index) => (
          <li key={index} className="text-sm text-slate-300">
            • {item}
          </li>
        ))}
      </ul>
    </div>
  );
}