import { compile } from "moo";
import { leftDelimiters, rightDelimiters } from "../constants/delimiters";
import { greekLetters } from "../constants/letters";
import { unaryPrefixOperators } from "../constants/unaryOperators";

export let tokeniser = compile({
  ws: { match: /\s+/, lineBreaks: true },
  unaryOperator: unaryPrefixOperators,
  op: ["+", "-", "*", "f"],
  number: /0|[1-9][0-9]*/,
  symbol: greekLetters,
  open: leftDelimiters,
  close: rightDelimiters,
  comma: ",",
});
