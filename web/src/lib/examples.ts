import { dedent } from "@mimir/core/src/util/dedent";

export interface Example {
  id: string;
  name: string;
  description: string;
  code: string;
}

export const examples: Example[] = [
  {
    id: "hello",
    name: "Hello World",
    description: "A simple hello world example",
    code: dedent`
      "Hello, World!"
    `,
  },
  {
    id: "arithmetic",
    name: "Arithmetic Operations",
    description: "Basic arithmetic operations with numbers",
    code: dedent`
      let a = 10
      let b = 20
      let sum = a + b
      let product = a * b
      let difference = b - a
      let quotient = b / a
      sum
    `,
  },
  {
    id: "strings",
    name: "String Concatenation",
    description: "Concatenating strings with the ++ operator",
    code: dedent`
      let greeting = "Hello"
      let name = "Mimir"
      greeting ++ ", " ++ name ++ "!"
    `,
  },
  {
    id: "booleans",
    name: "Boolean Logic",
    description: "Working with boolean values and logical operators",
    code: dedent`
      let isTrue = true
      let isFalse = false
      let and = isTrue && isFalse
      let or = isTrue || isFalse
      let not = !isFalse
      not
    `,
  },
  {
    id: "comparison",
    name: "Comparison Operators",
    description: "Comparing values with comparison operators",
    code: dedent`
      let x = 10
      let y = 20
      let equal = x == y
      let notEqual = x != y
      let lessThan = x < y
      let greaterThan = x > y
      let lessOrEqual = x <= y
      let greaterOrEqual = x >= y
      lessThan
    `,
  },
  {
    id: "if-else",
    name: "If-Else Expressions",
    description: "Conditional execution with if-else",
    code: dedent`
      let age = 18
      if age >= 18 {
        "You are an adult"
      } else {
        "You are a minor"
      }
    `,
  },
  {
    id: "if-else-chain",
    name: "If-Else Chain",
    description: "Multiple conditions with if-else-if chains",
    code: dedent`
      let score = 85
      if score >= 90 {
        "Grade: A"
      } else if score >= 80 {
        "Grade: B"
      } else if score >= 70 {
        "Grade: C"
      } else {
        "Grade: F"
      }
    `,
  },
  {
    id: "mutability",
    name: "Mutable Variables",
    description: "Using mutable variables with let mut",
    code: dedent`
      let mut counter = 0
      counter = counter + 1
      counter = counter + 1
      counter = counter + 1
      counter
    `,
  },
  {
    id: "operator-precedence",
    name: "Operator Precedence",
    description: "How operators are evaluated in order",
    code: dedent`
      let result1 = 1 + 2 * 3
      let result2 = (1 + 2) * 3
      result2
    `,
  },
  {
    id: "complex",
    name: "Complex Expression",
    description: "A more complex example combining multiple features",
    code: dedent`
      let mut x = 5
      let y = 10
      
      if x < y {
        x = x * 2
      }
      
      let message = if x == y {
        "x equals y"
      } else if x > y {
        "x is greater than y"
      } else {
        "x is less than y"
      }
      
      message
    `,
  },
];

export const defaultExample = examples[0];
