// mod.ts

// Import deno plugin methods
import {
  runCompress
} from "./plugin/index.js";

// Import types
// TODO(divy-work): Define types
// import { } from "./types.ts";

/**
 * Creates an deno-brotli instance
 */
class Brotli {
  /**
   * executes runCompress with the str param
   * @param {string} str The string to be compressed
   */
  compress(str: string) {
    runType(str);
    return this;
  }
}

/**
 * Export the Brotli class
 */
export default Brotli;
