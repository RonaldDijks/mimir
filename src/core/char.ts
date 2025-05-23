export const isNumeric = (c: string): boolean => {
  return c >= "0" && c <= "9";
};

export const isAlpha = (c: string): boolean => {
  return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z");
};

export const isWhitespace = (c: string): boolean => {
  return c === " " || c === "\t" || c === "\n";
};
