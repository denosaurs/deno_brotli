import { prepare } from 'https://raw.githubusercontent.com/manyuanrong/deno-plugin-prepare/master/mod.ts';

const filenameBase = "deno_brotli";

const PLUGIN_URL_BASE =
  "https://github.com/divy-work/autopilot-deno/releases/latest/download";

const isDev = Deno.env.get("DEV");

if (isDev) {
  let filenameSuffix = ".so";
  let filenamePrefix = "lib";

  if (Deno.build.os === "windows") {
    filenameSuffix = ".dll";
    filenamePrefix = "";
  }
  if (Deno.build.os === "darwin") {
    filenameSuffix = ".dylib";
  }

  const filename =
    `./target/debug/${filenamePrefix}${filenameBase}${filenameSuffix}`;

  // This will be checked against open resources after Plugin.close()
  // in runTestClose() below.
  const resourcesPre = Deno.resources();

  const rid = Deno.openPlugin(filename);
} else {
  const pluginId = await prepare({
    name: "deno_brotli",
    printLog: true,
    checkCache: Deno.env.get("CACHE") || true,
    urls: {
      darwin: `${PLUGIN_URL_BASE}/libdeno_brotli.dylib`,
      windows: `${PLUGIN_URL_BASE}/deno_brotli.dll`,
      linux: `${PLUGIN_URL_BASE}/libdeno_brotli.so`,
    },
  });
}

const {
  compress
} = Deno.core.ops();

const textDecoder = new TextDecoder();

export function runCompress(arg) {
  const encoder = new TextEncoder();
  const view = encoder.encode(arg);

  const response = Deno.core.dispatch(compress, view);
}

Deno.core.setAsyncHandler(compress, (response) => {});
