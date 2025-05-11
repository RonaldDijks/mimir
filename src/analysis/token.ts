import type Span from "@/core/span";

export const enum TokenType {
  Number = "number",

  Plus = "plus",
  Minus = "minus",
  Asterisk = "asterisk",
  Slash = "slash",
  AmpersandAmpersand = "ampersand_ampersand",
  PipePipe = "pipe_pipe",
  Equal = "equal",

  True = "true",
  False = "false",
  Identifier = "identifier",

  Unknown = "unknown",
  Eof = "eof",
}

export type Token =
  | NumberToken
  | PlusToken
  | MinusToken
  | AsteriskToken
  | SlashToken
  | AmpersandAmpersandToken
  | PipePipeToken
  | EqualToken
  | TrueToken
  | FalseToken
  | IdentifierToken
  | UnknownToken
  | EofToken;

export interface NumberToken {
  type: TokenType.Number;
  value: number;
  span: Span;
}

export interface PlusToken {
  type: TokenType.Plus;
  span: Span;
}

export interface MinusToken {
  type: TokenType.Minus;
  span: Span;
}

export interface AsteriskToken {
  type: TokenType.Asterisk;
  span: Span;
}

export interface SlashToken {
  type: TokenType.Slash;
  span: Span;
}

export interface AmpersandAmpersandToken {
  type: TokenType.AmpersandAmpersand;
  span: Span;
}

export interface PipePipeToken {
  type: TokenType.PipePipe;
  span: Span;
}

export interface EqualToken {
  type: TokenType.Equal;
  span: Span;
}

export interface TrueToken {
  type: TokenType.True;
  span: Span;
}

export interface FalseToken {
  type: TokenType.False;
  span: Span;
}

export interface IdentifierToken {
  type: TokenType.Identifier;
  name: string;
  span: Span;
}

export interface UnknownToken {
  type: TokenType.Unknown;
  span: Span;
}

export interface EofToken {
  type: TokenType.Eof;
  span: Span;
}
