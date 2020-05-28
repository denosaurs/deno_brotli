import init, { source, compress as wasm_compress, decompress as wasm_decompress } from "./wasm.js";

await init(source);

export function compress(input: Uint8Array, bufferSize: number = 4096, quality: number = 6, lgwin: number = 22): Uint8Array {
  return wasm_compress(input, bufferSize, quality, lgwin);
}
  
export function decompress(input: Uint8Array, bufferSize: number = 4096): Uint8Array {
  return wasm_decompress(input, bufferSize);
}
