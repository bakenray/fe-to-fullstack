(async function () {
  const { ziyue } = await import("./ziyue.mjs");
  const argv = process.argv;
  console.log(ziyue(argv[2] || "巧言令色，鮮矣仁！"));
})();
