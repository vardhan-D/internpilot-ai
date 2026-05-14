import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in first." },
        { status: 401 }
      );
    }

    const { id } = await params;

    const analysis = await prisma.resumeAnalysis.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!analysis) {
      return NextResponse.json(
        { error: "Resume analysis not found." },
        { status: 404 }
      );
    }

    await prisma.resumeAnalysis.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Resume analysis deleted successfully.",
    });
  } catch (error) {
    console.error("Delete resume analysis error:", error);

    return NextResponse.json(
      { error: "Failed to delete resume analysis." },
      { status: 500 }
    );
  }
}