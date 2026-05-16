import fs from "fs";
import { pathToFileURL } from "url";

const src = fs.readFileSync("script.js", "utf8");

function tryParse(code) {
  try {
    new Function(code);
    return null;
  } catch (e) {
    return e;
  }
}

// Find lines where a lone * might be parsed as code (block comment ended early)
const lines = src.split("\n");
for (let i = 0; i < lines.length; i++) {
  const chunk = lines.slice(0, i + 1).join("\n") + "\n";
  const err = tryParse(chunk);
  if (err && String(err.message).includes("*")) {
    console.log("function() parse fails at line", i + 1, ":", err.message);
    console.log("line:", JSON.stringify(lines[i].slice(0, 120)));
    break;
  }
}
