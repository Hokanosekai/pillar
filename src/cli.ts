// deno-lint-ignore-file
import args from "https://deno.land/x/args@2.1.1/wrapper.ts"
import { EarlyExitFlag, Option, PartialOption } from "https://deno.land/x/args@2.1.1/flag-types.ts";
import { Text } from "https://deno.land/x/args@2.1.1/value-types.ts"
import { Pillar } from "./pillar.ts";
import { MAIN_COMMAND, PARSE_FAILURE } from "https://deno.land/x/args@2.1.1/symbols.ts";
import packageJson from "../package.json" assert { type: "json" };

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

    //console.log(res.tag, MAIN_COMMAND);

    switch (res.tag) {
      case PARSE_FAILURE:
        console.error(res.error.toString());
        Deno.exit(1);
      case MAIN_COMMAND:
      case 'run':
        console.log("Running...");
        break;
      case 'compile':
        console.log("Compiling...");
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

    //console.log(res, res.remaining().rawFlags());


    /*if (res.remaining().rawFlags().length) {
      console.error("Unknown flags:", ...res.remaining().rawFlags());
      Deno.exit(1);
    }*/

    const { input, output } = res.value.value;
    //console.log(input, output);

    this._pillar            = new Pillar(output);
    const source            = await Deno.readTextFile(input);

    await this._pillar?.start(source);

    if (this._pillar?.diagnostic.hasErrors()) {
      this._pillar.diagnostic.print();
    } else {
      console.log("No errors found.");
    }
  }
}