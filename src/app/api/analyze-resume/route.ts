import { NextResponse } from "next/server";
import OpenAI from "openai";
import pdf from "pdf-parse/lib/pdf-parse.js";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
export const runtime = "nodejs";

type ResumeAnalysis = {
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

function getMockAnalysis(): ResumeAnalysis {
  return {
    resumeScore: 78,
    summary:
      "The candidate has a good foundation in full-stack development and AI/ML projects, with scope to improve deployment, measurable impact, and backend/database depth.",
    strengths: [
      "Good project experience in AI/ML and full-stack development",
      "Hands-on experience with React, Next.js, Python, and machine learning",
      "Strong academic background in computer science fundamentals",
    ],
    weaknesses: [
      "Projects need stronger measurable impact",
      "Resume should include more deployed project links",
      "Backend and database experience can be shown more clearly",
    ],
    missingSkills: [
      "Docker",
      "PostgreSQL",
      "System Design",
      "Testing",
      "Cloud Deployment",
    ],
    recommendedRoles: [
      "Full Stack Developer Intern",
      "AI/ML Intern",
      "Software Developer Intern",
    ],
    projectRecommendations: [
      {
        title: "AI Internship Tracker",
        description:
          "A full-stack platform that helps students analyze resumes, detect skill gaps, generate project ideas, and track internship applications.",
        techStack: ["Next.js", "PostgreSQL", "Prisma", "Groq API"],
        difficulty: "Advanced",
      },
      {
        title: "Smart Resume Analyzer",
        description:
          "An AI-powered resume feedback system that scores resumes and recommends improvements based on target job roles.",
        techStack: ["Next.js", "TypeScript", "LLM API", "Tailwind CSS"],
        difficulty: "Intermediate",
      },
    ],
    improvementSuggestions: [
      "Add GitHub and deployed links for all major projects",
      "Add metrics such as accuracy, users, processing time, or performance improvement",
      "Use stronger action verbs in project descriptions",
      "Add a separate section for technical skills grouped by category",
    ],
  };
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

    const formData = await request.formData();
    const file = formData.get("resume");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No resume file uploaded." },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const pdfData = await pdf(buffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: "Could not extract enough text from the PDF." },
        { status: 400 }
      );
    }

    const limitedResumeText = resumeText.slice(0, 12000);

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        {
          fileName: file.name,
          extractedTextPreview: resumeText.slice(0, 500),
          warning:
            "GROQ_API_KEY is missing. Showing mock analysis so development can continue.",
          analysis: getMockAnalysis(),
        },
        { status: 200 }
      );
    }

    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const prompt = `
You are an expert career coach for computer science students.

Analyze the resume text below and return ONLY valid JSON.
Do not include markdown.
Do not include explanation outside JSON.
Do not wrap the response in triple backticks.

Resume text:
${limitedResumeText}

Return this exact JSON structure:

{
  "resumeScore": number,
  "summary": "short summary of candidate profile",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "missingSkills": ["skill 1", "skill 2", "skill 3"],
  "recommendedRoles": ["role 1", "role 2", "role 3"],
  "projectRecommendations": [
    {
      "title": "project title",
      "description": "short description",
      "techStack": ["tech 1", "tech 2", "tech 3"],
      "difficulty": "Beginner | Intermediate | Advanced"
    }
  ],
  "improvementSuggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
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
      temperature: 0.2,
    });

    const text = response.choices[0]?.message?.content || "";

    let analysis: ResumeAnalysis;

    try {
      const cleanedText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      analysis = JSON.parse(cleanedText);
    } catch {
      return NextResponse.json(
        {
          error: "AI response was not valid JSON.",
          rawResponse: text,
          fallbackAnalysis: getMockAnalysis(),
        },
        { status: 500 }
      );
    }
await prisma.resumeAnalysis.create({
  data: {
    userId,
    fileName: file.name,
    extractedTextPreview: resumeText.slice(0, 500),
    resumeScore: analysis.resumeScore,
    summary: analysis.summary,
    strengths: analysis.strengths,
    weaknesses: analysis.weaknesses,
    missingSkills: analysis.missingSkills,
    recommendedRoles: analysis.recommendedRoles,
    projectRecommendations: analysis.projectRecommendations,
    improvementSuggestions: analysis.improvementSuggestions,
  },
});

    return NextResponse.json({
      fileName: file.name,
      extractedTextPreview: resumeText.slice(0, 500),
      analysis,
    });
  } catch (error: unknown) {
    console.error("Resume analysis error:", error);

    const err = error as { status?: number; message?: string };

    if (
      err.status === 429 ||
      err.message?.toLowerCase().includes("rate limit") ||
      err.message?.toLowerCase().includes("quota")
    ) {
      return NextResponse.json({
        fileName: "fallback-analysis",
        extractedTextPreview:
          "AI provider limit was reached. Showing fallback mock analysis.",
        warning:
          "Groq rate limit or quota reached. Showing mock analysis so development can continue.",
        analysis: getMockAnalysis(),
      });
    }

    return NextResponse.json(
      { error: "Something went wrong while analyzing the resume." },
      { status: 500 }
    );
  }
}