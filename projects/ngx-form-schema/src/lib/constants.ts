import { ComparisonOperator } from "./types";

export const comparisonOperators: Record<ComparisonOperator, (a: any, b: any) => boolean> = {
  "==": (a, b) => a === b,
  "!=": (a, b) => a !== b,
  ">=": (a, b) => a >= b,
  "<=": (a, b) => a <= b,
  ">": (a, b) => a > b,
  "<": (a, b) => a < b,
};