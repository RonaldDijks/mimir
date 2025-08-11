import { expect, test } from "bun:test";
import { dedent } from "../util/dedent";
import {
	assignmentExpression,
	binaryExpression,
	blockExpression,
	booleanLiteralExpression,
	expressionStatement,
	ifExpression,
	letStatement,
	numberLiteralExpression,
	parenthesizedExpression,
	StatementType,
	sourceFile,
	stringLiteralExpression,
	unaryExpression,
} from "./ast";
import { Parser } from "./parser";
import { type Token, TokenType } from "./token";
import { tokenize } from "./tokenizer";

function parseExpression(tokens: Token[]) {
	const parser = new Parser(tokens);
	const sourceFile = parser.parse();
	if (sourceFile.statements.length !== 1) {
		throw new Error("Expected 1 statement");
	}
	const statement = sourceFile.statements[0];
	if (statement?.type !== StatementType.ExpressionStatement) {
		throw new Error("Expected expression statement");
	}
	return statement.expression;
}

test("parse simple expression", () => {
	const tokens = tokenize("1 + 2 * 3");
	const ast = parseExpression(tokens);
	expect(ast).toStrictEqual(
		binaryExpression(
			numberLiteralExpression(1, { start: 0, end: 1 }),
			binaryExpression(
				numberLiteralExpression(2, { start: 4, end: 5 }),
				numberLiteralExpression(3, { start: 8, end: 9 }),
				{
					type: TokenType.Asterisk,
					text: "*",
					span: { start: 6, end: 7 },
				},
				{ start: 4, end: 9 },
			),
			{ type: TokenType.Plus, text: "+", span: { start: 2, end: 3 } },
			{ start: 0, end: 9 },
		),
	);
});

test("parses complex operator precedence correctly", () => {
	const tokens = tokenize("1 + 2 * 3 + 4 * 5");
	const ast = parseExpression(tokens);
	expect(ast).toStrictEqual(
		binaryExpression(
			binaryExpression(
				numberLiteralExpression(1, { start: 0, end: 1 }),
				binaryExpression(
					numberLiteralExpression(2, { start: 4, end: 5 }),
					numberLiteralExpression(3, { start: 8, end: 9 }),
					{ type: TokenType.Asterisk, text: "*", span: { start: 6, end: 7 } },
					{ start: 4, end: 9 },
				),
				{ type: TokenType.Plus, text: "+", span: { start: 2, end: 3 } },
				{ start: 0, end: 9 },
			),
			binaryExpression(
				numberLiteralExpression(4, { start: 12, end: 13 }),
				numberLiteralExpression(5, { start: 16, end: 17 }),
				{
					type: TokenType.Asterisk,
					text: "*",
					span: { start: 14, end: 15 },
				},
				{ start: 12, end: 17 },
			),
			{ type: TokenType.Plus, text: "+", span: { start: 10, end: 11 } },
			{ start: 0, end: 17 },
		),
	);
});

test("parse boolean expression", () => {
	const tokens = tokenize("true && false || true");
	const ast = parseExpression(tokens);
	expect(ast).toStrictEqual(
		binaryExpression(
			binaryExpression(
				booleanLiteralExpression(true, { start: 0, end: 4 }),
				booleanLiteralExpression(false, { start: 8, end: 13 }),
				{
					type: TokenType.AmpersandAmpersand,
					text: "&&",
					span: { start: 5, end: 7 },
				},
				{ start: 0, end: 13 },
			),
			booleanLiteralExpression(true, { start: 17, end: 21 }),
			{ type: TokenType.PipePipe, text: "||", span: { start: 14, end: 16 } },
			{ start: 0, end: 21 },
		),
	);
});

test("parse string literal expression", () => {
	const tokens = tokenize('"hello"');
	const ast = parseExpression(tokens);
	expect(ast).toStrictEqual(
		stringLiteralExpression("hello", { start: 0, end: 7 }),
	);
});

test("parse string concatenation expression", () => {
	const tokens = tokenize('"hello" ++ " world"');
	const ast = parseExpression(tokens);
	expect(ast).toStrictEqual(
		binaryExpression(
			stringLiteralExpression("hello", { start: 0, end: 7 }),
			stringLiteralExpression(" world", { start: 11, end: 19 }),
			{ type: TokenType.PlusPlus, text: "++", span: { start: 8, end: 10 } },
			{ start: 0, end: 19 },
		),
	);
});

test("parse comparison expression", () => {
	const operators: [string, TokenType][] = [
		["==", TokenType.EqualsEquals],
		["!=", TokenType.BangEquals],
		[">", TokenType.GreaterThan],
		[">=", TokenType.GreaterThanEquals],
		["<", TokenType.LessThan],
		["<=", TokenType.LessThanEquals],
	];
	for (const operator of operators) {
		const expression = `1 ${operator[0]} 2`;
		const ast = parseExpression(tokenize(expression));
		expect(ast).toStrictEqual(
			binaryExpression(
				numberLiteralExpression(1, { start: 0, end: 1 }),
				numberLiteralExpression(2, {
					start: 2 + operator[0].length + 1,
					end: 2 + operator[0].length + 2,
				}),
				{
					type: operator[1],
					text: operator[0],
					span: { start: 2, end: 2 + operator[0].length },
				} as Token,
				{ start: 0, end: 2 + operator[0].length + 2 },
			),
		);
	}
});

