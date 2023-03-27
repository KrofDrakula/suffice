import { describe, it, expect } from "vitest";
import { parse } from "./index.js";
import {
  BooleanValue,
  CellRange,
  CellReference,
  NumberValue,
  StringValue,
} from "../interfaces.js";

describe("grammar", () => {
  it("parses numbers", () => {
    expect(parse("123")).toEqual({
      type: "number",
      value: 123,
    } satisfies NumberValue);
    expect(parse("1.23")).toEqual({
      type: "number",
      value: 1.23,
    } satisfies NumberValue);
    expect(parse("1.2e3")).toEqual({
      type: "number",
      value: 1200,
    } satisfies NumberValue);
    expect(parse("123e-2")).toEqual({
      type: "number",
      value: 1.23,
    } satisfies NumberValue);
  });

  it("parses string literals", () => {
    expect(parse(`""`)).toEqual({
      type: "string",
      value: "",
    } satisfies StringValue);
    expect(parse(`"123"`)).toEqual({
      type: "string",
      value: "123",
    } satisfies StringValue);
    expect(parse(`"ab\\"c"`)).toEqual({
      type: "string",
      value: `ab"c`,
    } satisfies StringValue);
  });

  it("parses booleans", () => {
    expect(parse("true")).toEqual({
      type: "boolean",
      value: true,
    } satisfies BooleanValue);
    expect(parse("false")).toEqual({
      type: "boolean",
      value: false,
    } satisfies BooleanValue);
  });

  it("parses cell references", () => {
    expect(parse("A1")).toEqual({
      type: "reference",
      column: 1,
      columnLock: false,
      row: 1,
      rowLock: false,
    } satisfies CellReference);
    expect(parse("$B$2")).toEqual({
      type: "reference",
      column: 2,
      columnLock: true,
      row: 2,
      rowLock: true,
    } satisfies CellReference);
  });

  it("parses cell ranges", () => {
    expect(parse("A1:B2")).toEqual({
      type: "range",
      start: {
        type: "reference",
        row: 1,
        rowLock: false,
        column: 1,
        columnLock: false,
      },
      end: {
        type: "reference",
        row: 2,
        rowLock: false,
        column: 2,
        columnLock: false,
      },
    } satisfies CellRange);
  });
});
