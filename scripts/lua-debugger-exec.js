const process = require("process");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const args = process.argv.slice(2);

// Start Lua Debugger

const luaDebugger = spawn(args[0], [], {
  stdio: ["pipe", "pipe", "inherit"],
});

console.log("Debugger process started")

let timeout;
luaDebugger.stdout.on("data", (data) => {
  const output = data.toString();
  for (const line of output.split("\n")) {
    if (line.startsWith("{")) {
      console.log(line);
    }
  }

  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(() => {
    luaDebugger.kill("SIGKILL");
    console.log("Debugger process completed");
  }, 1000);
});

luaDebugger.on("exit", () => {
  process.exit(0);
});

// Send Commands

let seq = 1;
function sendCommand(command) {
  const commandString = JSON.stringify({ ...command, seq });
  const contentLength = Buffer.byteLength(commandString, "utf8");

  const message = `Content-Length: ${contentLength}\n\n${commandString}`;

  luaDebugger.stdin.write(message);
  seq++;
}

for (let arg of args.slice(1)) {
  if (!arg.startsWith("{")) {
    if (!arg.endsWith("json")) {
      arg += ".json";
    }
    arg = fs.readFileSync(arg);
  }
  command = JSON.parse(arg);
  sendCommand(command);
}
