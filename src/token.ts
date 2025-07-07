import type { Span } from "./span";

export enum TokenType {
  Number = "Number",

  Plus = "Plus",
  Minus = "Minus",
  Asterisk = "Asterisk",
  Slash = "Slash",

  Unknown = "Unknown",
  EndOfFile = "EndOfFile",
}

interface Base {
  span: Span;
  text: string;
}

export interface NumberToken extends Base {
  type: TokenType.Number;
  value: number;
}

export interface PlusToken extends Base {
  type: TokenType.Plus;
}

export interface MinusToken extends Base {
  type: TokenType.Minus;
}

export interface AsteriskToken extends Base {
  type: TokenType.Asterisk;
}

export interface SlashToken extends Base {
  type: TokenType.Slash;
}

export interface UnknownToken extends Base {
  type: TokenType.Unknown;
}

export interface EndOfFileToken extends Base {
  type: TokenType.EndOfFile;
}

export type Token =
  | NumberToken
  | PlusToken
  | MinusToken
  | AsteriskToken
  | SlashToken
  | UnknownToken
  | EndOfFileToken;
