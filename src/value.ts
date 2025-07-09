export enum ValueType {
  Number = "number",
  Boolean = "boolean",
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

export type Value = NumberValue | BooleanValue;
