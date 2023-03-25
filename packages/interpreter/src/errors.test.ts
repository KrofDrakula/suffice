import { describe, expect, it } from "vitest";
import { formatError } from "./errors.js";

describe("formatError", () => {
  it("points to the correct position of the error when not truncated", () => {
    expect(formatError("hello this is dog", 5, "expected comma")).toBe(
      `expected comma:
hello this is dog
     ^`
    );
  });

  it("points to the correct position of the error when truncated", () => {
    expect(formatError("12345π78901234567890", 5, "not a digit", 3)).toBe(
      `not a digit:
…345π789…
    ^`
    );
  });
});
