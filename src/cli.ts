// deno-lint-ignore-file
import args from "https://deno.land/x/args@2.1.1/wrapper.ts"
import { EarlyExitFlag, PartialOption } from "https://deno.land/x/args@2.1.1/flag-types.ts";
import { Text } from "https://deno.land/x/args@2.1.1/value-types.ts"
import { Pillar } from "./pillar.ts";
import { MAIN_COMMAND } from "https://deno.land/x/args@2.1.1/symbols.ts";

export class Cli {
  private _pkg:     any;
  private _parser:  any;
  private _pillar?: Pillar;

  constructor() {
    this.init();
  }

  public async init() {
    this._pkg     = JSON.parse(await Deno.readTextFile("./package.json"));
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
      .with(
        EarlyExitFlag('version', {
          alias: ['v'],
          describe: 'Show the version and exit',
          exit() {
            console.log(`Pillar v${version}`);
            return Deno.exit(0);
          }
        })
      )
      .with(
        PartialOption('input', {
          alias: ['i'],
          describe: 'The input file to compile',
          default: 'unknown',
          type: Text,
        })
      )
      .with(
        PartialOption('output', {
          alias: ['o'],
          describe: 'The output file to write to',
          default: 'unknown',
          type: Text,
        })
      );

    return parser;
  }

  public async run(args: string[]) {
    const res               = this._parser.parse(args);

    if (res.tag !== MAIN_COMMAND) {
      console.log(this._parser.help());
      Deno.exit(1);
    }

    if (res.remaining().rawFlags().length) {
      console.error("Unknown flags:", ...res.remaining().rawFlags());
      Deno.exit(1);
    }

    const { input, output } = res.value;
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