import {
  type AssignmentExpression,
  type BinaryExpression,
  type Block,
  type BlockExpression,
  type Expression,
  ExpressionType,
  type IdentifierExpression,
  type IfExpression,
  type LetStatement,
  type Statement,
  StatementType,
  type UnaryExpression,
} from "../analysis/ast";
import { TokenType } from "../analysis/token";
import { assertNever } from "../util/assert";
import {
  booleanValue,
  isBooleanValue,
  isNumberValue,
  isStringValue,
  NIL,
  numberValue,
  stringValue,
  type Value,
} from "./value";

function performNumericOperation(
  left: number,
  right: number,
  operator: TokenType,
): Value {
  switch (operator) {
    case TokenType.Plus:
      return numberValue(left + right);
    case TokenType.Minus:
      return numberValue(left - right);
    case TokenType.Asterisk:
      return numberValue(left * right);
    case TokenType.Slash:
      if (right === 0) {
        throw new Error("Division by zero");
      }
      return numberValue(left / right);
    case TokenType.EqualsEquals:
      return booleanValue(left === right);
    case TokenType.BangEquals:
      return booleanValue(left !== right);
    case TokenType.LessThan:
      return booleanValue(left < right);
    case TokenType.LessThanEquals:
      return booleanValue(left <= right);
    case TokenType.GreaterThan:
      return booleanValue(left > right);
    case TokenType.GreaterThanEquals:
      return booleanValue(left >= right);
    default:
      throw new Error(`Unsupported numeric operator: ${operator}`);
  }
}

function performBooleanOperation(
  left: boolean,
  right: boolean,
  operator: TokenType,
): Value {
  switch (operator) {
    case TokenType.AmpersandAmpersand:
      return booleanValue(left && right);
    case TokenType.PipePipe:
      return booleanValue(left || right);
    case TokenType.EqualsEquals:
      return booleanValue(left === right);
    case TokenType.BangEquals:
      return booleanValue(left !== right);
    default:
      throw new Error(`Unsupported boolean operator: ${operator}`);
  }
}

function performStringOperation(
  left: string,
  right: string,
  operator: TokenType,
): Value {
  switch (operator) {
    case TokenType.PlusPlus:
      return stringValue(left + right);
    default:
      throw new Error(`Unsupported string operator: ${operator}`);
  }
}

class Environment {
  private values: Map<string, Value> = new Map();
  private mutability: Map<string, boolean> = new Map();

  public set(name: string, value: Value, mutable: boolean = false) {
    this.values.set(name, value);
    this.mutability.set(name, mutable);
  }

  public get(name: string): Value | undefined {
    return this.values.get(name);
  }

  public update(name: string, value: Value): void {
    if (!this.values.has(name)) {
      throw new Error(`Undefined variable: ${name}`);
    }
    if (!this.mutability.get(name)) {
      throw new Error(`Cannot assign to immutable variable: ${name}`);
    }
    this.values.set(name, value);
  }

  public isMutable(name: string): boolean {
    return this.mutability.get(name) ?? false;
  }
}

export class Evaluator {
  private environment: Environment = new Environment();
  private readonly MAX_CALL_DEPTH = 1000;
  private callDepth = 0;

  public evaluate(statement: Statement): Value {
    return this.evaluateStatement(statement);
  }

  public evaluateStatement(statement: Statement): Value {
    switch (statement.type) {
      case StatementType.ExpressionStatement:
        return this.evaluateExpression(statement.expression);
      case StatementType.LetStatement:
        return this.evaluateLetStatement(statement);
    }
  }

  private evaluateLetStatement(statement: LetStatement): Value {
    const value = this.evaluateExpression(statement.value);
    this.environment.set(statement.name.text, value, statement.mut);
    return value;
  }

