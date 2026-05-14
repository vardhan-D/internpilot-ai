import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function PUT(
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
    const body = await request.json();

    const { company, role, status, link, deadline, notes } = body;

    if (!company || !role || !status) {
      return NextResponse.json(
        { error: "Company, role, and status are required." },
        { status: 400 }
      );
    }

    const existingApplication = await prisma.internshipApplication.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingApplication) {
      return NextResponse.json(
        { error: "Application not found." },
        { status: 404 }
      );
    }

    const updatedApplication = await prisma.internshipApplication.update({
      where: {
        id,
      },
      data: {
        company,
        role,
        status,
        link: link || null,
        deadline: deadline ? new Date(deadline) : null,
        notes: notes || null,
      },
    });

    return NextResponse.json({ application: updatedApplication });
  } catch (error) {
    console.error("Update application error:", error);

    return NextResponse.json(
      { error: "Failed to update application." },
      { status: 500 }
    );
  }
}

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