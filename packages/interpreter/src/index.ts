import { CellValue } from "./interfaces.js";
import { parse } from "./grammar/index.js";
import { interpret } from "./grammar/interpreter.js";

export default (
  expression: string,
  cells: Map<string, CellValue> = new Map()
) => {
  return interpret(parse(expression), cells);
};
