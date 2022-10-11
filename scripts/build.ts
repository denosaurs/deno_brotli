// Copyright 2020-2022 the denosaurs team. All rights reserved. MIT license.

import { encode } from "https://deno.land/std@0.159.0/encoding/base64.ts";
import { compress } from "https://deno.land/x/lz4@v0.1.2/mod.ts";
import { minify } from "https://esm.sh/terser@5.15.1";

const name = "deno_brotli";
const target = "wasm.js";
const encoder = new TextEncoder();

export async function build() {
  if (!(await Deno.stat("Cargo.toml")).isFile) {
    console.log(`the build script should be executed in the "${name}" root`);
    Deno.exit(1);
  }

  console.log("building rust");
  await Deno.run({
    cmd: ["wasm-pack", "build", "--target", "web", "--release"],
  }).status();

  const wasm = await Deno.readFile(`pkg/${name}_bg.wasm`);
  console.log(`read wasm (size: ${wasm.length} bytes)`);
  const compressed = compress(wasm);
  console.log(
    `compressed wasm using lz4 (reduction: ${
      wasm.length -
      compressed.length
    } bytes, size: ${compressed.length})`,
  );
  const encoded = encode(compressed);
  console.log(
    `encoded wasm using base64, (increase: ${
      encoded.length -
      compressed.length
    } bytes, size: ${encoded.length})`,
  );

  console.log("inlining wasm and init code in js");
  const init = await Deno.readTextFile(`pkg/${name}.js`);
  const source = `import * as lz4 from "https://deno.land/x/lz4@v0.1.2/mod.ts";
                export const source = lz4.decompress(Uint8Array.from(atob("${encoded}"), c => c.charCodeAt(0)));
                ${init}`;

  console.log("minifying js using terser");
  const output = await minify(source, {
    mangle: { module: true },
    output: {
      preamble: `// deno-lint-ignore-file\n// deno-fmt-ignore-file`,
    },
  });

  const reduction = new Blob([source]).size -
    new Blob([output.code!]).size;
  console.log(`minified js, size reduction: ${reduction} bytes`);

  console.log(`writing output to file (${target})`);
  await Deno.writeFile(target, encoder.encode(output.code));

  const outputFile = await Deno.stat(target);
  console.log(
    `output file (${target}), final size is: ${outputFile.size} bytes`,
  );
}

if (import.meta.main) {
  await build();
}
