import { z } from "zod";

export const setupSchema = z
  .object({
    schoolName: z
      .string()
      .trim()
      .min(3, "School name must be at least 3 characters.")
      .max(100, "School name is too long."),

    schoolCode: z
      .string()
      .trim()
      .min(3, "School code must be at least 3 characters.")
      .max(20, "School code cannot exceed 20 characters.")
      .regex(
        /^[A-Z0-9_-]+$/,
        "School code may contain only uppercase letters, numbers, '-' and '_'."
      ),

    adminName: z
      .string()
      .trim()
      .min(3, "Administrator name must be at least 3 characters.")
      .max(100, "Administrator name is too long."),

    adminEmail: z
      .string()
      .trim()
      .email("Invalid email address."),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(100, "Password is too long."),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export type SetupInput = z.infer<typeof setupSchema>;