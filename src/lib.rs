// lib.rs

use brotli2::raw::{decompress_buf, CoStatus, Compress, CompressOp, Error};
use std::io::prelude::*;

// use deno_core and futures
use deno_core::plugin_api::Buf;
use deno_core::plugin_api::Interface;
use deno_core::plugin_api::Op;
use deno_core::plugin_api::ZeroCopyBuf;
use futures::future::FutureExt;

// use serde
use serde::Deserialize;
use serde::Serialize;

use std::path::Path;

// register all ops here
#[no_mangle]
pub fn deno_plugin_init(interface: &mut dyn Interface) {
    interface.register_op("compress", op_compress);
    interface.register_op("decompress", op_decompress);
}

// deno bindings for `compress`
fn op_compress(_interface: &mut dyn Interface, data: &[u8], zero_copy: Option<ZeroCopyBuf>) -> Op {
    // convert arg to string
    let data_str = std::str::from_utf8(&data[..]).unwrap().to_string();

    let mut compressed = Vec::new();
    compress_vec(data, &mut compressed).unwrap();
    let result = compressed;
    let result_box = result.into_boxed_slice();

    Op::Sync(result_box)
}

// deno bindings for `decompress`
fn op_decompress(
    _interface: &mut dyn Interface,
    data: &[u8],
    zero_copy: Option<ZeroCopyBuf>,
) -> Op {
    // convert arg to string
    let data_str = std::str::from_utf8(&data[..]).unwrap().to_string();
    let mut decompressed = [0; 2048];
    let mut decompressed = &mut decompressed[..];
    decompress_buf(&data, &mut &mut decompressed).unwrap();
    //let result = std::str::from_utf8(&decompressed).unwrap();
    let b: Vec<u8> = decompressed.iter().cloned().collect();

    //let result_box:Buf = Box::new(b);
    let result_box = b.into_boxed_slice();

    Op::Sync(result_box)
}

// An example of compressing `input` into the destination vector
// `output`, expanding as necessary
fn compress_vec(mut input: &[u8], output: &mut Vec<u8>) -> Result<(), Error> {
    let mut compress = Compress::new();
    let nilbuf = &mut &mut [][..];
    loop {
        // Compressing to a buffer is easiest when the slice is already
        // available - since we need to grow, extend from compressor
        // internal buffer.
        let status = r#try!(compress.compress(CompressOp::Finish, &mut input, nilbuf));
        while let Some(buf) = compress.take_output(None) {
            output.extend_from_slice(buf)
        }
        match status {
            CoStatus::Finished => break,
            CoStatus::Unfinished => (),
        }
    }
    Ok(())
}
