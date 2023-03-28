{{
const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const alphaToColumnNumber = (chars) =>
  [...chars.toUpperCase()].reduceRight(
    (acc, next) => acc * alpha.length + alpha.indexOf(next),
    0
  ) + 1;

const parseCellReference = (row, column, lockRow, lockColumn, location) => {
  return {
    type: "reference",
    row: parseInt(row, 10),
    rowLock: lockRow == "$",
    column: alphaToColumnNumber(column),
    columnLock: lockColumn == "$",
    location: {
      start: location.start.offset,
      end: location.end.offset
    }
  };
};
}}

expression
  = ws @sum ws

sum
  = head:product ws tail:([+-] ws product)* {
      const loc = location();
      return { head, tail: tail.map(([op,,value]) => ({op, value})) };
      return {
        type: op == '+' ? 'addition' : 'subtraction',
        left,
        right,
        location: {
          start: loc.start.offset,
          end: loc.end.offset
        }
      };
    }

product
  = head:value ws tail:([*/] ws value)* {
      const loc = location();
      return { head, tail: tail.map(([op,,value]) => ({op, value})) };
      return {
        type: op == '*' ? 'product' : 'division',
        left,
        right,
        location: {
          start: loc.start.offset,
          end: loc.end.offset
        }
      }
    }


value
  = valueLiteral
  / "(" ws @expression ws ")"

valueLiteral
  = cellRange
  / cellReference
  / string
  / number
  / true
  / false

cellRange "cell range"
  = start:cellReference ws ":" ws end:cellReference {
      const loc = location();
      return {
        type: 'range',
        start,
        end,
        location: {
          start: loc.start.offset,
          end: loc.end.offset
        }
      };
    }

cellReference "cell reference"
  = lockColumn:"$"? column:$([a-z]i+) lockRow:"$"? row:$(digit1_9 digit*) {
      const loc = location();
      return parseCellReference(row, column, lockRow, lockColumn, loc);
    }

string "string"
  = '"' chars:char* '"' {
      const loc = location();
      return {
        type: 'string',
        value: chars.join(""),
        location: {
          start: loc.start.offset,
          end: loc.end.offset
        }
      };
    }

char
  = unescaped
  / "\\"
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

unescaped
  = [^\0-\x1F\x22\x5C]

number "number"
  = minus? int frac? exp? {
      const loc = location();
      return {
        type: 'number',
        value: parseFloat(text()),
        location: {
          start: loc.start.offset,
          end: loc.end.offset
        }
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
    const loc = location();
    return {
      type: 'boolean',
      value: false,
      location: {
        start: loc.start.offset,
        end: loc.end.offset
      }
    };
  }

true
  = "true" {
    const loc = location();
    return {
      type: 'boolean',
      value: true,
      location: {
        start: loc.start.offset,
        end: loc.end.offset
      }
    };
  }

ws "whitespace" = [ \t\n\r]*
