import { Cli } from "./cli.ts";

const cli = new Cli();

cli.init().then(() => {
  cli.run(Deno.args);
});

