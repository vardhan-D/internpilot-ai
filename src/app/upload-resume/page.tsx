"use client";

import { useState } from "react";

type AnalysisResult = {
  resumeScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  recommendedRoles: string[];
  projectRecommendations: {
    title: string;
    description: string;
    techStack: string[];
    difficulty: string;
  }[];
  improvementSuggestions: string[];
};

export default function UploadResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!file) {
      setMessage("Please upload a PDF resume first.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setAnalysis(null);

      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Failed to analyze resume.");
        return;
      }

      setAnalysis(data.analysis);
      setMessage(`Resume analyzed successfully: ${data.fileName}`);
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <section className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">Upload Resume</h1>
        <p className="mt-2 text-slate-400">
          Upload your PDF resume and get AI-powered feedback.
        </p>

        <div className="mt-8 rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-8">
          <label className="block text-sm font-medium text-slate-300">
            Resume PDF
          </label>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];

              if (!selectedFile) return;

              if (selectedFile.type !== "application/pdf") {
                setMessage("Only PDF files are allowed.");
                setFile(null);
                return;
              }

              setFile(selectedFile);
              setMessage("");
              setAnalysis(null);
            }}
            className="mt-4 block w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-slate-300"
          />

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="mt-6 rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>

          {message && (
            <p className="mt-4 rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm text-slate-300">
              {message}
            </p>
          )}
        </div>

        {analysis && (
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-bold">Resume Score</h2>
              <p className="mt-4 text-5xl font-bold text-green-400">
                {analysis.resumeScore}/100
              </p>
              <p className="mt-4 text-slate-300">{analysis.summary}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <ResultCard title="Strengths" items={analysis.strengths} />
              <ResultCard title="Weaknesses" items={analysis.weaknesses} />
              <ResultCard title="Missing Skills" items={analysis.missingSkills} />
              <ResultCard
                title="Recommended Roles"
                items={analysis.recommendedRoles}
              />
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-bold">Project Recommendations</h2>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {analysis.projectRecommendations?.map((project, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-700 bg-slate-950 p-4"
                  >
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    <p className="mt-2 text-sm text-slate-400">
                      {project.description}
                    </p>

                    <p className="mt-3 text-sm text-slate-300">
                      Difficulty: {project.difficulty}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.techStack?.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <ResultCard
              title="Improvement Suggestions"
              items={analysis.improvementSuggestions}
            />
          </div>
        )}
      </section>
    </main>
  );
}

function ResultCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-xl font-bold">{title}</h2>

      <ul className="mt-4 space-y-2">
        {items?.map((item, index) => (
          <li key={index} className="text-sm text-slate-300">
            • {item}
          </li>
        ))}
      </ul>
    </div>
  );
}