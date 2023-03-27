@preprocessor typescript

@{%
import {
  parseCellReference,
  parseStringLiteral,
  parseNumberLiteral,
  parseBooleanLiteral,
  parseCellRange
} from './ast.js';
import lexer from './lexer.js';
%}

@lexer lexer

value ->
  cellRange {% id %}
| cellReference {% id %}
| string {% id %}
| number {% id %}
| boolean {% id %}

cellRange -> %reference %colon %reference {% parseCellRange %}

cellReference -> %reference {% parseCellReference %}

string -> %string {% parseStringLiteral %}

number -> %float {% parseNumberLiteral %}

boolean -> %boolean {% parseBooleanLiteral %}
