export enum ValueType {
  Number = "number",
  Boolean = "boolean",
  Nil = "nil",
}

export interface NumberValue {
  type: ValueType.Number;
  value: number;
}

export function numberValue(value: number): NumberValue {
  return {
    type: ValueType.Number,
    value,
  };
}

export interface BooleanValue {
  type: ValueType.Boolean;
  value: boolean;
}

export function booleanValue(value: boolean): BooleanValue {
  return {
    type: ValueType.Boolean,
    value,
  };
}

export interface NilValue {
  type: ValueType.Nil;
}

export const NIL: NilValue = {
  type: ValueType.Nil,
};

export type Value = NumberValue | BooleanValue | NilValue;
