# InternPilot AI

InternPilot AI is a full-stack AI career assistant for students. It helps users upload resumes, receive AI-powered resume analysis, generate project recommendations, and track internship applications.

## Features

- AI-powered resume analysis
- PDF resume upload and text extraction
- Resume score, strengths, weaknesses, missing skills, and role recommendations
- User-specific saved resume analysis history
- AI-generated project recommendations
- Custom AI project generator based on role, skill level, tech stack, and duration
- Internship application tracker with add, edit, delete, and status updates
- Dashboard with resume and application statistics
- Clerk authentication
- PostgreSQL database with Prisma ORM

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Clerk Authentication
- Prisma ORM
- PostgreSQL
- Groq API / LLM API
- pdf-parse

## Project Flow

1. User signs in using Clerk.
2. User uploads a PDF resume.
3. Resume text is extracted using pdf-parse.
4. AI analyzes the resume and returns structured feedback.
5. Analysis is saved to PostgreSQL with the user's ID.
6. User can view saved analyses, project recommendations, and manage internship applications.

## Main Pages

- `/` - Landing page
- `/dashboard` - User dashboard with stats
- `/upload-resume` - Resume upload and AI analysis
- `/analysis` - Saved resume analyses
- `/projects` - Project recommendations and project generator
- `/tracker` - Internship application tracker

## Environment Variables

Create a `.env.local` file:

```env
GROQ_API_KEY=your_groq_api_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard