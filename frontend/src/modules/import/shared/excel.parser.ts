import { Workbook } from "exceljs";

export type ExcelRow = Record<string, unknown>;

/**
 * Reads an uploaded Excel file and converts it into
 * an array of JavaScript objects.
 *
 * Example:
 *
 * Excel
 * -------------------------
 * Reg.No | Name | Course
 * ST001  | Rahul | BCA
 *
 * Returns
 * [
 *   {
 *     "Reg.No": "ST001",
 *     "Name": "Rahul",
 *     "Course": "BCA"
 *   }
 * ]
 */
export async function parseExcel(file: File): Promise<ExcelRow[]> {
  const workbook = new Workbook();

  const buffer = await file.arrayBuffer();

  await workbook.xlsx.load(buffer);

  const worksheet = workbook.worksheets[0];

  if (!worksheet) {
    throw new Error("No worksheet found.");
  }

  // Read header row
  const headerRow = worksheet.getRow(1);

  const headers: string[] = [];

  headerRow.eachCell((cell) => {
    headers.push(String(cell.value ?? "").trim());
  });

  const rows: ExcelRow[] = [];

  // Read data rows
  worksheet.eachRow((row, rowNumber) => {
    // Skip header
    if (rowNumber === 1) return;

    // Skip empty rows
    if (row.actualCellCount === 0) return;

    const rowObject: ExcelRow = {};

    // Read every column, even if the cell is empty
    for (let i = 0; i < headers.length; i++) {
      const key = headers[i];

      if (!key) continue;

      rowObject[key] = row.getCell(i + 1).value;
    }

    rows.push(rowObject);
  });

  return rows;
}