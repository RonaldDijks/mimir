import type { Span } from "./span";

export enum TokenType {
  Number = "Number",

  Plus = "Plus",
  Minus = "Minus",
  Asterisk = "Asterisk",
  Slash = "Slash",

  AmpersandAmpersand = "AmpersandAmpersand",
  PipePipe = "PipePipe",
  EqualsEquals = "EqualsEquals",
  Bang = "Bang",
  BangEquals = "BangEquals",
  LessThan = "LessThan",
  LessThanEquals = "LessThanEquals",
  GreaterThan = "GreaterThan",
  GreaterThanEquals = "GreaterThanEquals",

  ParenthesisOpen = "ParenthesisOpen",
  ParenthesisClose = "ParenthesisClose",

  True = "True",
  False = "False",

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

export interface PlusToken extends Base<TokenType.Plus> {}
export interface MinusToken extends Base<TokenType.Minus> {}
export interface AsteriskToken extends Base<TokenType.Asterisk> {}
export interface SlashToken extends Base<TokenType.Slash> {}

export interface AmpersandAmpersandToken
  extends Base<TokenType.AmpersandAmpersand> {}
export interface PipePipeToken extends Base<TokenType.PipePipe> {}
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

export interface TrueToken extends Base<TokenType.True> {}
export interface FalseToken extends Base<TokenType.False> {}

export interface UnknownToken extends Base<TokenType.Unknown> {}
export interface EndOfFileToken extends Base<TokenType.EndOfFile> {}

export type Token =
  | NumberToken
  | PlusToken
  | MinusToken
  | AsteriskToken
  | SlashToken
  | AmpersandAmpersandToken
  | PipePipeToken
  | EqualsEqualsToken
  | BangToken
  | BangEqualsToken
  | LessThanToken
  | LessThanEqualsToken
  | GreaterThanToken
  | GreaterThanEqualsToken
  | ParenthesisOpenToken
  | ParenthesisCloseToken
  | TrueToken
  | FalseToken
  | UnknownToken
  | EndOfFileToken;

export function keyword(
  input: string
): TokenType.True | TokenType.False | TokenType.Unknown {
  if (input === "true") {
    return TokenType.True;
  } else if (input === "false") {
    return TokenType.False;
  }
  return TokenType.Unknown;
}
