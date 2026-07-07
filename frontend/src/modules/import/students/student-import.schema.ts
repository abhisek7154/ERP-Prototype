import { z } from "zod";

function toNullString(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  return String(value).trim();
}

function toDate(value: unknown) {
  if (value === null || value === undefined || value === "") return null;

  if (value instanceof Date) return value;

  if (typeof value === "number") {
    // Excel serial date -> JS Date
    return new Date(Math.round((value - 25569) * 86400 * 1000));
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    // dd.mm.yyyy
    const parts = trimmed.split(".");
    if (parts.length === 3) {
      const [dd, mm, yyyy] = parts;
      const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
      return Number.isNaN(date.getTime()) ? null : date;
    }

    const date = new Date(trimmed);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
}

export const studentImportSchema = z.object({
  "SLNO": z.union([z.string(), z.number(), z.null(), z.undefined()]).optional(),

  "Reg.No": z.union([z.string(), z.number()]).transform((v) => String(v).trim()).refine((v) => v.length > 1, {
    message: "Reg.No is required",
  }),

  "Name of Students": z.string().trim().min(1, "Name of Students is required"),

  "Father's Name": z
    .union([z.string(), z.number(), z.null(), z.undefined()])
    .transform(toNullString)
    .nullable(),

  Course: z.string().trim().min(1, "Course is required"),

  "D.O.B": z
    .union([z.string(), z.number(), z.date(), z.null(), z.undefined()])
    .transform(toDate)
    .nullable()
    .optional(),

  "D.O.A": z
    .union([z.string(), z.number(), z.date(), z.null(), z.undefined()])
    .transform(toDate)
    .nullable()
    .optional(),

  "MR No": z
    .union([z.string(), z.number(), z.null(), z.undefined()])
    .transform(toNullString)
    .nullable()
    .optional(),

  Date: z
    .union([z.string(), z.number(), z.date(), z.null(), z.undefined()])
    .transform(toDate)
    .nullable()
    .optional(),

  "Amt.": z.union([z.string(), z.number(), z.null(), z.undefined()]).optional(),
  Amt: z.union([z.string(), z.number(), z.null(), z.undefined()]).optional(),
});

export type StudentImportInput = z.infer<typeof studentImportSchema>;