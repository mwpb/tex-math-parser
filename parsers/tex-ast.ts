import { Lexer, Token } from "moo";
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
import { tokeniser } from "./tokenise";

export let parse = (s: string): AST | null => {
  tokeniser.reset(s);
  let rest = Array.from(tokeniser).filter(
    (x) => x.type !== "ws" && x.type !== "comma"
  );
  // console.log(rest.map((x) => x.value));

  let left: AST | null = null;
  [left, rest] = parseOnce(null, " ", rest);
  while (rest.length > 0) {
    [left, rest] = parseOnce(left, " ", rest);
  }

  return left;
};

let parseAtom = (s: Token[]): [Atom | null, Token[]] => {
  // console.log(`parse atom ${s}`);
  let token = s[0].value;
  if (token >= "0" && token <= "9") {
    return [Number.parseInt(s[0].value), s.slice(1)];
  }

  return [null, s];
};

// let eat = (char: string, s: Token[]): Token[] => {
//   if (char === s[0].value) return s.slice(1);
//   return s;
// };

let parseUnaryPrefix = (s: Token[]): [UnaryNode | null, Token[]] => {
  // console.log(`parse unary ${s}`);
  let token = s[0].value;
  if (unaryOperatorSchema.guard(token)) {
    let [ast, rest] = parseOnce(null, token, s.slice(1));
    if (!ast) throw new Error(`Error getting rhs of unary: ${s}`);
    return [{ op: token, right: ast }, rest];
  }

  return [null, s];
};

let parseBinaryPrefix = (s: Token[]): [BinaryNode | null, Token[]] => {
  let token = s[0].value;
  if (binaryPrefixSchema.guard(token)) {
    let [left, rest] = parseOnce(null, token, s.slice(1));
    if (!left) throw new Error(`Error getting lhs of binary prefix: ${s}`);

    let [right, newRest] = parseOnce(null, token, rest);
    if (!right) throw new Error(`Error getting rhs of binary prefix: ${s}`);

    return [{ op: token, left: left, right: right }, newRest];
  }

  return [null, s];
};

let parseInfix = (
  left: AST,
  operator: string,
  s: Token[]
): [AST | null, string, Token[]] => {
  // console.log(`parse infix ${JSON.stringify(left)}, ${operator}, ${s}`);
  let token = s[0].value;
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

  return [null, " ", s];
};

let parseOnce = (
  left: AST | null,
  operator: string,
  rest: Token[]
): [AST | null, Token[]] => {
  // console.log(`parse once ${JSON.stringify(left)} ${operator} ${rest}`);

  if (rest.length === 0) return [left, rest];
  if (!left) {
    // ensures infix not treated as prefix
    if (rest.length == 0) throw new Error("Unexpected end of input.");
    if (rest[0].value === "(") return parseOnce(left, "(", rest.slice(1));
    // console.log(`before atom: ${left}`);
    [left, rest] = parseAtom(rest);
    // console.log(`after atom: ${left}`);
    if (!left) [left, rest] = parseUnaryPrefix(rest);
    if (!left) [left, rest] = parseBinaryPrefix(rest);
    if (!left) throw new Error(`Doesn't start with atom or prefix: ${rest}`);

    return parseOnce(left, operator, rest);
  }

  if (rest[0].value === ")") return [left, rest.slice(1)];

  if (left) [left, operator, rest] = parseInfix(left, operator, rest);

  if (!left) throw new Error(`Expected infix or delimiter: ${rest}`);

  return [left, rest];
};
