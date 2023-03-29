import { BinaryOperation, CellValue } from "../interfaces.js";

export const interpret = (
  value: CellValue | BinaryOperation,
  cells: Map<string, CellValue>
): string | number | null => null;
