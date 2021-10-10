import { compile } from "moo";
import { binaryOperators } from "../constants/binaryOperators";
import { leftDelimiters, rightDelimiters } from "../constants/delimiters";
import { greekLetters } from "../constants/letters";
import { relationOperators } from "../constants/relationOperators";
import {
  circularFunctions,
  hyperbolicFunctions,
} from "../constants/trigFunctions";
import {
  binaryUnaryPrefix,
  unaryPrefixOperators,
} from "../constants/unaryOperators";

export let tokeniser = compile({
  ws: { match: /\s+/, lineBreaks: true },
  binaryUnary: binaryUnaryPrefix,
  unary: [
    ...unaryPrefixOperators,
    ...circularFunctions,
    ...hyperbolicFunctions,
  ],
  binary: ["*", "f", ...relationOperators, ...binaryOperators, "/"],
  number: /\d*\.\d+?/,
  integer: /\d+/,
  symbol: greekLetters,
  open: leftDelimiters,
  close: rightDelimiters,
  comma: ",",
});
