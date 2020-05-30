// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import { compress, decompress } from "./mod.ts";
import { assertEquals } from "https://deno.land/std@0.54.0/testing/asserts.ts";

function encode(input: string): Uint8Array {
  return new TextEncoder().encode(input);
}

Deno.test({
  name: "compress",
  fn: () => {
    // empty
    assertEquals(compress(encode("")), [59]);
    // 'X' x64 times
    assertEquals(
      compress(encode("X".repeat(64))),
      [27, 63, 0, 0, 36, 176, 226, 153, 64, 18],
    );
  },
});

Deno.test({
  name: "decompress",
  fn: () => {
    // empty
    assertEquals(decompress(Uint8Array.from([59])), []);
    // 'X' x64 times
    assertEquals(
      decompress(Uint8Array.from([27, 63, 0, 0, 36, 176, 226, 153, 64, 18])),
      encode("X".repeat(64)),
    );
  },
});
