import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        registrationNumber: true,
        name: true,
        fatherName: true,
        course: true,
        status: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch students.",
      },
      {
        status: 500,
      }
    );
  }
}