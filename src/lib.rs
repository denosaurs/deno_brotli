// lib.rs

use brotli2::read::{BrotliDecoder, BrotliEncoder};
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
}

// TODO(divy-work): do the actual compressing
// deno bindings for `compress`
fn op_compress(_interface: &mut dyn Interface, data: &[u8], zero_copy: Option<ZeroCopyBuf>) -> Op {
    // convert arg to string
    let data_str = std::str::from_utf8(&data[..]).unwrap().to_string();

    // in case, we need a optional functionality in future
    let fut = async move {
        if let Some(buf) = zero_copy {
            let _buf_str = std::str::from_utf8(&buf[..]).unwrap();
            println!("data: {}", data_str);
        }
        let (tx, rx) = futures::channel::oneshot::channel::<Result<(), ()>>();
        std::thread::spawn(move || {
            std::thread::sleep(std::time::Duration::from_secs(1));
            tx.send(Ok(())).unwrap();
        });
        assert!(rx.await.is_ok());
        let compressor = BrotliEncoder::new(data_str.as_bytes(), 9);
        let mut decompressor = BrotliDecoder::new(compressor);

        let mut contents = String::new();
        decompressor.read_to_string(&mut contents).unwrap();
        assert_eq!(contents, "bruh");
        // return true
        let result_box: Buf = Box::new(*result);
        result_box
    };

    Op::Async(fut.boxed())
}
