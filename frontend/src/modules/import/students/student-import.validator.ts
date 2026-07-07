import { ZodError } from "zod";

import {
  studentImportSchema,
  type StudentImportInput,
} from "./student-import.schema";

export interface ValidationError {
  row: number;
  errors: string[];
}

export interface ValidationResult {
  validRows: StudentImportInput[];
  invalidRows: ValidationError[];
}

export function validateStudentRows(
  rows: Record<string, unknown>[],
): ValidationResult {
  const validRows: StudentImportInput[] = [];
  const invalidRows: ValidationError[] = [];

  rows.forEach((row, index) => {
    const result = studentImportSchema.safeParse(row);

    if (result.success) {
      validRows.push(result.data);
      return;
    }

    invalidRows.push({
      row: index + 2,
      errors: formatErrors(result.error),
    });
  });

  return {
    validRows,
    invalidRows,
  };
}

function formatErrors(error: ZodError): string[] {
  return error.issues.map((issue) => {
    const field = issue.path.join(".");
    return field ? `${field}: ${issue.message}` : issue.message;
  });
}