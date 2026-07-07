import { NextRequest, NextResponse } from "next/server";

import { importStudents } from "~/modules/import/students/student-import.service";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "Excel file is required.",
        },
        { status: 400 },
      );
    }

    // Temporary: replace with real schoolId later from auth/session
    const schoolId = "e448f8be-1387-40ee-8eac-63892fe51611";

    const result = await importStudents(file, schoolId);

    return NextResponse.json({
      success: true,
      message: "Students imported successfully.",
      data: result,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Student import failed.",
      },
      { status: 500 },
    );
  }
}