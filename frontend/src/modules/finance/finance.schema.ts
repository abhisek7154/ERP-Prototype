import { z } from "zod";

export const financeQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),

  search: z.string().trim().optional(),

  status: z
    .enum(["PAID", "PENDING", "FAILED", "CANCELLED"])
    .optional(),

  paymentMethod: z
    .enum([
      "CASH",
      "UPI",
      "CARD",
      "BANK_TRANSFER",
      "CHEQUE",
      "ONLINE",
    ])
    .optional(),

  from: z.string().optional(),
  to: z.string().optional(),
});

export const createFeePaymentSchema = z.object({
  studentId: z.string().uuid(),

  receiptNumber: z.string().optional(),
  mrNumber: z.string().optional(),

  receiptDate: z.coerce.date(),

  amountPaid: z.coerce.number().positive(),

  status: z
    .enum(["PAID", "PENDING", "FAILED", "CANCELLED"])
    .default("PAID"),

  paymentMethod: z
    .enum([
      "CASH",
      "UPI",
      "CARD",
      "BANK_TRANSFER",
      "CHEQUE",
      "ONLINE",
    ])
    .default("CASH"),

  transactionId: z.string().optional(),

  remarks: z.string().optional(),

  collectedBy: z.string().optional(),
});

export const updateFeePaymentSchema =
  createFeePaymentSchema.partial();

export type FinanceQuery = z.infer<typeof financeQuerySchema>;
export type CreateFeePaymentInput = z.infer<typeof createFeePaymentSchema>;
export type UpdateFeePaymentInput = z.infer<typeof updateFeePaymentSchema>;