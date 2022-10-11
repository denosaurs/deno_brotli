
import { compress, decompress } from "./mod.ts";

{
  const original = new Uint8Array(65536);
  crypto.getRandomValues(original);

  Deno.bench({
    name: "compress",
    fn: () => {
      compress(original);
    },
  });
}

{
  const original = new Uint8Array(65536);
  crypto.getRandomValues(original);
  const compressed = compress(original);

  Deno.bench({
    name: "decompress",
    fn: () => {
      decompress(compressed);
    },
  });
}
