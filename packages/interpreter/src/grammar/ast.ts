import {
  BooleanValue,
  CellRange,
  CellReference,
  NumberValue,
  StringValue,
} from "../interfaces.js";

const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const alphaToColumnNumber = (chars: string): number =>
  [...chars.toUpperCase()].reduceRight(
    (acc, next) => acc * alpha.length + alpha.indexOf(next),
    0
  ) + 1;

const CELL_REFERENCE = /^(\$)?([a-zA-Z]+)(\$)?\d+$/;

export const parseCellReference = ([ref]: string[]): CellReference => {
  const [, lockColumn, column, lockRow, row] = CELL_REFERENCE.exec(ref)!;
  return {
    type: "reference",
    row: parseInt(row, 10),
    rowLock: lockRow == "$",
    column: alphaToColumnNumber(column),
    columnLock: lockColumn == "$",
  };
};

export const parseCellRange = ([start, , end]: string[]): CellRange => {
  return {
    type: "range",
    start: parseCellReference([start]),
    end: parseCellReference([end]),
  };
};

export const parseStringLiteral = ([string]: string[]): StringValue => ({
  type: "string",
  value: string,
});

export const parseNumberLiteral = ([number]: string[]): NumberValue => ({
  type: "number",
  value: parseFloat(number),
});

export const parseBooleanLiteral = ([value]: string[]): BooleanValue => ({
  type: "boolean",
  value: value.toLowerCase() == "true",
});
