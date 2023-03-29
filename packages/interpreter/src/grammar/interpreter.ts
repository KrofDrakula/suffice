import { BinaryOperation, CellValue } from "../interfaces.js";

export declare function interpret(
  value: CellValue | BinaryOperation,
  cells: Map<string, CellValue>
): string | number;
