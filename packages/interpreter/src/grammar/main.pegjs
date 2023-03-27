{{
const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const alphaToColumnNumber = (chars) =>
  [...chars.toUpperCase()].reduceRight(
    (acc, next) => acc * alpha.length + alpha.indexOf(next),
    0
  ) + 1;

const parseCellReference = (row, column, lockRow, lockColumn) => {
  return {
    type: "reference",
    row: parseInt(row, 10),
    rowLock: lockRow == "$",
    column: alphaToColumnNumber(column),
    columnLock: lockColumn == "$",
  };
};
}}

value
  = cellRange
  / cellReference
  / string
  / number
  / true
  / false

cellRange "cell range"
  = start:cellReference ws ":" ws end:cellReference {
    return {
      type: 'range',
      start,
      end
    };
  }

cellReference "cell reference"
  = lockColumn:lockChar? column:$([a-z]i+) lockRow:lockChar? row:$(digit1_9 digit*) {
    return parseCellReference(row, column, lockRow, lockColumn);
  }

lockChar
  = "$"

string "string"
  = quotation_mark chars:char* quotation_mark {
      return {
        type: 'string',
        value: chars.join("")
      };
    }

char
  = unescaped
  / escape
    sequence:(
        '"'
      / "\\"
      / "/"
      / "b" { return "\b"; }
      / "f" { return "\f"; }
      / "n" { return "\n"; }
      / "r" { return "\r"; }
      / "t" { return "\t"; }
      / "u" digits:$(hexdigit hexdigit hexdigit hexdigit) {
          return String.fromCharCode(parseInt(digits, 16));
        }
    )
    { return sequence; }

escape
  = "\\"

quotation_mark
  = '"'

unescaped
  = [^\0-\x1F\x22\x5C]

number "number"
  = minus? int frac? exp? {
      return {
        type: 'number',
        value: parseFloat(text())
      };
    }

decimal_point
  = "."

digit1_9
  = [1-9]

digit
  = [0-9]

e
  = [eE]

exp
  = e (minus / plus)? digit+

frac
  = decimal_point digit+

int
  = zero / (digit1_9 digit*)

minus
  = "-"

plus
  = "+"

zero
  = "0"

hexdigit
  = [0-9a-f]i

false
  = "false" {
    return {
      type: 'boolean',
      value: false
    };
  }

true
  = "true" {
    return {
      type: 'boolean',
      value: true
    };
  }

ws "whitespace" = [ \t\n\r]*
