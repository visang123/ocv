try {
  await import("../scripts/script-1f5ab11.js");
  console.log("import ok");
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
