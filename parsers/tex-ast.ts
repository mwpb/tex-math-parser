export type ParseError = { tag: "error"; message: string };
export type ParseResult = AST | ParseError;

type Atom = number;
type UnarySubtraction = {
  tag: "unary_subtraction";
  right: AST;
};
type BinaryAddition = {
  tag: "binary_addition";
  left: AST;
  right: AST;
};
type BinaryMultiplication = {
  tag: "binary_multiplication";
  left: AST;
  right: AST;
};
type UnaryOperator = UnarySubtraction;
type BinaryOperator = BinaryAddition | BinaryMultiplication;
export type AST = Atom | UnaryOperator | BinaryOperator;

let assertUnreachable = (x: never): never => {
  throw new Error(`Error in case analysis: ${x}.`);
};

let getSymbol = (ast: AST): string => {
  if (typeof ast === "number") return " ";
  if (ast.tag === "unary_subtraction") return "-";
  if (ast.tag === "binary_addition") return "+";
  if (ast.tag === "binary_multiplication") return "*";

  return assertUnreachable(ast);
};

let operatorPrecedence = new Map<string, number>();
operatorPrecedence.set(" ", 10);
operatorPrecedence.set("+", 20);
operatorPrecedence.set("-", 20);
operatorPrecedence.set("*", 30);

let unaryOperators = new Map<string, number>();
unaryOperators.set("-", 20);
unaryOperators.set("+", 20);

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
    return [Number.parseInt(s), s.slice(1)];
  }

  return [null, s];
};

let parseUnaryPrefix = (s: string): [UnaryOperator | null, string] => {
  // console.log(`parse unary ${s}`);
  if (s.startsWith("-")) {
    let [ast, rest] = parseOnce(null, "-", s.slice(1));
    if (!ast) throw new Error(`Error getting rhs of unary: ${s}`);
    return [
      {
        tag: "unary_subtraction",
        right: ast,
      },
      rest,
    ];
  }

  return [null, s];
};

let parseInfix = (
  left: AST,
  operator: string,
  s: string
): [AST | null, string, string] => {
  // console.log(`parse infix ${JSON.stringify(left)}, ${operator}, ${s}`);
  let currentPrecedence = operatorPrecedence.get(operator) ?? 0;
  let tokenPrecedence = operatorPrecedence.get(s[0]) ?? 0;
  if (tokenPrecedence <= currentPrecedence) {
    return [left, " ", s];
  }

  if (s.startsWith("+")) {
    let [right, rest] = parseOnce(null, "+", s.slice(1));
    if (!right) throw new Error(`Error parsing rhs of binary +: ${s}`);
    return [
      {
        tag: "binary_addition",
        left: left,
        right: right,
      },
      " ",
      rest,
    ];
  }

  if (s.startsWith("*")) {
    let [right, rest] = parseOnce(null, "*", s.slice(1));

    if (!right) throw new Error(`Error parsing rhs of binary *: ${s}`);
    return [
      {
        tag: "binary_multiplication",
        left: left,
        right: right,
      },
      " ",
      rest,
    ];
  }

  return [null, " ", ""];
};

let parseOnce = (
  left: AST | null,
  operator: string,
  rest: string
): [AST | null, string] => {
  if (rest.length === 0) return [left, rest];
  if (!left) { // ensures infix not treated as prefix
    if (rest.length == 0) throw new Error("Unexpected end of input.");
    [left, rest] = parseAtom(rest);
    if (!left) [left, rest] = parseUnaryPrefix(rest);
    if (!left) throw new Error(`Doesn't start with atom or prefix: ${rest}`);

    return parseOnce(left, operator, rest);
  }

  if (left) [left, operator, rest] = parseInfix(left, operator, rest);
  if (!left) throw new Error(`Expected infix: ${rest}`);

  return [left, rest];
};

let getToken = (s: string): [string, string] => {
  return [s.charAt(0), s.slice(1)];
};
