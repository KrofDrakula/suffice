import Prism from "prismjs";

Prism.languages["suffice"] = {
  formulaStart: {
    pattern: /^=.*/,
    alias: "important",
    inside: {
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
      punctuation: /[\(\),=]/,
      infix: {
        pattern: /[\*\/+-]/,
        alias: "operator",
      },
      number: /[+-]?(?:0|[1-9][0-9]*)(?:\.\d*)?(?:e[+-]?\d*)?/i,
      boolean: /true|false/,
      string: {
        pattern: /"(?:[^\\\r\n]|\\")*"/,
      },
      identifier: {
        pattern: /[a-z_]+/i,
        alias: "constant",
      },
    },
  },
};

export default Prism;
