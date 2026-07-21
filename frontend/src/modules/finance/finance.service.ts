import { Prisma } from "@prisma/client";
import { prisma } from "~/lib/prisma";

import {
  type FinanceQuery,
  type CreateFeePaymentInput,
  type UpdateFeePaymentInput,
} from "@/modules/finance/finance.schema";

import { buildFinanceWhere } from "./finance.helper";

export async function getFeePayments(
  schoolId: string,
  query: FinanceQuery,
) {
  const page = query.page;
  const limit = query.limit;

  const where = buildFinanceWhere(schoolId, query);

  const payments = await prisma.feePayment.findMany({
  where,

  include: {
    student: {
      select: {
        id: true,
        name: true,
        registrationNumber: true,
        course: true,
      },
    },
  },

  orderBy: {
    receiptDate: "desc",
  },

  skip: (page - 1) * limit,
  take: limit,
});

const total = await prisma.feePayment.count({
  where,
});

  return {
    data: payments,

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrevious: page > 1,
    },
  };
}

export async function getFeePaymentById(
  id: string,
  schoolId: string,
) {
  return prisma.feePayment.findFirst({
    where: {
      id,

      student: {
        schoolId,
      },
    },

    include: {
      student: {
        select: {
          id: true,
          name: true,
          registrationNumber: true,
          course: true,
        },
      },
    },
  });
}

export async function createFeePayment(
  schoolId: string,
  data: CreateFeePaymentInput,
) {
  const student = await prisma.student.findFirst({
    where: {
      id: data.studentId,
      schoolId,
    },
  });

  if (!student) {
    throw new Error("Student not found.");
  }

  return prisma.feePayment.create({
    data: {
      studentId: data.studentId,

      receiptNumber: data.receiptNumber,
      mrNumber: data.mrNumber,
      receiptDate: data.receiptDate,

      amountPaid: new Prisma.Decimal(data.amountPaid),

      status: data.status,
      paymentMethod: data.paymentMethod,

      transactionId: data.transactionId,

      remarks: data.remarks,

      collectedBy: data.collectedBy,
    },

    include: {
      student: true,
    },
  });
}

export async function updateFeePayment(
  id: string,
  schoolId: string,
  data: UpdateFeePaymentInput,
) {
  const payment = await prisma.feePayment.findFirst({
    where: {
      id,

      student: {
        schoolId,
      },
    },
  });

  if (!payment) {
    throw new Error("Payment not found.");
  }

  return prisma.feePayment.update({
    where: {
      id,
    },

    data: {
      studentId: data.studentId,

      receiptNumber: data.receiptNumber,
      mrNumber: data.mrNumber,
      receiptDate: data.receiptDate,

      amountPaid:
        data.amountPaid !== undefined
          ? new Prisma.Decimal(data.amountPaid)
          : undefined,

      status: data.status,

      paymentMethod: data.paymentMethod,

      transactionId: data.transactionId,

      remarks: data.remarks,

      collectedBy: data.collectedBy,
    },

    include: {
      student: true,
    },
  });
}

export async function deleteFeePayment(
  id: string,
  schoolId: string,
) {
  const payment = await prisma.feePayment.findFirst({
    where: {
      id,

      student: {
        schoolId,
      },
    },
  });

  if (!payment) {
    throw new Error("Payment not found.");
  }

  await prisma.feePayment.delete({
    where: {
      id,
    },
  });

  return {
    success: true,
  };
}