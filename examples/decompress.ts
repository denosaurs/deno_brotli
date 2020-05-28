import Brotli from '../mod.ts';

const brotli = new Brotli();

console.log(
  brotli.decompress(brotli.compress("bruh"))
);
