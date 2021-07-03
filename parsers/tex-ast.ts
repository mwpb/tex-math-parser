export type AST = { op: string; args: AST[] };
export type ParseError = { tag: "error"; message: string };
export type ParseResult = AST | ParseError;

export let initAST = {
  op: "const",
  args: [],
  parent: null,
};
export let constAST = (x: string): AST => {
  return { op: x, args: [] };
};

let operatorPrecedence = new Map<string, number>();
operatorPrecedence.set("const", 10);
operatorPrecedence.set("+", 20);
operatorPrecedence.set("*", 30);

export let parse = (s: string): AST => {
  let root = constAST("root");
  let searchPath: AST[] = [root];

  while (searchPath.length > 0 && s.length > 0) {
    // console.log(`step: ${JSON.stringify(searchPath)} ${s}`);

    let [token, rest] = getToken(s);
    let ast = searchPath[searchPath.length - 1];

    if (token >= "0" && token <= "9") {
      ast.args.push(constAST(token));
      s = rest;
      continue;
    }

    if (operatorPrecedence.has(token)) {
      let currentPrecedence = operatorPrecedence.get(ast.op) ?? 0;
      let tokenPrecedence = operatorPrecedence.get(token) ?? 0;
      if (tokenPrecedence < currentPrecedence) {
        searchPath.pop();
        continue;
      } else if (tokenPrecedence === currentPrecedence) {
        // Assuming equal precedence implies same op (not in general true.)
        s = rest;
        continue;
      } else if (ast.args.length > 0) {
        let oldLastAst = {...ast.args[ast.args.length - 1]};
        ast.args[ast.args.length - 1].op = token;
        ast.args[ast.args.length - 1].args = [oldLastAst];
        searchPath.push(ast.args[ast.args.length - 1]);
        s = rest;
        continue;
      } else {
        let oldAst = { ...ast };
        ast.op = token;
        ast.args = [oldAst];
        s = rest;
        continue;
      }
    }
  }

  console.log(JSON.stringify(root));

  return root;
};

let getToken = (s: string): [string, string] => {
  return [s.charAt(0), s.slice(1)];
};
