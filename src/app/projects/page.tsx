import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

type ProjectRecommendation = {
  title: string;
  description: string;
  techStack: string[];
  difficulty: string;
};

export default async function ProjectsPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <section className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold">Unauthorized</h1>
          <p className="mt-2 text-slate-400">
            Please sign in to view your project recommendations.
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

  const projects: ProjectRecommendation[] = analyses.flatMap((analysis) => {
    const recommendations = analysis.projectRecommendations;

    if (!Array.isArray(recommendations)) {
      return [];
    }

    return recommendations
      .filter((project) => {
        return (
          typeof project === "object" &&
          project !== null &&
          "title" in project &&
          "description" in project &&
          "techStack" in project &&
          "difficulty" in project
        );
      })
      .map((project) => project as ProjectRecommendation);
  });

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <section className="mx-auto max-w-6xl">
        <div>
          <h1 className="text-3xl font-bold">Project Recommendations</h1>
          <p className="mt-2 text-slate-400">
            Resume-based project ideas generated from your saved AI analyses.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-slate-300">
              No project recommendations found yet. Upload and analyze a resume
              first.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {projects.map((project, index) => (
              <div
                key={`${project.title}-${index}`}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-xl font-bold">{project.title}</h2>

                  <span className="rounded-full bg-slate-950 px-3 py-1 text-xs text-slate-300">
                    {project.difficulty}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-400">
                  {project.description}
                </p>

                <div className="mt-5">
                  <p className="text-sm font-semibold text-slate-300">
                    Tech Stack
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}