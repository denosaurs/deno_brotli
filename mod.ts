
import init, {
  compress as wasmCompress,
  decompress as wasmDecompress,
  source,
} from "./wasm.js";

await init(source);

/**
 * Compress a byte array.
 *
 * ```typescript
 * import { compress } from "https://deno.land/x/brotli/mod.ts";
 * const text = new TextEncoder().encode("X".repeat(64));
 * console.log(text.length);                   // 64 Bytes
 * console.log(compress(text).length);         // 10 Bytes
 * ```
 *
 * @param input Input data.
 * @param bufferSize Read buffer size
 * @param quality Controls the compression-speed vs compression-
 * density tradeoff. The higher the quality, the slower the compression.
 * @param lgwin Base 2 logarithm of the sliding window size.
 */
export function compress(
  input: Uint8Array,
  bufferSize = 4096,
  quality = 6,
  lgwin = 22,
): Uint8Array {
  return wasmCompress(input, bufferSize, quality, lgwin);
}

/**
 * Decompress a byte array.
 *
 * ```typescript
 * import { decompress } from "https://deno.land/x/brotli/mod.ts";
 * const compressed = Uint8Array.from([ 27, 63, 0, 0, 36, 176, 226, 153, 64, 18 ]);
 * console.log(compressed.length);             // 10 Bytes
 * console.log(decompress(compressed).length); // 64 Bytes
 * ```
 *
 * @param input Input data.
 * @param bufferSize Read buffer size
 */
export function decompress(
  input: Uint8Array,
  bufferSize = 4096,
): Uint8Array {
  return wasmDecompress(input, bufferSize);
}
