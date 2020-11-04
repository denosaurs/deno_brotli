// Copyright 2020 the denosaurs team. All rights reserved. MIT license.

import { requires, run } from "./_util.ts";

export async function lint() {
  await requires("cargo", "deno");
  await run(
    "linting typescript",
    [
      "deno",
      "--unstable",
      "lint",
      "scripts",
      "bench_deps.ts",
      "bench.ts",
      "test_deps.ts",
      "test.ts",
      "mod.ts",
    ],
    true,
  );

  await run("linting rust", ["cargo", "clippy"], true);
}

if (import.meta.main) {
  await lint();
}
