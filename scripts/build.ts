// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import Terser from "https://cdn.pika.dev/terser@^4.7.0";

const toml = await Deno.stat("Cargo.toml");
if (!toml.isFile) {
  console.log(
    "[!] Error: the build script should be executed in the `deno_brotli` root.",
  );
  Deno.exit(1);
}

const cargo = Deno.run({
  cmd: ["wasm-pack", "build", "--target", "web", "--release"],
});

await cargo.status();

const wasm = await Deno.readFile("pkg/deno_brotli_bg.wasm");
const init = await Deno.readTextFile("pkg/deno_brotli.js");

const encoder = new TextEncoder();

let binary = "";
for (let i = 0, l = wasm.length; i < l; i++) {
  binary += String.fromCharCode(wasm[i]);
}

const source = `export const source = Uint8Array.from(atob(\`${
  btoa(binary)
}\`), c => c.charCodeAt(0));`;

const output = Terser.minify(`${source}\n${init}`);

await Deno.writeFile(
  "wasm.js",
  encoder.encode(`//deno-fmt-ignore-file\n${output.code}`),
);

const outputFile = await Deno.stat("wasm.js");
console.log("[!] output file (`wasm.js`) size is:", outputFile.size, "bytes");
