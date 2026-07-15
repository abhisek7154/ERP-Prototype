import crypto from "crypto";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "~/lib/prisma";
import { resend } from "~/modules/mail/resend";

const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
});

const OTP_EXPIRY_MINUTES = 10;

function generateOTP() {
  return crypto.randomInt(100000, 1000000).toString();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = forgotPasswordSchema.safeParse(body);

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

    const { email } = result.data;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // Prevent email enumeration
    if (!user || !user.isActive) {
      return NextResponse.json({
        success: true,
        message:
          "If an account exists, a password reset code has been sent.",
      });
    }

    const otp = generateOTP();

    const otpHash = await bcrypt.hash(otp, 10);

    const expiresAt = new Date(
      Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
    );

    await prisma.$transaction(async (tx) => {
      await tx.passwordResetToken.deleteMany({
        where: {
          userId: user.id,
        },
      });

      await tx.passwordResetToken.create({
        data: {
          userId: user.id,
          otpHash,
          expiresAt,
        },
      });
    });

    await resend.emails.send({
      from: "School ERP <onboarding@resend.dev>",
      to: email,
      subject: "Reset your School ERP password",
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #f3f4f6;
      font-family: Arial, Helvetica, sans-serif;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }

    .wrapper {
      width: 100%;
      background: #f3f4f6;
      padding: 32px 16px;
    }

    .container {
      width: 100%;
      max-width: 640px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 10px 35px rgba(0, 0, 0, 0.08);
    }

    .header {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      padding: 40px 32px;
      text-align: center;
      color: #ffffff;
    }

    .logo {
      width: 72px;
      height: 72px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.16);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 38px;
      line-height: 1;
      margin-bottom: 14px;
    }

    .brand {
      margin: 0;
      font-size: 30px;
      font-weight: 700;
      letter-spacing: 0.2px;
    }

    .subtitle {
      margin: 8px 0 0;
      font-size: 15px;
      opacity: 0.92;
      line-height: 1.6;
    }

    .content {
      padding: 40px 32px 36px;
      color: #111827;
    }

    .title {
      margin: 0 0 14px;
      font-size: 24px;
      line-height: 1.3;
      color: #111827;
    }

    .text {
      margin: 0 0 14px;
      font-size: 16px;
      line-height: 1.8;
      color: #4b5563;
    }

    .otp-wrap {
      margin: 34px 0 28px;
      text-align: center;
    }

    .otp-box {
      display: inline-block;
      padding: 18px 28px;
      background: #eff6ff;
      border: 2px dashed #2563eb;
      border-radius: 14px;
      color: #2563eb;
      font-size: 34px;
      font-weight: 700;
      letter-spacing: 10px;
      line-height: 1;
      min-width: 240px;
      box-sizing: border-box;
      word-break: break-all;
    }

    .notice {
      background: #f9fafb;
      border-left: 4px solid #2563eb;
      padding: 16px 18px;
      border-radius: 10px;
      margin: 26px 0 0;
    }

    .notice p {
      margin: 0;
      font-size: 15px;
      line-height: 1.7;
      color: #374151;
    }

    .footer {
      background: #f9fafb;
      padding: 22px 28px;
      text-align: center;
      font-size: 13px;
      color: #6b7280;
      line-height: 1.6;
    }

    .footer strong {
      color: #111827;
    }

    @media screen and (max-width: 600px) {
      .wrapper {
        padding: 18px 10px;
      }

      .header {
        padding: 32px 20px;
      }

      .content {
        padding: 28px 20px 26px;
      }

      .footer {
        padding: 18px 20px;
      }

      .brand {
        font-size: 24px;
      }

      .title {
        font-size: 21px;
      }

      .text {
        font-size: 15px;
        line-height: 1.75;
      }

      .otp-box {
        width: 100%;
        max-width: 100%;
        padding: 16px 14px;
        font-size: 28px;
        letter-spacing: 8px;
        overflow-wrap: anywhere;
      }
    }

    @media screen and (max-width: 420px) {
      .otp-box {
        font-size: 24px;
        letter-spacing: 6px;
        padding: 14px 12px;
      }

      .logo {
        width: 60px;
        height: 60px;
        font-size: 32px;
      }
    }
  </style>
</head>

<body>
  <div class="wrapper">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center">
          <table class="container" width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td class="header">
                <div class="logo">🏫</div>
                <h1 class="brand">School ERP</h1>
                <p class="subtitle">Secure Password Reset Verification</p>
              </td>
            </tr>

            <tr>
              <td class="content">
                <h2 class="title">Reset Your Password</h2>

                <p class="text">
                  We received a request to reset the password for your School ERP administrator account.
                  Use the One-Time Password (OTP) below to continue.
                </p>

                <div class="otp-wrap">
                  <div class="otp-box">${otp}</div>
                </div>

                <div class="notice">
                  <p>
                    ⏳ This OTP is valid for <strong>${OTP_EXPIRY_MINUTES} minutes</strong>.
                    If you did not request this password reset, you can safely ignore this email.
                    Your password will remain unchanged.
                  </p>
                </div>
              </td>
            </tr>

            <tr>
              <td class="footer">
                <strong>School ERP</strong><br />
                Made for modern school administration
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
`,
    });

    return NextResponse.json({
      success: true,
      message:
        "If an account exists, a password reset code has been sent.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);

    return NextResponse.json(
      {
        error: "Unable to process password reset request.",
      },
      {
        status: 500,
      }
    );
  }
}