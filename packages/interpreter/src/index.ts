import { CellValue } from "./interfaces.js";

export const interpret = (expression: string): CellValue => {
  return { type: "string", value: expression };
};
