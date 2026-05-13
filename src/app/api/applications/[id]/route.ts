import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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