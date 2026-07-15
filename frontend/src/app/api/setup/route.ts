import { NextResponse } from "next/server";

import {
  canRunSetup,
  initializeSystem,
} from "~/modules/setup/setup.service";

import { setupSchema } from "~/modules/setup/setup.validation";

export async function POST(req: Request) {
  try {
    // Check if setup is still allowed
    const allowed = await canRunSetup();

    if (!allowed) {
      return NextResponse.json(
        {
          error: "System has already been initialized.",
        },
        {
          status: 403,
        }
      );
    }

    // Parse request body
    const body = await req.json();

    // Validate input
    const result = setupSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    // Initialize the system
    const setup = await initializeSystem(result.data);

    return NextResponse.json(
      {
        success: true,
        message: "System initialized successfully.",
        school: {
          id: setup.school.id,
          name: setup.school.name,
          code: setup.school.code,
        },
        admin: {
          id: setup.admin.id,
          name: setup.admin.name,
          email: setup.admin.email,
          role: setup.admin.role,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Setup Error:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}