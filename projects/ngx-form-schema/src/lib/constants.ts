import { ComparisonOperator } from "./types";

const comparisonOperators: Record<ComparisonOperator, (a: any, b: any) => boolean> = {
  "==": (a, b) => a === b,
  "!=": (a, b) => a !== b,
  ">=": (a, b) => a >= b,
  "<=": (a, b) => a <= b,
  ">": (a, b) => a > b,
  "<": (a, b) => a < b,
};


export const CONTROL_SELF_REF = 'this';
