// Copyright 2020 the denosaurs team. All rights reserved. MIT license.

import { exists } from "./_deps.ts";
import { requires, run } from "./_util.ts";

export async function clean() {
  await requires("cargo");
  await run("cleaning cargo build", ["cargo", "clean"]);
  if (exists("pkg")) {
    console.log("removing pkg");
    await Deno.remove("pkg", { recursive: true });
  }
}

if (import.meta.main) {
  await clean();
}
