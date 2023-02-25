export class Writer {
  constructor(
    private _target:  string,
    private _sources: string[],
  ) {}

  public async write() {
    console.log(`Writing ${this._target}...`);
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const source  = decoder.decode(await Deno.readFile(`./${this._target}`));
    const output  = encoder.encode(source);

    await Deno.writeFile(this._target, output);

    console.log(`Wrote ${this._target}`);

    for (const source of this._sources) {
      const output = encoder.encode(source);
      await Deno.writeFile(source, output);

      console.log(`Wrote ${source}`);
    }

    return this._target;
  }
}