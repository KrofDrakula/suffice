import Prism from "./index.js";
import { test, expect } from "vitest";

type SimplifiedResult = (string | [string, string] | SimplifiedResult)[];

const simplify = (result: (string | Prism.Token)[]): SimplifiedResult =>
  result.map((s) => {
    if (typeof s == "string") return s;
    if (Array.isArray(s.content)) {
      return [s.type, simplify(s.content)];
    }
    return [s.type, s.content.toString()];
  });

test("should tokenize basic formula", () => {
  expect(simplify(Prism.tokenize("=123+456", Prism.languages.suffice))).toEqual(
    [
      [
        "formulaStart",
        [
          ["punctuation", "="],
          ["number", "123"],
          ["infix", "+"],
          ["number", "456"],
        ],
      ],
    ]
  );
});

test("should support cell references and ranges", () => {
  expect(
    simplify(Prism.tokenize("=A$1*B2:$C$3", Prism.languages.suffice))
  ).toEqual([
    [
      "formulaStart",
      [
        ["punctuation", "="],
        ["cellReference", "A$1"],
        ["infix", "*"],
        [
          "cellRange",
          ["B2", ["separator", ":"], ["lock", "$"], "C", ["lock", "$"], "3"],
        ],
      ],
    ],
  ]);
});

test("should support strings in expressions", () => {
  expect(
    simplify(Prism.tokenize(`="help"+"m\\"e"`, Prism.languages.suffice))
  ).toEqual([
    [
      "formulaStart",
      [
        ["punctuation", "="],
        ["string", `"help"`],
        ["infix", "+"],
        ["string", `"m\\"e"`],
      ],
    ],
  ]);
});

test("should treat everything not a formula as just text", () => {
  expect(
    simplify(Prism.tokenize('A1 blah bla "one two"', Prism.languages.suffice))
  ).toEqual(['A1 blah bla "one two"']);
});
