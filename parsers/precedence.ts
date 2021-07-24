export let operatorPrecedence = new Map<string, number>();
operatorPrecedence.set("(", 0);
operatorPrecedence.set(" ", 10);
operatorPrecedence.set("f", 15);
operatorPrecedence.set("+", 20);
operatorPrecedence.set("-", 20);
operatorPrecedence.set("*", 30);