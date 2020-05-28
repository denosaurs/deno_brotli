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

#[test]
pub fn compress_test() {
    const BUFFER_SIZE: usize = 4692;
    const QUALITY: u32 = 6;
    const WINDOW_SIZE: u32 = 22;
    assert_eq!(
        compress("".as_bytes(), BUFFER_SIZE, QUALITY, WINDOW_SIZE),
        [59]
    );
    assert_eq!(
        compress("X".repeat(64).as_bytes(), BUFFER_SIZE, QUALITY, WINDOW_SIZE),
        [27, 63, 0, 0, 36, 176, 226, 153, 64, 18]
    )
}

#[test]
pub fn decompress_test() {
    const BUFFER_SIZE: usize = 4692;
    assert_eq!(
        decompress(&[27, 63, 0, 0, 36, 176, 226, 153, 64, 18], BUFFER_SIZE,),
        "X".repeat(64).as_bytes()
    );
    assert_eq!(
        decompress(&[27, 63, 0, 0, 36, 176, 226, 153, 64, 18], BUFFER_SIZE,),
        "X".repeat(64).as_bytes()
    );
}
