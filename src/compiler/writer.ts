export class Writer {
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

    let file;

    try {
      file = Deno.statSync(this._target);
    } catch (e) {
      if (e instanceof Deno.errors.NotFound) {
        file = null;
      } else {
        throw e;
      }
    }

    if (file?.isFile) {
      const overwrite = prompt(`File '${this._target}' already exists. Overwrite? (y/n)`);
      if (overwrite === "y") {
        Deno.removeSync(this._target);
      } else {
        Deno.exit(0);
      }
    } else {
      Deno.createSync(this._target);
    }
  }

  public async write() {
    console.log(`Writing ${this._target}...`);

    const encoder = new TextEncoder();
    const data = encoder.encode(this._sources.join(""));

    await Deno.writeFile(this._target, data);

    return this._target;
  }
}