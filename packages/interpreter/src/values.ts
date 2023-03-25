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
const nonZeroDigit = anyOfString("123456789");
const referenceLock = str("$");

export const cellReference = coroutine((run): CellReference => {
  const columnLock = run(lookAhead(possibly(referenceLock))) == "$";
  if (columnLock) run(referenceLock);
  const column =
    [...run(letters).toUpperCase()].reduceRight(
      (acc, next) => acc * alpha.length + alpha.indexOf(next),
      0
    ) + 1;
  const rowLock = run(lookAhead(possibly(referenceLock))) == "$";
  if (rowLock) run(referenceLock);
  const row = parseInt(run(digits), 0);
  if (row == 0) run(fail("Rows must start with 1"));
  return { type: "reference", row, rowLock, column, columnLock };
});
