import { NextRequest, NextResponse } from "next/server";

import { verifyToken } from "~/modules/auth/jwt";
import { getPaymentReceipt } from "~/modules/finance/services/server";

interface RouteContext {
  params: Promise<{
    paymentId: string;
  }>;
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(value: unknown): string {
  if (!value) return "-";

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatTime(value: unknown): string {
  if (!value) return "";

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMoney(value: unknown): string {
  const amount = Number(value ?? 0);

  return `₹${amount.toFixed(2)}`;
}

function getReceiptHtml(
  receipt: any,
  format: "a4" | "thermal58" | "thermal80",
) {
  const admission = receipt?.admission;
  const student = admission?.student;
  const items = Array.isArray(receipt?.paymentItems)
    ? receipt.paymentItems
    : [];

  const isThermal =
    format === "thermal58" ||
    format === "thermal80";

  const pageWidth =
    format === "thermal58"
      ? "58mm"
      : format === "thermal80"
        ? "80mm"
        : "210mm";

  const padding =
    format === "a4"
      ? "18mm"
      : "5mm";

  const studentName =
    student?.name ?? "Student";

  const receiptNumber =
    receipt?.receiptNumber ?? "-";

  const paymentDate =
    receipt?.receiptDate;

  const rows = items
    .map(
      (item: any) => `
        <tr>
          <td>
            ${escapeHtml(item?.title ?? "Fee")}
          </td>
          <td class="amount">
            ${formatMoney(item?.amount)}
          </td>
        </tr>
      `,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Receipt ${escapeHtml(receiptNumber)}</title>

  <style>
    @page {
      size: ${pageWidth} auto;
      margin: 0;
    }

    * {
      box-sizing: border-box;
    }

    html,
    body {
      margin: 0;
      padding: 0;
      background: #fff;
      color: #111;
      font-family: Arial, Helvetica, sans-serif;
    }

    body {
      width: ${pageWidth};
      margin: 0 auto;
      padding: ${padding};
    }

    .receipt {
      width: 100%;
    }

    .center {
      text-align: center;
    }

    .title {
      font-size: ${
        isThermal ? "18px" : "24px"
      };
      font-weight: 700;
      margin-bottom: 4px;
    }

    .subtitle {
      font-size: ${
        isThermal ? "11px" : "14px"
      };
      margin-bottom: 14px;
    }

    .line {
      border-top: 1px dashed #222;
      margin: 8px 0;
    }

    .meta {
      width: 100%;
      border-collapse: collapse;
      font-size: ${
        isThermal ? "11px" : "13px"
      };
    }

    .meta td {
      padding: 3px 0;
      vertical-align: top;
    }

    .meta td:first-child {
      font-weight: 600;
      width: 42%;
    }

    .items {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      font-size: ${
        isThermal ? "11px" : "13px"
      };
    }

    .items th,
    .items td {
      padding: 5px 0;
      border-bottom: 1px solid #ddd;
    }

    .items th {
      text-align: left;
      font-weight: 700;
    }

    .items .amount {
      text-align: right;
      white-space: nowrap;
    }

    .total {
      display: flex;
      justify-content: space-between;
      font-weight: 700;
      font-size: ${
        isThermal ? "13px" : "16px"
      };
      margin-top: 12px;
    }

    .footer {
      text-align: center;
      margin-top: 18px;
      font-size: ${
        isThermal ? "10px" : "12px"
      };
    }

    .remarks {
      margin-top: 10px;
      font-size: ${
        isThermal ? "10px" : "12px"
      };
    }

    @media print {
      body {
        margin: 0;
      }
    }
  </style>
</head>

<body>
  <div class="receipt">

    <div class="center">
      <div class="title">
        CICA Institute
      </div>

      <div class="subtitle">
        Fee Payment Receipt
      </div>
    </div>

    <div class="line"></div>

    <table class="meta">
      <tr>
        <td>Receipt No.</td>
        <td>${escapeHtml(receiptNumber)}</td>
      </tr>

      <tr>
        <td>Date</td>
        <td>
          ${escapeHtml(formatDate(paymentDate))}
          ${escapeHtml(formatTime(paymentDate))}
        </td>
      </tr>

      <tr>
        <td>Student</td>
        <td>${escapeHtml(studentName)}</td>
      </tr>

      <tr>
        <td>Registration</td>
        <td>
          ${escapeHtml(
            student?.registrationNumber ?? "-",
          )}
        </td>
      </tr>

      <tr>
        <td>Course</td>
        <td>
          ${escapeHtml(
            admission?.course?.name ?? "-",
          )}
        </td>
      </tr>

      <tr>
        <td>Payment Method</td>
        <td>
          ${escapeHtml(
            receipt?.paymentMethod ?? "-",
          )}
        </td>
      </tr>
    </table>

    <div class="line"></div>

    <table class="items">
      <thead>
        <tr>
          <th>Description</th>
          <th class="amount">Amount</th>
        </tr>
      </thead>

      <tbody>
        ${
          rows ||
          `
            <tr>
              <td>Fee Payment</td>
              <td class="amount">
                ${formatMoney(receipt?.amountPaid)}
              </td>
            </tr>
          `
        }
      </tbody>
    </table>

    <div class="total">
      <span>Total Paid</span>
      <span>${formatMoney(receipt?.amountPaid)}</span>
    </div>

    ${
      receipt?.remarks
        ? `
          <div class="remarks">
            <strong>Remarks:</strong>
            ${escapeHtml(receipt.remarks)}
          </div>
        `
        : ""
    }

    <div class="footer">
      Thank you for your payment.
    </div>

  </div>

  <script>
    window.addEventListener("load", function () {
      setTimeout(function () {
        window.print();
      }, 300);
    });

    window.addEventListener("afterprint", function () {
      window.close();
    });
  </script>
</body>
</html>`;
}

async function getSchoolId(request: NextRequest) {
  const token =
    request.cookies.get("auth-token")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const payload = await verifyToken(token);

  if (!payload) {
    throw new Error("Unauthorized");
  }

  return payload.schoolId;
}

export async function GET(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const schoolId = await getSchoolId(request);

    const { paymentId } = await params;

    const receipt = await getPaymentReceipt(
      schoolId,
      paymentId,
    );

    if (!receipt) {
      return new NextResponse(
        "Receipt not found.",
        {
          status: 404,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
          },
        },
      );
    }

    const formatParam =
      request.nextUrl.searchParams.get(
        "format",
      );

    const format =
      formatParam === "thermal58" ||
      formatParam === "thermal80" ||
      formatParam === "a4"
        ? formatParam
        : "a4";

    const html = getReceiptHtml(
      receipt,
      format,
    );

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type":
          "text/html; charset=utf-8",
        "Cache-Control":
          "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error(
      "Receipt generation error:",
      error,
    );

    if (
      error instanceof Error &&
      error.message === "Unauthorized"
    ) {
      return new NextResponse(
        "Unauthorized",
        {
          status: 401,
          headers: {
            "Content-Type":
              "text/plain; charset=utf-8",
          },
        },
      );
    }

    return new NextResponse(
      "Internal Server Error",
      {
        status: 500,
        headers: {
          "Content-Type":
            "text/plain; charset=utf-8",
        },
      },
    );
  }
}