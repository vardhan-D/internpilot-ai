import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const applications = await prisma.internshipApplication.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Fetch applications error:", error);

    return NextResponse.json(
      { error: "Failed to fetch applications." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { company, role, status, link, deadline, notes } = body;

    if (!company || !role || !status) {
      return NextResponse.json(
        { error: "Company, role, and status are required." },
        { status: 400 }
      );
    }

    const application = await prisma.internshipApplication.create({
      data: {
        company,
        role,
        status,
        link: link || null,
        deadline: deadline ? new Date(deadline) : null,
        notes: notes || null,
      },
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error("Create application error:", error);

    return NextResponse.json(
      { error: "Failed to create application." },
      { status: 500 }
    );
  }
}