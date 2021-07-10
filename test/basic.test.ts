import { AST, parse } from "../parsers/tex-ast";

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
    // ["1", 1],
    // ["1+1", { tag: "binary_addition", left: 1, right: 1 }],
    // [
    //   "1+2*3",
    //   {
    //     tag: "binary_addition",
    //     left: 1,
    //     right: { tag: "binary_multiplication", left: 2, right: 3 },
    //   },
    // ],
    [
      "2*3+1",
      {
        tag: "binary_addition",
        left: {
          tag: "binary_multiplication",
          left: 2,
          right: 3,
        },
        right: 1,
      },
    ],
    // [
    //   "1+2*3+4",
    //   {
    //     tag: "binary_addition",
    //     left: {
    //       tag: "binary_addition",
    //       left: 1,
    //       right: { tag: "binary_multiplication", left: 2, right: 3 },
    //     },
    //     right: 4,
    //   },
    // ],
    // [
    //   "-1+2",
    //   {
    //     tag: "binary_addition",
    //     left: { tag: "unary_subtraction", right: 1 },
    //     right: 2,
    //   },
    // ],
    // [
    //   "1+-2",
    //   {
    //     tag: "binary_addition",
    //     left: 1,
    //     right: { tag: "unary_subtraction", right: 2 },
    //   },
    // ],
  ];

  for (let [input, output] of table) {
    expect(parse(input)).toEqual(output);
  }
});
