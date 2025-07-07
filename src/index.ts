import { tokenize } from "./tokenizer";

const input = "123 + 321";
const tokens = tokenize(input);
console.log(tokens);
