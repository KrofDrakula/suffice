import Prism from "prismjs";

Prism.languages["suffice"] = {
  formulaStart: {
    pattern: /^=/,
    alias: "important",
  },
  number: /[+-]?(?:0|[1-9][0-9]*)(?:\.\d*)?(?:[eE][+-]?\d*)?/,
  boolean: /true|false/,
  string: {
    pattern: /"([^\\]|\\")*"/,
    greedy: true,
  },
  cellRange: {
    pattern: /\$?[a-z]+\$?[0-9]+:\$?[a-z]+\$?[0-9]+/i,
    greedy: true,
    alias: "variable",
    inside: {
      lock: { pattern: /\$/, alias: "punctuation" },
      separator: { pattern: /:/, alias: "punctuation" },
    },
  },
  cellReference: {
    pattern: /\$?[a-z]+\$?[0-9]+/i,
    greedy: true,
    alias: "variable",
  },
  infix: {
    pattern: /[\*\/+-]/,
    alias: "operator",
  },
  punctuation: /[\(\)=,]/,
  identifier: {
    pattern: /[a-z_]+/i,
    alias: "constant",
  },
};
