"use client";

import { useState } from "react";

type GeneratedProject = {
  title: string;
  description: string;
  techStack: string[];
  difficulty: string;
  features: string[];
  resumeBullet: string;
};

export default function ProjectGenerator() {
  const [form, setForm] = useState({
    targetRole: "Full Stack Developer Intern",
    skillLevel: "Intermediate",
    techStack: "Next.js, PostgreSQL, Prisma, AI API",
    duration: "2 weeks",
  });

  const [projects, setProjects] = useState<GeneratedProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleGenerate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");
      setProjects([]);

      const response = await fetch("/api/generate-projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Failed to generate projects.");
        return;
      }

      if (data.warning) {
        setMessage(data.warning);
      }

      setProjects(data.projects || []);
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while generating project ideas.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-2xl font-bold">Generate New Project Ideas</h2>
      <p className="mt-2 text-sm text-slate-400">
        Generate fresh resume-worthy projects based on your target role and
        available time.
      </p>

      <form onSubmit={handleGenerate} className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-slate-300">Target Role</label>
          <input
            value={form.targetRole}
            onChange={(e) =>
              setForm({ ...form, targetRole: e.target.value })
            }
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-slate-400"
          />
        </div>

        <div>
          <label className="text-sm text-slate-300">Skill Level</label>
          <select
            value={form.skillLevel}
            onChange={(e) =>
              setForm({ ...form, skillLevel: e.target.value })
            }
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-slate-400"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-slate-300">Preferred Tech Stack</label>
          <input
            value={form.techStack}
            onChange={(e) => setForm({ ...form, techStack: e.target.value })}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-slate-400"
          />
        </div>

        <div>
          <label className="text-sm text-slate-300">Project Duration</label>
          <select
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-slate-400"
          >
            <option>1 week</option>
            <option>2 weeks</option>
            <option>3 weeks</option>
            <option>1 month</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <button
            disabled={loading}
            className="rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate Projects"}
          </button>
        </div>
      </form>

      {message && (
        <p className="mt-4 rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm text-slate-300">
          {message}
        </p>
      )}

      {projects.length > 0 && (
        <div className="mt-6 grid gap-4">
          {projects.map((project, index) => (
            <div
              key={`${project.title}-${index}`}
              className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <h3 className="text-xl font-bold">{project.title}</h3>
                <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
                  {project.difficulty}
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                {project.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.techStack?.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-slate-900 px-3 py-1 text-xs text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-4">
                <p className="font-semibold">Features</p>
                <ul className="mt-2 space-y-1">
                  {project.features?.map((feature, i) => (
                    <li key={i} className="text-sm text-slate-300">
                      • {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
                <p className="text-sm font-semibold text-slate-300">
                  Resume Bullet
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  {project.resumeBullet}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}