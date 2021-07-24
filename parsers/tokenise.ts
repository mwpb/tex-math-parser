import { compile } from "moo";

export let tokeniser = compile({
  ws: {match: /\s+/, lineBreaks: true},
  op: ["+", "-", "*", "f"],
  atom: /0|[1-9][0-9]*/,
  open: "(",
  close: ")",
  comma: ",",
});
