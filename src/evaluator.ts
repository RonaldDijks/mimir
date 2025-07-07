import { ExpressionType, type BinaryExpression, type Expression } from "./ast";
import { TokenType } from "./token";
import { ValueType, type Value } from "./value";

export class Evaluator {
  public evaluate(expression: Expression): Value {
    switch (expression.type) {
      case ExpressionType.NumberLiteralExpression:
        return {
          type: ValueType.Number,
          value: expression.value,
        };
      case ExpressionType.BooleanLiteralExpression:
        return {
          type: ValueType.Boolean,
          value: expression.value,
        };
      case ExpressionType.BinaryExpression:
        return this.evaluateBinaryExpression(expression);
      default:
        throw new Error("Unexpected expression type");
    }
  }

  private evaluateBinaryExpression(expression: BinaryExpression): Value {
    const left = this.evaluate(expression.left);
    const right = this.evaluate(expression.right);

    if (left.type === ValueType.Number && right.type === ValueType.Number) {
      switch (expression.operator.type) {
        case TokenType.Plus:
          return {
            type: ValueType.Number,
            value: left.value + right.value,
          };
        case TokenType.Minus:
          return {
            type: ValueType.Number,
            value: left.value - right.value,
          };
        case TokenType.Asterisk:
          return {
            type: ValueType.Number,
            value: left.value * right.value,
          };
        case TokenType.Slash:
          return {
            type: ValueType.Number,
            value: left.value / right.value,
          };
      }
    }

    if (left.type === ValueType.Boolean && right.type === ValueType.Boolean) {
      switch (expression.operator.type) {
        case TokenType.AmpersandAmpersand:
          return {
            type: ValueType.Boolean,
            value: left.value && right.value,
          };
        case TokenType.PipePipe:
          return {
            type: ValueType.Boolean,
            value: left.value || right.value,
          };
      }
    }

    throw new Error("Unexpected operator type");
  }
}
