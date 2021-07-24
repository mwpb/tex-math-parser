import {
  AST,
  Atom,
  binaryInfixSchema,
  BinaryNode,
  binaryPrefixSchema,
  UnaryNode,
  unaryOperatorSchema,
} from "./ast";
import { operatorPrecedence } from "./precedence";

export let parse = (s: string): AST | null => {
  let [left, rest] = parseOnce(null, " ", s);
  while (rest.length > 0) {
    [left, rest] = parseOnce(left, " ", rest);
  }

  return left;
};

let parseAtom = (s: string): [Atom | null, string] => {
  // console.log(`parse atom ${s}`);
  let token = s[0];
  if (token >= "0" && token <= "9") {
    return [Number.parseInt(s[0]), s.slice(1)];
  }

  return [null, s];
};

let eat = (char: string, s: string): string => {
  if (char === s[0]) return s.slice(1);
  return s;
};

let parseUnaryPrefix = (s: string): [UnaryNode | null, string] => {
  // console.log(`parse unary ${s}`);
  let token = s.charAt(0);
  if (unaryOperatorSchema.guard(token)) {
    let [ast, rest] = parseOnce(null, token, s.slice(1));
    if (!ast) throw new Error(`Error getting rhs of unary: ${s}`);
    return [{ op: token, right: ast }, rest];
  }

  return [null, s];
};

let parseBinaryPrefix = (s: string): [BinaryNode | null, string] => {
  let token = s.charAt(0);
  if (binaryPrefixSchema.guard(token)) {
    let [left, rest] = parseOnce(null, token, s.slice(1));
    if (!left) throw new Error(`Error getting lhs of binary prefix: ${s}`);

    // should move whitespace into parse??
    rest = eat(",", rest);
    rest = eat(" ", rest);

    let [right, newRest] = parseOnce(null, token, rest);
    if (!right) throw new Error(`Error getting rhs of binary prefix: ${s}`);

    return [{ op: token, left: left, right: right }, newRest];
  }

  return [null, s];
};

let parseInfix = (
  left: AST,
  operator: string,
  s: string
): [AST | null, string, string] => {
  // console.log(`parse infix ${JSON.stringify(left)}, ${operator}, ${s}`);
  let token = s.charAt(0);
  let currentPrecedence = operatorPrecedence.get(operator) ?? 0;
  let tokenPrecedence = operatorPrecedence.get(token) ?? 0;
  if (tokenPrecedence <= currentPrecedence) {
    return [left, " ", s]; // use " " because we want token to bind next
  }

  if (binaryInfixSchema.guard(token)) {
    let [right, rest] = parseOnce(null, token, s.slice(1));
    if (!right) throw new Error(`Error parsing rhs of binary ${token}: ${s}`);
    return [{ op: token, left: left, right: right }, " ", rest];
  }

  return [null, " ", ""];
};

let parseOnce = (
  left: AST | null,
  operator: string,
  rest: string
): [AST | null, string] => {
  // console.log(`parse once ${JSON.stringify(left)} ${operator} ${rest}`);

  if (rest.length === 0) return [left, rest];
  if (!left) {
    // ensures infix not treated as prefix
    if (rest.length == 0) throw new Error("Unexpected end of input.");
    if (rest.startsWith("(")) return parseOnce(left, "(", rest.slice(1));
    // console.log(`before atom: ${left}`);
    [left, rest] = parseAtom(rest);
    // console.log(`after atom: ${left}`);
    if (!left) [left, rest] = parseUnaryPrefix(rest);
    if (!left) [left, rest] = parseBinaryPrefix(rest);
    if (!left) throw new Error(`Doesn't start with atom or prefix: ${rest}`);

    return parseOnce(left, operator, rest);
  }

  if (rest.startsWith(")")) return [left, rest.slice(1)];
  if (left) [left, operator, rest] = parseInfix(left, operator, rest);

  if (!left) throw new Error(`Expected infix or delimiter: ${rest}`);

  return [left, rest];
};
