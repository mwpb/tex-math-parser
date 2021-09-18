import { compile } from "moo";
import { leftDelimiters, rightDelimiters } from "../constants/delimiters";
import { greekLetters } from "../constants/letters";

export let tokeniser = compile({
  ws: { match: /\s+/, lineBreaks: true },
  op: ["+", "-", "*", "f"],
  number: /0|[1-9][0-9]*/,
  symbol: Array.from(greekLetters.values()),
  open: Array.from(leftDelimiters.values()),
  close: Array.from(rightDelimiters.values()),
  comma: ",",
});
