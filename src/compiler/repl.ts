// deno-lint-ignore-file no-explicit-any
import { Diagnostic } from "../utils/diagnostic.ts";
import { Emitter } from "./emitter.ts";
import { Environment } from "./environment.ts";
import { Evaluator } from "./evaluator.ts";
import { Parser } from "./parser.ts";
import packageJson from "../../package.json" assert { type: "json" };

export class PillarRepl {
  private _environment!:    Environment;
  private _diagnostic!:     Diagnostic;
  private _parser!:         Parser;
  private _pre_line:        string | null = null;
  private _pkg:             any;

  constructor() {
    this._pkg         = packageJson;
    this._environment = Environment.create();
    this._diagnostic  = new Diagnostic();

    this.printStartMessage();
  }

  public get diagnostic() {
    return this._diagnostic;
  }

  public get environment() {
    return this._environment;
  }

  public get parser() {
    return this._parser;
  }

  private printStartMessage() {
    console.log(`Pillar REPL v${this._pkg.version}`);
    console.log("Press Ctrl+C to exit");
    console.log("");
  }

  public async run(source: string) {

    const leftBraceCount  = source.split("{").length;
    const rightBraceCount = source.split("}").length;

    if (leftBraceCount !== rightBraceCount) {
      return;
    }

    this._parser = new Parser(source);

    // Parse the source code
    const {root, diagnostic} = this._parser.parse();
    this._diagnostic.merge(diagnostic);

    if (this._diagnostic.hasErrors()) {
      this._diagnostic.print();
      Deno.exit(1);
    }

    const evaluator = new Evaluator(root, this._environment);
    await evaluator.evaluate();

    this._diagnostic.merge(evaluator.diagnostic);

    if (this._diagnostic.hasErrors()) {
      this._diagnostic.print();
      Deno.exit(1);
    }

    const emitter = new Emitter(evaluator.result);
    emitter.emit();

    this._diagnostic.merge(emitter.diagnostic);

    if (this._diagnostic.hasErrors()) {
      this._diagnostic.print();
      Deno.exit(1);
    }

    if (emitter.result.length == 0) {
      console.log("");
    } else {
      console.log("");
      console.log(emitter.result.join(""));
    }
  }

  public async start() {
    let source = "";

    while (true) {
      const line = prompt("> ");

      if (line === "exit") {
        Deno.exit(0);
      } else if (line === "clear") {
        source = "";
        continue;
      }

      if (line !== this._pre_line) {
        source += line + "\n";
        this._pre_line = line;
      }

      try {
        await this.run(source);
      } catch (error) {
        console.log(error);
      }
    }
  }
}