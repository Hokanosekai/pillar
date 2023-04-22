import { Emitter } from "./compiler/emitter.ts";
import { Environment } from "./compiler/environment.ts";
import { Evaluator } from "./compiler/evaluator.ts";
import { Parser } from "./compiler/parser.ts";
import { Writer } from "./compiler/writer.ts";
import { Diagnostic } from "./utils/diagnostic.ts";

export class Pillar {
  private _environment!:    Environment;
  private _diagnostic!:     Diagnostic;
  private _parser!:         Parser;
  private _writer!:         Writer;

  constructor(
    private _target: string,
  ) {
    this._environment = Environment.create();
    this._diagnostic  = new Diagnostic();
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

  public async run(source: string) {
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

    console.log("");
    console.log(emitter.result.join(""));

    this._diagnostic.merge(emitter.diagnostic);

    if (this._diagnostic.hasErrors()) {
      this._diagnostic.print();
      Deno.exit(1);
    } else {
      console.log("No errors found.");
    }

    console.log("Done!");
  }

  public async compile(source: string) {
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

    this._writer = new Writer(this._target, emitter.result);
    await this._writer.write();

    this._diagnostic.merge(emitter.diagnostic);

    if (this._diagnostic.hasErrors()) {
      this._diagnostic.print();
      Deno.exit(1);
    } else {
      console.log("No errors found.");
    }

    console.log("Done.");
  }
}