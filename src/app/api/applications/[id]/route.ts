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

    const application = await prisma.internshipApplication.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found." },
        { status: 404 }
      );
    }

    await prisma.internshipApplication.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ message: "Application deleted successfully." });
  } catch (error) {
    console.error("Delete application error:", error);

    return NextResponse.json(
      { error: "Failed to delete application." },
      { status: 500 }
    );
  }
}