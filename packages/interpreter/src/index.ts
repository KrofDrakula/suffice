import { CellValue } from "./interfaces.js";
import { parse } from "./grammar/index.js";
import { interpret as _interpret } from "./grammar/interpreter.js";

export default (
  expression: string,
  cells: Map<string, CellValue> = new Map()
) => {
  return _interpret(parse(expression), cells);
};
