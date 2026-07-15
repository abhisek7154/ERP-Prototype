import { z } from "zod";

export const setupSchema = z
  .object({
    schoolName: z
      .string()
      .trim()
      .min(3, "School name is required"),

    schoolCode: z
      .string()
      .trim()
      .min(3, "School code is required")
      .max(20),

    adminName: z
      .string()
      .trim()
      .min(3, "Administrator name is required"),

    adminEmail: z
      .email("Invalid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string(),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    }
  );

export type SetupInput = z.infer<typeof setupSchema>;