import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import {
  createStudent,
  createStudentSchema,
} from "~/modules/student";


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

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const data = createStudentSchema.parse(body);

    // TODO: Replace with authenticated user's schoolId
    const schoolId = "e448f8be-1387-40ee-8eac-63892fe51611";

    const student = await createStudent(schoolId, data);

    return NextResponse.json(
      {
        success: true,
        data: student,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create student.",
      },
      {
        status: 400,
      }
    );
  }
}