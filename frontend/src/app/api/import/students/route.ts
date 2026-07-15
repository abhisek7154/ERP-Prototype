import { NextRequest, NextResponse } from "next/server";

import { importStudents } from "~/modules/import/students/student-import.service";

import { getAuthenticationUser } from "~/modules/auth/auth.helper";

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
    const auth = await getAuthenticationUser();

      if (!auth) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }

const schoolId = auth.schoolId;

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