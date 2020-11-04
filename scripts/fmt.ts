// Copyright 2020 the denosaurs team. All rights reserved. MIT license.

import { requires, run } from "./_util.ts";

export async function fmt() {
  await requires("cargo", "deno");
  await run(
    "formatting typescript",
    [
      "deno",
      "--unstable",
      "fmt",
      "scripts/",
      "bench_deps.ts",
      "bench.ts",
      "test_deps.ts",
      "test.ts",
      "mod.ts",
    ],
  );

  await run("formatting rust", ["cargo", "fmt"]);
}

if (import.meta.main) {
  await fmt();
}
