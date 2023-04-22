export class Writer {
  private static OUT_DIR = "./out";

  constructor(
    private _target:  string,
    private _sources: string[],
  ) {
    if (this._sources.length === 0) {
      throw new Error("No source code to write");
    }

    if (this._target.length === 0) {
      throw new Error("No target file specified");
    }

    // Check if the output directory exists
    try {
      Deno.statSync(Writer.OUT_DIR);
    } catch (e) {
      if (e instanceof Deno.errors.NotFound) {
        Deno.mkdirSync(Writer.OUT_DIR, { recursive: true });
      } else {
        throw e;
      }
    }

    let file;

    try {
      file = Deno.statSync(`${this.target}`)
    } catch (e) {
      if (e instanceof Deno.errors.NotFound) {
        file = null;
      } else {
        throw e;
      }
    }

    if (file?.isFile) {
      const overwrite = prompt(`File '${this.target}' already exists. Overwrite? (y/n)`);
      if (overwrite === "y") {
        Deno.removeSync(this.target);
      } else {
        Deno.exit(0);
      }
    } else {
      Deno.createSync(this.target);
    }
  }

  private get target() {
    return `${Writer.OUT_DIR}/${this._target}`;
  }

  public async write() {
    console.log(`Writing into ${this.target}`);

    const encoder = new TextEncoder();
    const data = encoder.encode(this._sources.join(""));

    await Deno.writeFile(this.target, data);

    return this.target;
  }
}