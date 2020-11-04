// Copyright 2020 the denosaurs team. All rights reserved. MIT license.

import { compress, decompress } from "./mod.ts";
import { bench, runBenchmarks } from "./bench_deps.ts";

bench({
  name: "compress random",
  runs: 1000,
  func(b): void {
    const original = new Uint8Array(65536);
    crypto.getRandomValues(original);

    b.start();
    compress(original);
    b.stop();
  },
});

bench({
  name: "decompress random",
  runs: 1000,
  func(b): void {
    const original = new Uint8Array(65536);
    crypto.getRandomValues(original);
    const compressed = compress(original);

    b.start();
    decompress(compressed);
    b.stop();
  },
});

runBenchmarks();
