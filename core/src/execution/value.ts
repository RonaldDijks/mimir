export enum ValueType {
  Number = "number",
  Boolean = "boolean",
  String = "string",
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

export function isNumberValue(value: Value): value is NumberValue {
  return value.type === ValueType.Number;
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

export function isBooleanValue(value: Value): value is BooleanValue {
  return value.type === ValueType.Boolean;
}

export interface StringValue {
  type: ValueType.String;
  value: string;
}

export function stringValue(value: string): StringValue {
  return {
    type: ValueType.String,
    value,
  };
}

export function isStringValue(value: Value): value is StringValue {
  return value.type === ValueType.String;
}

export interface NilValue {
  type: ValueType.Nil;
}

export const NIL: NilValue = {
  type: ValueType.Nil,
};

export function isNilValue(value: Value): value is NilValue {
  return value.type === ValueType.Nil;
}

export type Value = NumberValue | BooleanValue | StringValue | NilValue;
