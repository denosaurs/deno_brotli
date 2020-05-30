// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import { encode } from "https://deno.land/std@0.54.0/encoding/base64.ts";
import { compress } from "https://deno.land/x/lz4@v0.1.0/mod.ts";
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

const wasm = await Deno.readFile("pkg/deno_brotli_bg.wasm");
const compressed = compress(wasm);
console.log(
  `[!] compressed wasm using lz4, size reduction: ${wasm.length -
    compressed.length} bytes`,
);
const encoded = encode(compressed);
console.log(
  `[!] encoding wasm using base64, size increase: ${encoded.length -
    compressed.length} bytes`,
);

console.log("[!] inlining wasm in js");
const source = `import * as lz4 from "https://deno.land/x/lz4@v0.1.0/mod.ts";
                export const source = lz4.decompress(Uint8Array.from(atob("${encoded}"), c => c.charCodeAt(0)));`;

const init = await Deno.readTextFile("pkg/deno_brotli.js");

console.log("[!] minifying js");

const output = Terser.minify(`${source}\n${init}`, {
  mangle: { module: true },
  output: {
    preamble: "//deno-fmt-ignore-file",
  },
});

if (output.error) {
  console.log(
    `[!] Error: ${output.error}`,
  );
  Deno.exit(1);
}

console.log(
  `[!] minified js, size reduction: ${new Blob([(`${source}\n${init}`)]).size -
    new Blob([output.code]).size} bytes`,
);

console.log(`[!] writing output to file ("wasm.js")`);
await Deno.writeFile(
  "wasm.js",
  encoder.encode(output.code),
);

const outputFile = await Deno.stat("wasm.js");
console.log(`[!] output file ("wasm.js") size is: ${outputFile.size} bytes`);
