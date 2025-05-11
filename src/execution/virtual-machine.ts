import {
  BinaryOperator,
  ExpressionType,
  type BinaryExpression,
  type Expression,
  type NumberExpression,
} from "@/analysis/ast";
import type { Value } from "@/execution/value";

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
    }
  }

  private binaryExpression(expression: BinaryExpression): Value {
    const left = this.expression(expression.left);
    const right = this.expression(expression.right);
    switch (expression.operator) {
      case BinaryOperator.Plus:
        return { value: left.value + right.value };
      case BinaryOperator.Minus:
        return { value: left.value - right.value };
      case BinaryOperator.Asterisk:
        return { value: left.value * right.value };
      case BinaryOperator.Slash:
        return { value: left.value / right.value };
      default:
        throw new Error(`Unknown binary operator: ${expression.operator}`);
    }
  }

  private numberExpression(expression: NumberExpression): Value {
    return { value: expression.value };
  }
}
