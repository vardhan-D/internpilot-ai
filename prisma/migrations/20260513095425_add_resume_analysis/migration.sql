-- CreateTable
CREATE TABLE "public"."ResumeAnalysis" (
    "id" TEXT NOT NULL,
    "fileName" TEXT,
    "extractedTextPreview" TEXT,
    "resumeScore" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "strengths" TEXT[],
    "weaknesses" TEXT[],
    "missingSkills" TEXT[],
    "recommendedRoles" TEXT[],
    "projectRecommendations" JSONB NOT NULL,
    "improvementSuggestions" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResumeAnalysis_pkey" PRIMARY KEY ("id")
);
