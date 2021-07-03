import { AST, constAST, initAST, parse } from "../parsers/tex-ast";

// test("get number tests", () => {
//   let table: [string, AST][] = [
//     ["12.3423ast", { tag: "error", message: "Unexpected input", rest: "ast" }],
//     ["12.3423", 12.3423],
//     [
//       "12.342.3",
//       { tag: "error", message: "Unexpected input", rest: "12.342.3" },
//     ],
//   ];

//   for (let [input, output] of table) {
//     expect(parse(input)).toEqual(output);
//   }
// });

test("init", () => {
  let table: [string, AST][] = [
    ["1", { op: "root", args: [{ op: "1", args: [] }] }],
    [
      "1+1",
      { op: "root", args: [{ op: "+", args: [constAST("1"), constAST("1")] }] },
    ],
    [
      "1+2*3",
      {
        op: "root",
        args: [
          {
            op: "+",
            args: [
              constAST("1"),
              { op: "*", args: [constAST("2"), constAST("3")] },
            ],
          },
        ],
      },
    ],
    [
      "2*3+1",
      {
        op: "root",
        args: [
          {
            op: "+",
            args: [
              { op: "*", args: [constAST("2"), constAST("3")] },
              constAST("1"),
            ],
          },
        ],
      },
    ],
    [
      "1+2*3+4",
      {
        op: "root",
        args: [
          {
            op: "+",
            args: [
              constAST("1"),
              { op: "*", args: [constAST("2"), constAST("3")] },
              constAST("4"),
            ],
          },
        ],
      },
    ],
  ];

  for (let [input, output] of table) {
    expect(parse(input)).toEqual(output);
  }
});
