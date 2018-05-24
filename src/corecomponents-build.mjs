import program from "commander";
import chalk from "chalk";
import figures from "figures";

import fs from "fs";
import filesize from "filesize";
import { resolve, relative } from "path";

import config from "./util/pkg.mjs";
import {build} from "./util/rollup.mjs";
import configBuilder from "./util/build-config.mjs";

program
  .description("Compile source code")
  .option("-i, --input <src> ", "", resolve(config.dirname, "src/index.mjs"))
  .option("-n, --name  <name>", "", config.pkg.name.replace(/@+\w*\//, ""))
  .option("-d, --dist  <dir> ", "", resolve(config.dirname, "dist"))
  .parse(process.argv);

const buildConfig = configBuilder({ 
  input: program.input,
  name: program.name,
  dist: program.dist,
  dependencies: Object.keys(config.pkg.dependencies || {})
});

const buildComplete = build => {
  const { input, output } = build;
  const { size } = fs.statSync(output);
  console.log(
    chalk.green(figures.tick),
    chalk.green(filesize(size)),
    figures.star,
    chalk.cyan(`${relative(config.dirname, input)} ${figures.arrowRight} ${relative(config.dirname, output)}`)
  );
};

Promise.all([
  build(buildConfig("es", false)),
  build(buildConfig("es", true)),
  build(buildConfig("iife", true))
])
  .then(builds => builds.map(build => buildComplete(build)))
  .catch(err => console.error(err));
