import { NextRequest, NextResponse } from "next/server";

import { updateFeePaymentSchema } from "~/modules/finance";

import {
  deleteFeePayment,
  getFeePaymentById,
  updateFeePayment,
} from "~/modules/finance/server";

import { verifyToken } from "~/modules/auth/jwt";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// ----------------------------------------
// GET /api/finance/:id
// ----------------------------------------
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token",
        },
        { status: 401 }
      );
    }

    const { id } = await params;

    const payment = await getFeePaymentById(
      id,
      payload.schoolId
    );

    if (!payment) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error("Finance GET Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

// ----------------------------------------
// PUT /api/finance/:id
// ----------------------------------------
export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token",
        },
        { status: 401 }
      );
    }

    const { id } = await params;

    const body = updateFeePaymentSchema.parse(
      await request.json()
    );

    const payment = await updateFeePayment(
      id,
      payload.schoolId,
      body
    );

    return NextResponse.json({
      success: true,
      message: "Payment updated successfully.",
      data: payment,
    });
  } catch (error) {
    console.error("Finance PUT Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

// ----------------------------------------
// DELETE /api/finance/:id
// ----------------------------------------
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token",
        },
        { status: 401 }
      );
    }

    const { id } = await params;

    await deleteFeePayment(
      id,
      payload.schoolId
    );

    return NextResponse.json({
      success: true,
      message: "Payment deleted successfully.",
    });
  } catch (error) {
    console.error("Finance DELETE Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}