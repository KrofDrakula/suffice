{{
const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const alphaToColumnNumber = (chars) =>
  [...chars.toUpperCase()].reduceRight(
    (acc, next) => acc * alpha.length + alpha.indexOf(next),
    0
  ) + 1;
}}

cellContent
  = number
  / "=" _ @expression
  / prose

prose
  = $.* {
    return {
      type: 'string',
      value: text()
    };
  }

expression
  = _ @additive _

additive
  = head:multiplicative _ tail:(@[+-] _ @multiplicative)* {
      const { start, end } = range();
      return tail.reduce((left, [op, right]) => ({
        type: op == '+' ? 'addition' : 'subtraction',
        left,
        right,
        location: { start, end }
      }), head);
    }

multiplicative
  = head:value _ tail:(@[*/] _ @value)* {
      const { start, end } = range();
      return tail.reduce((left, [op, right]) => ({
        type: op == '*' ? 'product' : 'division',
        left,
        right,
        location: { start, end }
      }), head);
    }


value
  = valueLiteral
  / "(" _ @expression _ ")"

valueLiteral
  = cellRange
  / cellReference
  / string
  / number
  / boolean

cellRange "cell range"
  = left:cellReference _ ":" _ right:cellReference {
      const { start, end } = range();
      return {
        type: 'range',
        start: left,
        end: right,
        location: { start, end }
      };
    }

cellReference "cell reference"
  = lockColumn:"$"? column:$([a-z]i+) lockRow:"$"? row:nat_number {
      const { start, end } = range();
      return {
        type: "reference",
        row: parseInt(row, 10),
        rowLock: lockRow == "$",
        column: alphaToColumnNumber(column),
        columnLock: lockColumn == "$",
        location: { start, end }
      };
    }

string "string"
  = '"' chars:char* '"' {
      const { start, end } = range();
      return {
        type: 'string',
        value: chars.join(""),
        location: { start, end }
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
  = [+-]? int frac? exp? {
      const { start, end } = range();
      return {
        type: 'number',
        value: parseFloat(text()),
        location: { start, end }
      };
    }

exp
  = [eE] [+-]? digit+

frac
  = "." digit+

int
  = "0" / nat_number

nat_number
  = $(digit1_9 digit*)

digit1_9
  = [1-9]

digit
  = [0-9]

hexdigit
  = [0-9a-f]i

boolean
  = value:("true" / "false") {
      const { start, end } = range();
      return {
        type: 'boolean',
        value: value == 'true',
        location: { start, end }
      };
    }

_ "whitespace" = [ \t\n\r]* { return null; }
