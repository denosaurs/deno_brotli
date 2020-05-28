# deno_brotli

[![stars](https://img.shields.io/github/stars/denosaurs/deno_brotli)](https://github.com/denosaurs/deno_brotli/stargazers)
[![workflow](https://img.shields.io/github/workflow/status/denosaurs/deno_brotli/ci)](https://github.com/denosaurs/deno_brotli/actions)
[![releases](https://img.shields.io/github/v/release/denosaurs/deno_brotli)](https://github.com/denosaurs/deno_brotli/releases/latest/)
[![deno version](https://img.shields.io/badge/deno-^1.0.2-informational)](https://github.com/denoland/deno)
[![deno doc](https://img.shields.io/badge/deno-doc-informational)](https://doc.deno.land/https/deno.land/x/deno_brotli/mod.ts)
[![Discord](https://img.shields.io/discord/713043818806509608)](https://discord.gg/shHG8vg)
[![license](https://img.shields.io/github/license/denosaurs/deno_brotli)](https://github.com/denosaurs/deno_brotli/blob/master/LICENSE)
[![issues](https://img.shields.io/github/issues/denosaurs/deno_brotli)](https://github.com/denosaurs/deno_brotli/issues)

This module provides [brotli](https://en.wikipedia.org/wiki/Brotli) support for deno and the web by providing [simple bindings](src/lib.rs) using [rust-brotli](https://github.com/dropbox/rust-brotli) compiled to webassembly.

## Usage

### Compression

```ts
import { compress } from "https://deno.land/x/brotli/mod.ts";

const text = new TextEncoder().encode("X".repeat(64));

console.log(text.length);                   // 64 Bytes
console.log(compress(text).length);         // 10 Bytes
```

### Decompression

```ts
import { decompress } from "https://deno.land/x/brotli/mod.ts";

const compressed = Uint8Array.from([ 27, 63, 0, 0, 36, 176, 226, 153, 64, 18 ]);

console.log(compressed.length);             // 10 Bytes
console.log(decompress(compressed).length); // 64 Bytes
```

## Other

### Contribution

Pull request, issues and feedback are very welcome. Code style is formatted with `deno fmt` and commit messages are done following [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) spec.

### Licence

Copyright 2020-present, the denosaurs team. All rights reserved. MIT license.
