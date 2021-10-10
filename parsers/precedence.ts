import { Token } from "moo";
import { relationOperators } from "../constants/relationOperators";

export let operatorPrecedence = new Map<string, number>();
operatorPrecedence.set("(", 0);
operatorPrecedence.set(" ", 10);
for (let operator of relationOperators) {
  operatorPrecedence.set(operator, 12);
}
operatorPrecedence.set("f", 15);
operatorPrecedence.set("+", 20);
operatorPrecedence.set("-", 20);
operatorPrecedence.set("*", 30);
operatorPrecedence.set("/", 30);

export let getPrecedence = (token: Token | null): number => {
  if (token === null) return 0;
  if (token.type === "number" || token.type === "integer") {
    return 0;
  }

  let precedence = operatorPrecedence.get(token.value) ?? null;
  if (precedence === null) throw `Precedence for ${token.value} not found`;
  return precedence;
};
