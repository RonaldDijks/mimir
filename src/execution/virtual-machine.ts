import {
  BinaryOperator,
  ExpressionType,
  type BinaryExpression,
  type BooleanExpression,
  type Expression,
  type NumberExpression,
} from "@/analysis/ast";
import {
  booleanValue,
  numberValue,
  ValueType,
  type Value,
} from "@/execution/value";

export class UnknownOperatorError extends Error {
  public constructor(
    public readonly operator: BinaryOperator,
    public readonly left: ValueType,
    public readonly right: ValueType
  ) {
    super(`Unknown binary operator ${operator} for '${left}' and '${right}'`);
  }
}

export class VirtualMachine {
  public run(expression: Expression): Value {
    return this.expression(expression);
  }

  private expression(expression: Expression): Value {
    switch (expression.type) {
      case ExpressionType.Binary:
        return this.binaryExpression(expression);
      case ExpressionType.Number:
        return this.numberExpression(expression);
      case ExpressionType.Boolean:
        return this.booleanExpression(expression);
    }
  }

  private binaryExpression(expression: BinaryExpression): Value {
    const left = this.expression(expression.left);
    const right = this.expression(expression.right);

    if (left.type === ValueType.Number && right.type === ValueType.Number) {
      switch (expression.operator) {
        case BinaryOperator.Addition:
          return numberValue(left.value + right.value);
        case BinaryOperator.Subtraction:
          return numberValue(left.value - right.value);
        case BinaryOperator.Multiplication:
          return numberValue(left.value * right.value);
        case BinaryOperator.Division:
          return numberValue(left.value / right.value);
      }
    }

    if (left.type === ValueType.Boolean && right.type === ValueType.Boolean) {
      switch (expression.operator) {
        case BinaryOperator.LogicalAnd:
          return booleanValue(left.value && right.value);
        case BinaryOperator.LogicalOr:
          return booleanValue(left.value || right.value);
      }
    }

    throw new UnknownOperatorError(expression.operator, left.type, right.type);
  }

  private numberExpression(expression: NumberExpression): Value {
    return numberValue(expression.value);
  }

  private booleanExpression(expression: BooleanExpression): Value {
    return booleanValue(expression.value);
  }
}
