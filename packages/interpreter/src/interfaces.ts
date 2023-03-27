// Values

export type EmptyValue = {
  type: "empty";
};

export type StringValue = {
  type: "string";
  value: string;
};

export type NumberValue = {
  type: "number";
  value: number;
};

export type BooleanValue = {
  type: "boolean";
  value: boolean;
};

export type FormulaValue = {
  type: "formula";
  value: string;
  evaluate: () => CellValue;
};

export type CellReference = {
  type: "reference";
  column: number;
  columnLock: boolean;
  row: number;
  rowLock: boolean;
};

export type CellRange = {
  type: "range";
  start: CellReference;
  end: CellReference;
};

export type CellValue =
  | EmptyValue
  | StringValue
  | NumberValue
  | BooleanValue
  | FormulaValue
  | CellReference
  | CellRange;