  public evaluateExpression(expression: Expression): Value {
    switch (expression.type) {
      case ExpressionType.AssignmentExpression:
        return this.evaluateAssignmentExpression(expression);
      case ExpressionType.ParenthesizedExpression:
        return this.evaluateExpression(expression.expression);
      case ExpressionType.UnaryExpression:
        return this.evaluateUnaryExpression(expression);
      case ExpressionType.BinaryExpression:
        return this.evaluateBinaryExpression(expression);
      case ExpressionType.IdentifierExpression:
        return this.evaluateIdentifierExpression(expression);
      case ExpressionType.IfExpression:
        return this.evaluateIfExpression(expression);
      case ExpressionType.BlockExpression:
        return this.evaluateBlockExpression(expression);
      case ExpressionType.NumberLiteralExpression:
        return numberValue(expression.value);
      case ExpressionType.BooleanLiteralExpression:
        return booleanValue(expression.value);
      case ExpressionType.StringLiteralExpression:
        return stringValue(expression.value);
      default:
        assertNever(expression);
    }
  }

  private evaluateAssignmentExpression(
    expression: AssignmentExpression,
  ): Value {
    const value = this.evaluateExpression(expression.right);
    this.environment.update(expression.left.text, value);
    return value;
  }

  private evaluateUnaryExpression(expression: UnaryExpression): Value {
    const right = this.evaluateExpression(expression.right);
    switch (expression.operator.type) {
      case TokenType.Bang:
        if (!isBooleanValue(right)) {
          throw new Error(`Cannot apply '!' operator to ${right.type}`);
        }
        return booleanValue(!right.value);
      case TokenType.Minus:
        if (!isNumberValue(right)) {
          throw new Error(`Cannot apply '-' operator to ${right.type}`);
        }
        return numberValue(-right.value);
      default:
        throw new Error(
          `Unexpected unary operator type: ${expression.operator.type}`,
        );
    }
  }

  private evaluateBinaryExpression(expression: BinaryExpression): Value {
    const left = this.evaluateExpression(expression.left);
    const right = this.evaluateExpression(expression.right);

    if (isNumberValue(left) && isNumberValue(right)) {
      return performNumericOperation(
        left.value,
        right.value,
        expression.operator.type,
      );
    }

    if (isBooleanValue(left) && isBooleanValue(right)) {
      return performBooleanOperation(
        left.value,
        right.value,
        expression.operator.type,
      );
    }

    if (isStringValue(left) && isStringValue(right)) {
      return performStringOperation(
        left.value,
        right.value,
        expression.operator.type,
      );
    }

    throw new Error(
      `Unsupported operation: ${left.type} ${expression.operator.type} ${right.type}`,
    );
  }

  private evaluateIdentifierExpression(
    expression: IdentifierExpression,
  ): Value {
    const value = this.environment.get(expression.name.text);
    if (value === undefined) {
      throw new Error(`Undefined variable: ${expression.name.text}`);
    }
    return value;
  }

  private evaluateIfExpression(expression: IfExpression): Value {
    // Protect against stack overflow from deeply nested if expressions
    this.callDepth++;
    if (this.callDepth > this.MAX_CALL_DEPTH) {
      throw new Error(
        `Maximum call depth exceeded. Consider reducing the nesting depth of your if expressions.`,
      );
    }

    try {
      const condition = this.evaluateExpression(expression.condition);

      // More specific error message for non-boolean conditions
      if (!isBooleanValue(condition)) {
        throw new Error(
          `If condition must be a boolean value, got ${condition.type}. ` +
            `Consider using comparison operators (==, !=, <, >, etc.) to create a boolean condition.`,
        );
      }

      if (condition.value) {
        return this.evaluateBlock(expression.then_branch);
      }

      if (expression.else_branch) {
        if (expression.else_branch.type === ExpressionType.IfExpression) {
          return this.evaluateIfExpression(expression.else_branch);
        } else {
          return this.evaluateBlockExpression(expression.else_branch);
        }
      }

      return NIL;
    } finally {
      this.callDepth--;
    }
  }

  private evaluateBlockExpression(expression: BlockExpression): Value {
    return this.evaluateBlock(expression.block);
  }

  private evaluateBlock(block: Block): Value {
    // Handle empty blocks gracefully
    if (block.statements.length === 0) {
      return NIL;
    }

    let value: Value = NIL;
    for (const statement of block.statements) {
      value = this.evaluateStatement(statement);
    }
    return value;
  }
}
