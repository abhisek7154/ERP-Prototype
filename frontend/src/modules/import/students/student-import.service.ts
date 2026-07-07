import { prisma } from "~/lib/prisma";
import { parseExcel } from "../shared/excel.parser";
import { mapFeePaymentImport, mapStudentImport } from "./student-import.mapper";
import { validateStudentRows } from "./student-import.validator";

export interface ImportSummary {
  totalRows: number;
  importedRows: number;
  failedRows: number;
  errors: {
    row: number;
    errors: string[];
  }[];
}

export async function importStudents(
  file: File,
  schoolId: string,
): Promise<ImportSummary> {
  const parsedRows = await parseExcel(file);
  const { validRows, invalidRows } = validateStudentRows(parsedRows);

  let importedRows = 0;

  for (const row of validRows) {
    const studentData = mapStudentImport(row, schoolId);

    const student = await prisma.student.upsert({
      where: {
        schoolId_registrationNumber: {
          schoolId,
          registrationNumber: studentData.registrationNumber,
        },
      },
      update: {
        name: studentData.name,
        fatherName: studentData.fatherName,
        course: studentData.course,
        dateOfBirth: studentData.dateOfBirth,
        dateOfAdmission: studentData.dateOfAdmission,
      },
      create: studentData,
    });

    const feeData = mapFeePaymentImport(row, student.id);

    if (
      feeData.mrNumber ||
      feeData.amountPaid !== null ||
      feeData.receiptDate
    ) {
      await prisma.feePayment.create({
        data: feeData,
      });
    }

    importedRows += 1;
  }

  return {
    totalRows: parsedRows.length,
    importedRows,
    failedRows: invalidRows.length,
    errors: invalidRows,
  };
}

