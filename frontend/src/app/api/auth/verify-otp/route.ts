import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "~/lib/prisma";

const verifyOtpSchema = z.object({
  email: z.string().trim().email(),
  otp: z
    .string()
    .trim()
    .length(6, "OTP must be 6 digits"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = verifyOtpSchema.safeParse(body);

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

    const { email, otp } = result.data;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid OTP.",
        },
        {
          status: 400,
        }
      );
    }

    const token = await prisma.passwordResetToken.findFirst({
      where: {
        userId: user.id,
        used: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!token) {
      return NextResponse.json(
        {
          error: "OTP not found.",
        },
        {
          status: 400,
        }
      );
    }

    if (token.expiresAt < new Date()) {
      return NextResponse.json(
        {
          error: "OTP has expired.",
        },
        {
          status: 400,
        }
      );
    }

    const valid = await bcrypt.compare(
      otp,
      token.otpHash
    );

    if (!valid) {
      return NextResponse.json(
        {
          error: "Invalid OTP.",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}