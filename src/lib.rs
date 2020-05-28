// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

use brotli::{CompressorWriter, DecompressorWriter};
use std::io::Write;
use wasm_bindgen::prelude::wasm_bindgen;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn compress(input: &[u8], buffer_size: usize, quality: u32, lgwin: u32) -> Vec<u8> {
    let mut output = Vec::new();
    {
        let mut writer = CompressorWriter::new(&mut output, buffer_size, quality, lgwin);
        writer.write_all(input).unwrap();
    }
    output
}

#[wasm_bindgen]
pub fn decompress(input: &[u8], buffer_size: usize) -> Vec<u8> {
    let mut output = Vec::new();
    {
        let mut writer = DecompressorWriter::new(&mut output, buffer_size);
        writer.write_all(input).unwrap();
    }
    output
}
