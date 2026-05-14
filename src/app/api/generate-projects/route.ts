import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";

export const runtime = "nodejs";

type GeneratedProject = {
  title: string;
  description: string;
  techStack: string[];
  difficulty: string;
  features: string[];
  resumeBullet: string;
};

function getMockProjects(): GeneratedProject[] {
  return [
    {
      title: "AI Internship Tracker",
      description:
        "A full-stack platform that helps students track internships, analyze resumes, and generate personalized project recommendations.",
      techStack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Groq API"],
      difficulty: "Advanced",
      features: [
        "Resume upload and AI analysis",
        "Internship application tracker",
        "Project recommendation engine",
        "User-specific dashboard",
      ],
      resumeBullet:
        "Built an AI-powered internship tracking platform with resume analysis, project recommendations, and user-specific application management using Next.js, Prisma, PostgreSQL, and Groq API.",
    },
    {
      title: "Skill Gap Roadmap Generator",
      description:
        "An AI tool that analyzes a student's current skills and creates a personalized learning roadmap for a target internship role.",
      techStack: ["React", "Node.js", "PostgreSQL", "LLM API"],
      difficulty: "Intermediate",
      features: [
        "Skill gap detection",
        "Weekly roadmap generation",
        "Progress tracking",
        "Role-based recommendations",
      ],
      resumeBullet:
        "Developed an AI roadmap generator that identifies skill gaps and creates personalized learning plans for students targeting software internships.",
    },
  ];
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in first." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { targetRole, skillLevel, techStack, duration } = body;

    if (!targetRole || !skillLevel || !duration) {
      return NextResponse.json(
        { error: "Target role, skill level, and duration are required." },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({
        warning: "GROQ_API_KEY missing. Showing mock project ideas.",
        projects: getMockProjects(),
      });
    }

    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const prompt = `
You are an expert software project mentor.

Generate 3 resume-worthy project ideas for a student.

Inputs:
Target role: ${targetRole}
Skill level: ${skillLevel}
Preferred tech stack: ${techStack || "No preference"}
Project duration: ${duration}

Return ONLY valid JSON.
Do not include markdown.
Do not wrap in triple backticks.

Return this exact structure:

{
  "projects": [
    {
      "title": "project title",
      "description": "short project description",
      "techStack": ["tech 1", "tech 2", "tech 3"],
      "difficulty": "Beginner | Intermediate | Advanced",
      "features": ["feature 1", "feature 2", "feature 3", "feature 4"],
      "resumeBullet": "strong resume bullet for this project"
    }
  ]
}
`;

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    const text = response.choices[0]?.message?.content || "";

    try {
      const cleanedText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleanedText);

      return NextResponse.json({
        projects: parsed.projects || [],
      });
    } catch {
      return NextResponse.json({
        warning: "AI response was not valid JSON. Showing mock project ideas.",
        rawResponse: text,
        projects: getMockProjects(),
      });
    }
  } catch (error: unknown) {
    console.error("Generate projects error:", error);

    const err = error as { status?: number; message?: string };

    if (
      err.status === 429 ||
      err.message?.toLowerCase().includes("rate limit") ||
      err.message?.toLowerCase().includes("quota")
    ) {
      return NextResponse.json({
        warning: "AI provider limit reached. Showing mock project ideas.",
        projects: getMockProjects(),
      });
    }

    return NextResponse.json(
      { error: "Failed to generate project ideas." },
      { status: 500 }
    );
  }
}