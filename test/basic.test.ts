import { AST } from "../parsers/ast";
import { parse } from "../parsers/tex-ast";

// test("get number tests", () => {
//   let table: [string, AST][] = [
//     ["12.3423ast", { op: "error", message: "Unexpected input", rest: "ast" }],
//     ["12.3423", 12.3423],
//     [
//       "12.342.3",
//       { op: "error", message: "Unexpected input", rest: "12.342.3" },
//     ],
//   ];

//   for (let [input, output] of table) {
//     expect(parse(input)).toEqual(output);
//   }
// });

test("init", () => {
  let table: [string, AST][] = [
    ["1", 1],
    ["1+1", { op: "+", left: 1, right: 1 }],
    [
      "1+2*3",
      {
        op: "+",
        left: 1,
        right: { op: "*", left: 2, right: 3 },
      },
    ],
    [
      "2*3+1",
      {
        op: "+",
        left: {
          op: "*",
          left: 2,
          right: 3,
        },
        right: 1,
      },
    ],
    [
      "1+2*3+4",
      {
        op: "+",
        left: {
          op: "+",
          left: 1,
          right: { op: "*", left: 2, right: 3 },
        },
        right: 4,
      },
    ],
    [
      "-1+2",
      {
        op: "+",
        left: { op: "-", right: 1 },
        right: 2,
      },
    ],
    [
      "1+-2",
      {
        op: "+",
        left: 1,
        right: { op: "-", right: 2 },
      },
    ],
    [
      "2*(3+1)",
      {
        op: "*",
        left: 2,
        right: { op: "+", left: 3, right: 1 },
      },
    ],
    ["f(2)(3)", { op: "f", left: 2, right: 3 }],
    ["f{2}{3}", { op: "f", left: 2, right: 3 }],
    ["f(2, 3)", { op: "f", left: 2, right: 3 }],
    [
      "\\Delta*(\\alpha+\\beta)",
      {
        op: "*",
        left: "\\Delta",
        right: { op: "+", left: "\\alpha", right: "\\beta" },
      },
    ],
    [
      "2*(3+1}",
      {
        op: "*",
        left: 2,
        right: { op: "+", left: 3, right: 1 },
      },
    ],
    [
      "2<3",
      {
        op: "<",
        left: 2,
        right: 3,
      },
    ],
    [
      "f(3, 4) \\sqsupseteq 3",
      {
        op: "\\sqsupseteq",
        left: {
          op: "f",
          left: 3,
          right: 4,
        },
        right: 3,
      },
    ],
  ];

  for (let [input, output] of table) {
    expect(parse(input)).toEqual(output);
  }
});
