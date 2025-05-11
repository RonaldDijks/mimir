export interface Value {
  value: number;
}

export function numberValue(value: number): Value {
  return { value };
}
