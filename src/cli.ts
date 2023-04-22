// deno-lint-ignore-file
import args from "https://deno.land/x/args@2.1.1/wrapper.ts"
import { EarlyExitFlag, Option, PartialOption } from "https://deno.land/x/args@2.1.1/flag-types.ts";
import { Text } from "https://deno.land/x/args@2.1.1/value-types.ts"
import { Pillar } from "./pillar.ts";
import { MAIN_COMMAND, PARSE_FAILURE } from "https://deno.land/x/args@2.1.1/symbols.ts";
import packageJson from "../package.json" assert { type: "json" };
import { PillarRepl } from "./compiler/repl.ts";

export class Cli {
  private _pkg:     any;
  private _parser:  any;
  private _pillar?: Pillar;

  public async init() {
    this._pkg     = packageJson;
    this._parser  = this.createParser();
  }

  public get pkg() {
    return this._pkg;
  }

  public get parser() {
    return this._parser;
  }

  public get pillar() {
    return this._pillar;
  }

  private createParser() {
    const version = this._pkg.version;

    const globalOptions = args
      .with(Option('input', {
        alias: ['i'],
        describe: 'The input file',
        type: Text,
      }))

    const parser  = args
      .describe("Pillar CLI v" + version)
      .with(
        EarlyExitFlag('help', {
          alias: ['h', '?'],
          describe: 'Show this help message and exit',
          exit() {
            console.log(parser.help());
            return Deno.exit(0);
          }
        })
      )
      .sub(
        'run',
        globalOptions,
      )
      .sub(
        'compile',
        globalOptions
          .with(Option('output', {
            alias: ['o'],
            describe: 'The output file',
            type: Text,
          }))
      )
      .with(
        EarlyExitFlag('version', {
          alias: ['v'],
          describe: 'Show the version and exit',
          exit() {
            console.log(`Pillar v${version}`);
            return Deno.exit(0);
          }
        })
      );

    return parser;
  }

  public async run(args: string[]) {
    const res               = this._parser.parse(args);

    switch (res.tag) {
      case PARSE_FAILURE:
        console.error(res.error.toString());
        Deno.exit(1);
      case MAIN_COMMAND:
        break;
      default:
        console.log("Unknown command:", res.tag);
        console.log(this._parser.help());
        Deno.exit(1);
    }

    if (res.tag !== MAIN_COMMAND) {
      console.log(this._parser.help());
      Deno.exit(1);
    }

    if (res.value?.value === undefined) {
      // Start REPL
      const repl = new PillarRepl();
      await repl.start();
      return;
    }


    const { input, output } = res.value.value;
    if (!input) {
      console.error("No input file specified.");
      Deno.exit(1);
    }

    if (res.tag === 'compile' && !output) {
      console.error("No output file specified.");
      Deno.exit(1);
    }

    this._pillar            = new Pillar(output);
    const source            = await Deno.readTextFile(input);

    let behavior: string    = 'compile';
    res.consumedArgs.forEach((element: any) => {
      if (element.raw === 'run' || element.raw === 'compile') {
        behavior = element.raw;
      }
    });

    if (behavior === 'compile') {
      console.log("Compiling...");
      await this._pillar.compile(source);

    } else if (behavior === 'run') {
      console.log("Running...");
      await this._pillar.run(source);
    } else {
      console.error("Unknown behavior:", behavior);
      Deno.exit(1);
    }
  }
}