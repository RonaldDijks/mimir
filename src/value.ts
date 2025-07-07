export enum ValueType {
  Number = "number",
  Boolean = "boolean",
}

export interface NumberValue {
  type: ValueType.Number;
  value: number;
}

export interface BooleanValue {
  type: ValueType.Boolean;
  value: boolean;
}

export type Value = NumberValue | BooleanValue;
