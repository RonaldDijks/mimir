import type Span from "@/core/span";

export const enum TokenType {
  // Literals
  Number = "number",
  True = "true",
  False = "false",

  // Operators
  Plus = "plus",
  Minus = "minus",
  Asterisk = "asterisk",
  Slash = "slash",
  AmpersandAmpersand = "ampersand_ampersand",
  PipePipe = "pipe_pipe",
  Equal = "equal",

  // Punctuation
  Semicolon = "semicolon",

  // Identifiers
  Identifier = "identifier",

  // Special
  Unknown = "unknown",
  Eof = "eof",
}

// Generic base token interface with common properties
export interface BaseToken<T extends TokenType, P = {}> {
  type: T;
  span: Span;
}

// Token definitions with specific properties
export type NumberToken = BaseToken<TokenType.Number> & {
  value: number;
};

export type IdentifierToken = BaseToken<TokenType.Identifier> & {
  name: string;
};

// Simple tokens without additional properties
export type PlusToken = BaseToken<TokenType.Plus>;
export type MinusToken = BaseToken<TokenType.Minus>;
export type AsteriskToken = BaseToken<TokenType.Asterisk>;
export type SlashToken = BaseToken<TokenType.Slash>;
export type AmpersandAmpersandToken = BaseToken<TokenType.AmpersandAmpersand>;
export type PipePipeToken = BaseToken<TokenType.PipePipe>;
export type EqualToken = BaseToken<TokenType.Equal>;
export type SemicolonToken = BaseToken<TokenType.Semicolon>;
export type TrueToken = BaseToken<TokenType.True>;
export type FalseToken = BaseToken<TokenType.False>;
export type UnknownToken = BaseToken<TokenType.Unknown>;
export type EofToken = BaseToken<TokenType.Eof>;

// Union type for all tokens, ordered to match TokenType enum
export type Token =
  // Literals
  | NumberToken
  | TrueToken
  | FalseToken

  // Operators
  | PlusToken
  | MinusToken
  | AsteriskToken
  | SlashToken
  | AmpersandAmpersandToken
  | PipePipeToken
  | EqualToken

  // Punctuation
  | SemicolonToken

  // Identifiers
  | IdentifierToken

  // Special
  | UnknownToken
  | EofToken;
