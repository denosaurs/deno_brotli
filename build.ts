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

await Deno.writeFile(
  "wasm.js",
  encoder.encode(
    `// deno-fmt-ignore-file\n${source}\n${init}`,
  ),
);
