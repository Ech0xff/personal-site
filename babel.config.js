const path = require("node:path");
const { compilerOptions } = require("./tsconfig.json");
const stylexOptions = {
  aliases: Object.fromEntries(
    Object.entries(compilerOptions.paths).map(([alias, paths]) => [
      alias,
      paths.map((target) => path.resolve(process.cwd(), target)),
    ]),
  ),
  dev: process.env.NODE_ENV !== "production",
  runtimeInjection: false,
  treeshakeCompensation: true,
  unstable_moduleResolution: { type: "commonJS", rootDir: process.cwd() },
};

module.exports = {
  presets: ["next/babel"],
  plugins: [["@stylexjs/babel-plugin", stylexOptions]],
};
