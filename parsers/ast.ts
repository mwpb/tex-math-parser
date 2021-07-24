import { Literal, Static, Union } from "runtypes";

export type Atom = number;

export const unaryOperatorSchema = Union(Literal("+"), Literal("-"));
export type UnaryOperator = Static<typeof unaryOperatorSchema>;

export type UnaryNode = {
  op: UnaryOperator;
  right: AST;
};

export const binaryPrefixSchema = Union(Literal("f"));
export const binaryInfixSchema = Union(
  Literal("+"),
  Literal("-"),
  Literal("*")
);
export const binaryOperatorSchema = binaryPrefixSchema.Or(binaryInfixSchema);
export type BinaryOperator = Static<typeof binaryOperatorSchema>;
export type BinaryNode = {
  op: BinaryOperator;
  left: AST;
  right: AST;
};

export type AST = Atom | UnaryNode | BinaryNode;
