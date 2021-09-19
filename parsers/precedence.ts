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
