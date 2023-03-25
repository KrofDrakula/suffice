import { describe, it, expect } from "vitest";
import {
  booleanLiteral,
  cellReference,
  numberLiteral,
  stringLiteral,
} from "./values.js";
import type { ResultType, Err } from "arcsecond";

const isError = <R, E, D>(result: ResultType<R, E, D>): result is Err<E, D> =>
  result.isError;

describe("numberLiteral", () => {
  it("parses natural numbers", () => {
    const result = numberLiteral.run("3");
    expect(result.isError).toBe(false);
    if (!isError(result))
      expect(result.result).toEqual({ type: "number", value: 3 });
  });

  it("parses fractional numbers", () => {
    const result = numberLiteral.run("3.14");
    expect(result.isError).toBe(false);
    if (!isError(result))
      expect(result.result).toEqual({ type: "number", value: 3.14 });
  });

  it("parses scientific int notation", () => {
    const result = numberLiteral.run("3e4");
    expect(result.isError).toBe(false);
    if (!isError(result))
      expect(result.result).toEqual({ type: "number", value: 30_000 });
  });

  it("parses scientific fractional notation", () => {
    const result = numberLiteral.run("31.4e-1");
    expect(result.isError).toBe(false);
    if (!isError(result))
      expect(result.result).toEqual({ type: "number", value: 3.14 });
  });

  it("fails to parse unprefixed fraction digits", () => {
    const result = numberLiteral.run(".123");
    expect(result.isError).toBe(true);
  });
});

describe("stringLiteral", () => {
  it("parses empty strings", () => {
    for (const sample of ['""', "''"]) {
      const result = stringLiteral.run(sample);
      expect(result.isError).toBe(false);
      if (!isError(result))
        expect(result.result).toEqual({ type: "string", value: "" });
    }
  });

  it("parses escapes escaped quotes and consumes terminated strings", () => {
    for (const quote of `'"`) {
      const result = stringLiteral.run(`${quote}\\${quote}${quote}`);
      expect(result.isError).toBe(false);
      if (!isError(result))
        expect(result.result).toEqual({ type: "string", value: quote });
    }
  });

  it("does not parse unterminated strings", () => {
    const result = stringLiteral.run("'");
    expect(result.isError).toBe(true);
  });
});

describe("booleanLiteral", () => {
  it("parses boolean values", () => {
    for (const [string, value] of [
      ["true", true],
      ["false", false],
      ["TRUE", true],
      ["FALSE", false],
    ] as const) {
      const result = booleanLiteral.run(string);
      expect(result.isError).toBe(false);
      if (!isError(result))
        expect(result.result, `parsing "${string}"`).toEqual({
          type: "boolean",
          value,
        });
    }
  });

  it("does not parse typos", () => {
    expect(booleanLiteral.run("falser").isError).toBe(true);
    expect(booleanLiteral.run("truer").isError).toBe(true);
  });
});

describe("cellReference", () => {
  it("parses normal cell references", () => {
    const result = cellReference.run("b13");
    expect(result.isError).toBe(false);
    if (!isError(result))
      expect(result.result).toEqual({
        type: "reference",
        row: 13,
        rowLock: false,
        column: 2,
        columnLock: false,
      });
  });

  it("parses row and column locks", () => {
    for (const [input, expected] of [
      [
        "$C4",
        {
          type: "reference",
          row: 4,
          rowLock: false,
          column: 3,
          columnLock: true,
        },
      ],
      [
        "E$4",
        {
          type: "reference",
          row: 4,
          rowLock: true,
          column: 5,
          columnLock: false,
        },
      ],
    ] as const) {
      const result = cellReference.run(input);
      expect(result.isError).toBe(false);
      if (!isError(result))
        expect(result.result, `parsing ${input}`).toEqual(expected);
    }
  });
});
