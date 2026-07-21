import { NextRequest, NextResponse } from "next/server";

import {
  financeQuerySchema,
  createFeePaymentSchema,
} from "~/modules/finance";

import {
  getFeePayments,
  createFeePayment,
} from "~/modules/finance/server";

import { verifyToken } from "~/modules/auth/jwt";

export async function GET(request: NextRequest) {
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

    const params = Object.fromEntries(
      request.nextUrl.searchParams.entries()
    );

    const query = financeQuerySchema.parse(params);

    const result = await getFeePayments(
      payload.schoolId,
      query
    );

    return NextResponse.json({
      success: true,
      message: "Fee payments fetched successfully.",
      ...result,
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

export async function POST(request: NextRequest) {
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

    const body = createFeePaymentSchema.parse(
      await request.json()
    );

    const payment = await createFeePayment(
      payload.schoolId,
      body
    );

    return NextResponse.json(
      {
        success: true,
        message: "Fee payment created successfully.",
        data: payment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Finance POST Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}