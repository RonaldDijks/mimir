import { ExpressionType, type BinaryExpression, type Expression } from "./ast";
import { TokenType } from "./token";
import { booleanValue, numberValue, ValueType, type Value } from "./value";

export class Evaluator {
  public evaluate(expression: Expression): Value {
    switch (expression.type) {
      case ExpressionType.NumberLiteralExpression:
        return numberValue(expression.value);
      case ExpressionType.BooleanLiteralExpression:
        return booleanValue(expression.value);
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
          return numberValue(left.value + right.value);
        case TokenType.Minus:
          return numberValue(left.value - right.value);
        case TokenType.Asterisk:
          return numberValue(left.value * right.value);
        case TokenType.Slash:
          return numberValue(left.value / right.value);
        case TokenType.EqualsEquals:
          return booleanValue(left.value === right.value);
        case TokenType.BangEquals:
          return booleanValue(left.value !== right.value);
        case TokenType.LessThan:
          return booleanValue(left.value < right.value);
        case TokenType.LessThanEquals:
          return booleanValue(left.value <= right.value);
        case TokenType.GreaterThan:
          return booleanValue(left.value > right.value);
        case TokenType.GreaterThanEquals:
          return booleanValue(left.value >= right.value);
      }
    }

    if (left.type === ValueType.Boolean && right.type === ValueType.Boolean) {
      switch (expression.operator.type) {
        case TokenType.AmpersandAmpersand:
          return booleanValue(left.value && right.value);
        case TokenType.PipePipe:
          return booleanValue(left.value || right.value);
        case TokenType.EqualsEquals:
          return booleanValue(left.value === right.value);
        case TokenType.BangEquals:
          return booleanValue(left.value !== right.value);
      }
    }

    throw new Error("Unexpected operator type");
  }
}
