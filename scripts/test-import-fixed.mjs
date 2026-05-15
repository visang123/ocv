try {
  await import("../script-fixed.js");
  console.log("import ok");
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
