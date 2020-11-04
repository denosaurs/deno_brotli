export async function requires(...executables: string[]) {
  const where = Deno.build.os === "windows" ? "where" : "which";

  for (const executable of executables) {
    const process = Deno.run({
      cmd: [where, executable],
      stderr: "null",
      stdin: "null",
      stdout: "null",
    });

    if (!(await process.status()).success) {
      console.log(`could not find required build tool ${executable}`);
      Deno.exit(1);
    }
  }
}

export async function run(msg: string, cmd: string[], output = false) {
  console.log(`${msg.padEnd(30, " ")} ("${cmd.join(" ")}")`);

  const process = Deno.run(
    {
      cmd,
      stdout: output ? "inherit" : "null",
      stderr: output ? "inherit" : "null",
      stdin: output ? "inherit" : "null",
    },
  );

  if (!(await process.status()).success) {
    console.log(`${msg} failed`);
    Deno.exit(1);
  }
}
