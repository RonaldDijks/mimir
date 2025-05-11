import {
  BinaryOperator,
  ExpressionType,
  type BinaryExpression,
  type BooleanExpression,
  type Expression,
  type NumberExpression,
  type IdentifierExpression,
  type AssignmentExpression,
  type Statement,
  StatementType,
  type DeclarationStatement,
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

export class UndefinedVariableError extends Error {
  public constructor(public readonly name: string) {
    super(`Variable '${name}' is not defined`);
  }
}

export class AssignmentToImmutableVariableError extends Error {
  public constructor(public readonly name: string) {
    super(`Variable '${name}' is not mutable`);
  }
}

interface VariableDeclaration {
  value: Value;
  mut: boolean;
}

export class VirtualMachine {
  private environment = new Map<string, VariableDeclaration>();

  public run(statement: Statement): Value {
    return this.statement(statement);
  }

  private statement(statement: Statement): Value {
    switch (statement.type) {
      case StatementType.Expression:
        return this.expression(statement.expression);
      case StatementType.Declaration:
        return this.declaration(statement);
    }
  }

  private declaration(declaration: DeclarationStatement): Value {
    const value = this.expression(declaration.value);
    this.environment.set(declaration.identifier.name, {
      value,
      mut: declaration.mut,
    });
    return value;
  }

  private expression(expression: Expression): Value {
    switch (expression.type) {
      case ExpressionType.Binary:
        return this.binaryExpression(expression);
      case ExpressionType.Number:
        return this.numberExpression(expression);
      case ExpressionType.Boolean:
        return this.booleanExpression(expression);
      case ExpressionType.Identifier:
        return this.identifierExpression(expression);
      case ExpressionType.Assignment:
        return this.assignmentExpression(expression);
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

  private identifierExpression(expression: IdentifierExpression): Value {
    const value = this.environment.get(expression.name);
    if (value === undefined) {
      throw new UndefinedVariableError(expression.name);
    }
    return value.value;
  }

  private assignmentExpression(expression: AssignmentExpression): Value {
    const declaration = this.environment.get(expression.left.name);
    if (declaration === undefined) {
      throw new UndefinedVariableError(expression.left.name);
    }
    if (!declaration.mut) {
      throw new AssignmentToImmutableVariableError(expression.left.name);
    }
    const value = this.expression(expression.right);
    this.environment.set(expression.left.name, {
      value,
      mut: declaration.mut,
    });
    return value;
  }
}
