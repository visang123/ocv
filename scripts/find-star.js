const fs = require("fs");
const { pathToFileURL } = require("url");

async function testSlice(endLine) {
  const lines = fs.readFileSync("script.js", "utf8").split("\n");
  const content = lines.slice(0, endLine).join("\n") + "\n";
  const path = require("path").join(__dirname, "_slice.js");
  fs.writeFileSync(path, content);
  try {
    await import(pathToFileURL(path).href);
    return true;
  } catch (e) {
    return false;
  } finally {
    try {
      fs.unlinkSync(path);
    } catch (_) {}
  }
}

(async () => {
  let lo = 1;
  let hi = fs.readFileSync("script.js", "utf8").split("\n").length;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (await testSlice(mid)) lo = mid + 1;
    else hi = mid;
  }
  const lines = fs.readFileSync("script.js", "utf8").split("\n");
  console.log("first fail line", lo);
  console.log("content:", JSON.stringify(lines[lo - 1]?.slice(0, 100)));
})();
