#!/usr/bin/env bun

import { Parser } from "@/analysis/parser";
import { Tokenizer } from "@/analysis/tokenizer";
import { VirtualMachine } from "@/execution/virtual-machine";
import { Source } from "@/core/source";

interface ReplOptions {
  printTokens?: boolean;
  printAst?: boolean;
}

export class REPL {
  private vm = new VirtualMachine();
  private options: ReplOptions = {
    printTokens: false,
    printAst: false,
  };

  constructor(options?: ReplOptions) {
    if (options) {
      this.options = { ...this.options, ...options };
    }
  }

  /**
   * Execute a single line of code and return the result
   */
  public execute(input: string): string {
    try {
      // Create source from input
      const source = Source.fromString(input);

      // Tokenize
      const tokenizer = new Tokenizer(input);
      const tokens = tokenizer.tokenize();

      if (this.options.printTokens) {
        console.log("--- Tokens ---");
        console.log(tokens);
      }

      // Parse
      const parser = new Parser(tokens);
      const ast = parser.parse();

      if (this.options.printAst) {
        console.log("--- AST ---");
        console.log(JSON.stringify(ast, null, 2));
      }

      // Execute
      const result = this.vm.run(ast);

      // Return the result as a string
      return `${result.type}: ${result.value}`;
    } catch (error) {
      if (error instanceof Error) {
        return `Error: ${error.message}`;
      }
      return `Error: ${error}`;
    }
  }

  /**
   * Start an interactive REPL session
   */
  public static start(options?: ReplOptions): void {
    const repl = new REPL(options);
    console.log("Mimir REPL - Press Ctrl+C to exit");

    // Use process.stdin if available (Node.js environment)
    if (typeof process !== "undefined" && process.stdin) {
      process.stdin.setEncoding("utf8");
      process.stdout.write("> ");

      process.stdin.on("data", (data) => {
        const input = data.toString().trim();
        if (input === "exit" || input === "quit") {
          process.exit(0);
        }

        const result = repl.execute(input);
        console.log(result);
        process.stdout.write("> ");
      });
    } else {
      console.error(
        "Interactive mode is only available in Node.js environment"
      );
    }
  }
}

// Command line options
const options = {
  printTokens: false,
  printAst: false,
};

// Parse command line arguments
for (const arg of process.argv.slice(2)) {
  if (arg === "--tokens" || arg === "-t") {
    options.printTokens = true;
  } else if (arg === "--ast" || arg === "-a") {
    options.printAst = true;
  } else if (arg === "--help" || arg === "-h") {
    console.log(`
Mimir REPL

Usage:
  bun src/bin/repl.ts [options]

Options:
  -t, --tokens    Print tokens for each statement
  -a, --ast       Print AST for each statement
  -h, --help      Show this help message

Interactive commands:
  exit, quit      Exit the REPL
`);
    process.exit(0);
  }
}

// Start the REPL
REPL.start(options);
