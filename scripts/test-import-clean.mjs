try {
  await import("../scripts/script-clean.js");
  console.log("import ok");
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