test("parse unary expression", () => {
	const tokens = tokenize("!true");
	const ast = parseExpression(tokens);
	expect(ast).toStrictEqual(
		unaryExpression(
			{
				type: TokenType.Bang,
				text: "!",
				span: { start: 0, end: 1 },
			},
			booleanLiteralExpression(true, { start: 1, end: 5 }),
			{ start: 0, end: 5 },
		),
	);
});

test("parse parenthesized expression", () => {
	const tokens = tokenize("(1 + 2) * 3");
	const ast = parseExpression(tokens);
	expect(ast).toStrictEqual(
		binaryExpression(
			parenthesizedExpression(
				binaryExpression(
					numberLiteralExpression(1, { start: 1, end: 2 }),
					numberLiteralExpression(2, { start: 5, end: 6 }),
					{ type: TokenType.Plus, text: "+", span: { start: 3, end: 4 } },
					{ start: 1, end: 6 },
				),
				{ start: 0, end: 7 },
			),
			numberLiteralExpression(3, { start: 10, end: 11 }),
			{ type: TokenType.Asterisk, text: "*", span: { start: 8, end: 9 } },
			{ start: 0, end: 11 },
		),
	);
});

test("parse let expression", () => {
	const tokens = tokenize("let mut abc = 123");
	const parser = new Parser(tokens);
	const file = parser.parse();
	expect(file).toStrictEqual(
		sourceFile(
			[
				letStatement(
					true,
					{
						type: TokenType.Identifier,
						text: "abc",
						span: { start: 8, end: 11 },
					},
					numberLiteralExpression(123, { start: 14, end: 17 }),
				),
			],
			{
				type: TokenType.EndOfFile,
				text: "\0",
				span: { start: 17, end: 17 },
			},
		),
	);
});

test("parse assignment expression", () => {
	const tokens = tokenize("abc = 123");
	const ast = parseExpression(tokens);
	expect(ast).toStrictEqual(
		assignmentExpression(
			{ type: TokenType.Identifier, text: "abc", span: { start: 0, end: 3 } },
			numberLiteralExpression(123, { start: 6, end: 9 }),
			{ start: 0, end: 9 },
		),
	);
});

test("parse if expression", () => {
	const input = dedent`
    if true {
      1
    } else if true {
      2
    } else {
      3
    }
  `;
	const tokens = tokenize(input);
	const ast = parseExpression(tokens);
	expect(ast).toStrictEqual(
		ifExpression(
			booleanLiteralExpression(true, { start: 3, end: 7 }),
			{
				statements: [
					expressionStatement(
						numberLiteralExpression(1, { start: 12, end: 13 }),
					),
				],
			},
			ifExpression(
				booleanLiteralExpression(true, { start: 24, end: 28 }),
				{
					statements: [
						expressionStatement(
							numberLiteralExpression(2, { start: 33, end: 34 }),
						),
					],
				},
				blockExpression(
					[
						expressionStatement(
							numberLiteralExpression(3, { start: 46, end: 47 }),
						),
					],
					{ start: 37, end: 49 },
				),
				{ start: 21, end: 49 },
			),
			{ start: 0, end: 49 },
		),
	);
});

test("parse if expression without else", () => {
	const input = "if true { 1 }";
	const tokens = tokenize(input);
	const ast = parseExpression(tokens);
	expect(ast).toStrictEqual(
		ifExpression(
			booleanLiteralExpression(true, { start: 3, end: 7 }),
			{
				statements: [
					expressionStatement(
						numberLiteralExpression(1, { start: 10, end: 11 }),
					),
				],
			},
			null,
			{ start: 0, end: 13 },
		),
	);
});

test("parse if expression with only else", () => {
	const input = "if false { 1 } else { 2 }";
	const tokens = tokenize(input);
	const ast = parseExpression(tokens);
	expect(ast).toStrictEqual(
		ifExpression(
			booleanLiteralExpression(false, { start: 3, end: 8 }),
			{
				statements: [
					expressionStatement(
						numberLiteralExpression(1, { start: 11, end: 12 }),
					),
				],
			},
			blockExpression(
				[
					expressionStatement(
						numberLiteralExpression(2, { start: 22, end: 23 }),
					),
				],
				{ start: 15, end: 25 },
			),
			{ start: 0, end: 25 },
		),
	);
});

test("parser error for missing condition", () => {
	const input = "if { 1 }";
	const tokens = tokenize(input);
	expect(() => parseExpression(tokens)).toThrow("Unexpected token: BraceOpen");
});
