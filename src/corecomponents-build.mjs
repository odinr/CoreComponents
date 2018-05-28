import program from "commander";
import chalk from "chalk";
import figures from "figures";

import fs from "fs-extra";
import filesize from "filesize";
import { resolve, relative } from "path";

import config from "./util/pkg.mjs";
import { build } from "./util/rollup.mjs";
import configBuilder from "./util/build-config.mjs";

(async function start() {
  const project = await config();
  const { dirname, pkg } = project;

  program
    .description("Compile source code")
    .option("-i, --input <src> ", "", resolve(dirname, "src/index.mjs"))
    .option("-n, --name  <name>", "", pkg.name.replace(/@+\w*\//, ""))
    .option("-d, --dist  <dir> ", "", resolve(dirname, "dist"))
    .parse(process.argv);

  const buildConfig = configBuilder({
    input: program.input,
    name: program.name,
    dist: program.dist,
    dependencies: Object.keys(pkg.dependencies || {})
  });

  try {
    const builds = await Promise.all([
      build(buildConfig("es", false)),
      build(buildConfig("es", true)),
      build(buildConfig("iife", true))
    ]);
    builds.map(({ input, output }) => {
      console.log(
        chalk.green(figures.tick),
        chalk.cyan(
          relative(dirname, input),
          figures.arrowRight,
          relative(dirname, output)
        ),
        filesize(fs.statSync(output).size),
      );
    });
  } catch (error) {
    console.error(error);
  }
})();
