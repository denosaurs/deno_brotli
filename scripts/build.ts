// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import Terser from "https://cdn.pika.dev/terser@^4.7.0";

const encoder = new TextEncoder();

const toml = await Deno.stat("Cargo.toml");
if (!toml.isFile) {
  console.log(
    `[!] Error: the build script should be executed in the "deno_brotli" root`,
  );
  Deno.exit(1);
}

console.log("[!] building using wasm-pack");
const pack = Deno.run(
  { cmd: ["wasm-pack", "build", "--target", "web", "--release"] },
);
await pack.status();

console.log("[!] inlining wasm in js");
const wasm = await Deno.readFile("pkg/deno_brotli_bg.wasm");

let binary = "";
for (let i = 0, l = wasm.length; i < l; i++) {
  binary += String.fromCharCode(wasm[i]);
}

const source = `export const source = Uint8Array.from(atob(\`${
  btoa(binary)
}\`), c => c.charCodeAt(0));`;

const init = await Deno.readTextFile("pkg/deno_brotli.js");

const output = Terser.minify(`${source}\n${init}`);
console.log(
  `[!] minified js, size reduction: ${new Blob([(`${source}\n${init}`)]).size -
    new Blob([output.code]).size} bytes`,
);

console.log(`[!] writing output to file ("wasm.js")`);
await Deno.writeFile(
  "wasm.js",
  encoder.encode(`//deno-fmt-ignore-file\n${output.code}`),
);

const outputFile = await Deno.stat("wasm.js");
console.log(`[!] output file ("wasm.js") size is: ${outputFile.size} bytes`);
