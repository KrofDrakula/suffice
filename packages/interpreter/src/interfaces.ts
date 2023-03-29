type Location = {
  start: number;
  end: number;
};

// Values

export type EmptyValue = {
  type: "empty";
};

export type StringValue = {
  type: "string";
  value: string;
  location: Location;
};

export type NumberValue = {
  type: "number";
  value: number;
  location: Location;
};

export type BooleanValue = {
  type: "boolean";
  value: boolean;
  location: Location;
};

export type FormulaValue = {
  type: "formula";
  value: string;
  evaluate: () => CellValue;
  location: Location;
};

export type CellReference = {
  type: "reference";
  column: number;
  columnLock: boolean;
  row: number;
  rowLock: boolean;
  location: Location;
};

export type CellRange = {
  type: "range";
  start: CellReference;
  end: CellReference;
  location: Location;
};

export type CellValue =
  | EmptyValue
  | StringValue
  | NumberValue
  | BooleanValue
  | FormulaValue
  | CellReference
  | CellRange;
