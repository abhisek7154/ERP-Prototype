import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "~/lib/prisma";

const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = resetPasswordSchema.safeParse(body);

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

    const { email, otp, password } = result.data;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid request.",
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
          error: "OTP expired.",
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

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          passwordHash,
        },
      });

      await tx.passwordResetToken.update({
        where: {
          id: token.id,
        },
        data: {
          used: true,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Password updated successfully.",
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