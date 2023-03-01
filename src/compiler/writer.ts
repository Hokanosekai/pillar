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

    // Check if the target file exists and if it does, 
    // ask the user if they want to overwrite it else create the file
    if (Deno.statSync(this._target).isFile) {
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