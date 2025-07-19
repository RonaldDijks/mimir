import type { Span } from "../core/span";

export enum TokenType {
  Number = "Number",
  StringLiteral = "StringLiteral",

  Plus = "Plus",
  Minus = "Minus",
  Asterisk = "Asterisk",
  Slash = "Slash",

  PlusPlus = "PlusPlus",
  AmpersandAmpersand = "AmpersandAmpersand",
  PipePipe = "PipePipe",
  Equals = "Equals",
  EqualsEquals = "EqualsEquals",
  Bang = "Bang",
  BangEquals = "BangEquals",
  LessThan = "LessThan",
  LessThanEquals = "LessThanEquals",
  GreaterThan = "GreaterThan",
  GreaterThanEquals = "GreaterThanEquals",

  ParenthesisOpen = "ParenthesisOpen",
  ParenthesisClose = "ParenthesisClose",
  BraceOpen = "BraceOpen",
  BraceClose = "BraceClose",

  Let = "Let",
  Mut = "Mut",
  True = "True",
  False = "False",
  Identifier = "Identifier",
  If = "If",
  Else = "Else",

  Unknown = "Unknown",
  EndOfFile = "EndOfFile",
}

interface Base<Type extends TokenType> {
  type: Type;
  span: Span;
  text: string;
}

export interface NumberToken extends Base<TokenType.Number> {
  value: number;
}

export interface StringToken extends Base<TokenType.StringLiteral> {
  value: string;
}

export interface PlusToken extends Base<TokenType.Plus> {}
export interface MinusToken extends Base<TokenType.Minus> {}
export interface AsteriskToken extends Base<TokenType.Asterisk> {}
export interface SlashToken extends Base<TokenType.Slash> {}

export interface PlusPlusToken extends Base<TokenType.PlusPlus> {}
export interface AmpersandAmpersandToken
  extends Base<TokenType.AmpersandAmpersand> {}
export interface PipePipeToken extends Base<TokenType.PipePipe> {}
export interface EqualsToken extends Base<TokenType.Equals> {}
export interface EqualsEqualsToken extends Base<TokenType.EqualsEquals> {}
export interface BangToken extends Base<TokenType.Bang> {}
export interface BangEqualsToken extends Base<TokenType.BangEquals> {}
export interface LessThanToken extends Base<TokenType.LessThan> {}
export interface LessThanEqualsToken extends Base<TokenType.LessThanEquals> {}
export interface GreaterThanToken extends Base<TokenType.GreaterThan> {}
export interface GreaterThanEqualsToken
  extends Base<TokenType.GreaterThanEquals> {}

export interface ParenthesisOpenToken extends Base<TokenType.ParenthesisOpen> {}
export interface ParenthesisCloseToken
  extends Base<TokenType.ParenthesisClose> {}
export interface BraceOpenToken extends Base<TokenType.BraceOpen> {}
export interface BraceCloseToken extends Base<TokenType.BraceClose> {}

export interface LetToken extends Base<TokenType.Let> {}
export interface MutToken extends Base<TokenType.Mut> {}
export interface TrueToken extends Base<TokenType.True> {}
export interface FalseToken extends Base<TokenType.False> {}
export interface IdentifierToken extends Base<TokenType.Identifier> {}
export interface IfToken extends Base<TokenType.If> {}
export interface ElseToken extends Base<TokenType.Else> {}

export interface UnknownToken extends Base<TokenType.Unknown> {}
export interface EndOfFileToken extends Base<TokenType.EndOfFile> {}

export type Token =
  | NumberToken
  | StringToken
  | PlusToken
  | MinusToken
  | AsteriskToken
  | SlashToken
  | PlusPlusToken
  | AmpersandAmpersandToken
  | PipePipeToken
  | EqualsToken
  | EqualsEqualsToken
  | BangToken
  | BangEqualsToken
  | LessThanToken
  | LessThanEqualsToken
  | GreaterThanToken
  | GreaterThanEqualsToken
  | ParenthesisOpenToken
  | ParenthesisCloseToken
  | BraceOpenToken
  | BraceCloseToken
  | TrueToken
  | FalseToken
  | LetToken
  | MutToken
  | IdentifierToken
  | IfToken
  | ElseToken
  | UnknownToken
  | EndOfFileToken;

type KeywordType =
  | TokenType.True
  | TokenType.False
  | TokenType.Let
  | TokenType.Mut
  | TokenType.If
  | TokenType.Else;

export function keyword(input: string): KeywordType | TokenType.Identifier {
  if (input === "true") {
    return TokenType.True;
  } else if (input === "false") {
    return TokenType.False;
  } else if (input === "let") {
    return TokenType.Let;
  } else if (input === "mut") {
    return TokenType.Mut;
  } else if (input === "if") {
    return TokenType.If;
  } else if (input === "else") {
    return TokenType.Else;
  }
  return TokenType.Identifier;
}
