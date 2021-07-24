import { tokeniser } from "../parsers/tokenise";

test("tokenise", () => {
  let table: [string, string[]][] = [
    ["f(2,3)", ["f", "(", "2", ",", "3", ")"]],
  ];
  for (let [input, expected] of table) {
    tokeniser.reset(input);
    let actual = Array.from(tokeniser).map((x) => x.value);
    expect(actual).toEqual(expected);
  }
});
