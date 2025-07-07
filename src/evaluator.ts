import { ExpressionType, type BinaryExpression, type Expression } from "./ast";
import { TokenType } from "./token";

export class Evaluator {
  public evaluate(expression: Expression): number {
    switch (expression.type) {
      case ExpressionType.NumberLiteralExpression:
        return expression.value;
      case ExpressionType.BinaryExpression:
        return this.evaluateBinaryExpression(expression);
      default:
        throw new Error("Unexpected expression type");
    }
  }

  private evaluateBinaryExpression(expression: BinaryExpression): number {
    switch (expression.operator.type) {
      case TokenType.Plus:
        return this.evaluate(expression.left) + this.evaluate(expression.right);
      case TokenType.Minus:
        return this.evaluate(expression.left) - this.evaluate(expression.right);
      case TokenType.Asterisk:
        return this.evaluate(expression.left) * this.evaluate(expression.right);
      case TokenType.Slash:
        return this.evaluate(expression.left) / this.evaluate(expression.right);
      default:
        throw new Error("Unexpected operator type");
    }
  }
}
