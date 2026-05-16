import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const incPath = path.join(rootDir, "_ovc_inc.mjs");

const lines = fs.readFileSync(path.join(rootDir, "script.js"), "utf8").split("\n");
const header = lines.slice(0, 430).join("\n");
let acc = header;

function targetTokenError(e, ch) {
  return e.message.includes("Unexpected token") && e.message.includes(ch);
}
const TOKEN = process.argv[2] || "*";

async function testThrough(endLine) {
  const code = lines.slice(0, endLine).join("\n") + "\n";
  fs.writeFileSync(incPath, code);
  try {
    await import(`${pathToFileURL(incPath).href}?x=${endLine}`);
    return null;
  } catch (e) {
    return e;
  }
}

let lo = 430;
let hi = lines.length;
let starLo = null;
while (lo + 1 < hi) {
  const mid = Math.floor((lo + hi) / 2);
  const err = await testThrough(mid);
  if (!err) {
    lo = mid;
  } else if (targetTokenError(err, TOKEN)) {
    hi = mid;
  } else {
    lo = mid;
  }
}

const err = await testThrough(hi);
if (err && targetTokenError(err, TOKEN)) {
  const i = hi - 1;
  console.log("token", TOKEN, "first at/before line", hi);
  console.log(lines[i]);
  if (i > 0) console.log("prev:", lines[i - 1]);
} else {
  console.log("last err at hi:", err?.message);
}
console.log("no star token error found in incremental scan");
