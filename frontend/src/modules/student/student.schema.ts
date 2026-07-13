import { z } from "zod";

export const createStudentSchema = z.object({
  registrationNumber: z.string().trim().min(1, "Registration Number is required"),

  name: z.string().trim().min(1, "Student Name is required"),

  fatherName: z.string().trim().optional(),

  course: z.string().trim().min(1, "Course is required"),

  dateOfBirth: z.string().optional(),

  dateOfAdmission: z.string().optional(),

  status: z.enum(["ACTIVE", "ARCHIVED"]).default("ACTIVE"),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;