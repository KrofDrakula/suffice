import {
  anyOfString,
  coroutine,
  digits,
  fail,
  letters,
  lookAhead,
  possibly,
  regex,
  str,
} from "arcsecond";
import {
  BooleanValue,
  CellRange,
  CellReference,
  NumberValue,
  StringValue,
} from "./interfaces.js";

export const numberLiteral = coroutine((run): NumberValue => {
  let n = parseInt(run(digits), 10);
  let frac = "";
  let sign = "+";
  let exponent = "0";
  if (run(possibly(str(".")))) {
    frac = run(digits);
  }
  if (run(possibly(anyOfString("eE")))) {
    sign = run(possibly(anyOfString("+-"))) ?? "+";
    exponent = run(possibly(digits)) ?? "0";
  }
  return {
    type: "number",
    value: parseFloat(`${n}.${frac}e${sign}${exponent}`),
  };
});

export const stringLiteral = regex(/^(['"])(.*?)(?<!\\)\1/g).map(
  (string): StringValue => {
    const quote = string[0];
    return {
      type: "string",
      value: string.slice(1, -1).replaceAll(`\\${quote}`, quote),
    };
  }
);

export const booleanLiteral = regex(/^(true|false)\b/gi).map(
  (x): BooleanValue => ({ type: "boolean", value: x.toLowerCase() === "true" })
);

const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const referenceLock = str("$");

const alphaToColumnNumber = (chars: string): number =>
  [...chars.toUpperCase()].reduceRight(
    (acc, next) => acc * alpha.length + alpha.indexOf(next),
    0
  ) + 1;

export const cellReference = coroutine((run): CellReference => {
  const columnLock = run(possibly(referenceLock)) == "$";
  const column = alphaToColumnNumber(run(letters));
  const rowLock = run(possibly(referenceLock)) == "$";
  const row = parseInt(run(digits), 0);
  if (row == 0) run(fail("Rows must start with 1"));
  return { type: "reference", row, rowLock, column, columnLock };
});

export const cellRange = coroutine((run): CellRange => {
  const start = run(cellReference);
  run(str(":"));
  const end = run(cellReference);
  if (start.row > end.row) run(fail("Start row cannot exceed end row!"));
  if (start.column > end.column)
    run(fail("Start column cannot exceed end column!"));
  return {
    type: "range",
    start,
    end,
  };
});
