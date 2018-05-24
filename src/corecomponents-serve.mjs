import program from "commander";
import chalk from "chalk";
import fs from "fs";
import filesize from "filesize";
import { resolve,relative } from "path";
import figures from "figures";

import serve from "rollup-plugin-serve";
import livereload from "livereload";
import express from "express";
import morgan from "morgan";

import { watch } from "./util/rollup.mjs";
import config from "./util/pkg.mjs";
import configBuilder from "./util/build-config.mjs";

program
  .description("Compile source code")
  .option("-n, --name  <name>", "", config.pkg.name.replace(/@+\w*\//, ""))
  .option("-d, --dist  <dir> ", "", resolve(config.dirname, "demo"))
  .option("-i, --input <src> ", "", resolve(config.dirname, "src/index.mjs"))
  .option("-w, --watch", "")
  .parse(process.argv);

const buildOptions = configBuilder({
  input: program.input,
  name: program.name,
  dist: program.dist,
  dependencies: Object.keys(config.pkg.dependencies || {}),
});

function doWatch(type) {
  const watcher = watch(buildOptions(type, true));

  watcher.on("event", e => {
    switch (e.code) {
      // case "BUNDLE_START":
      //   console.log(chalk.green(`Building: ${e.input}`));
      //   break;
      case "BUNDLE_END":
        const stats = fs.statSync(e.output[0]);
        console.log(
          chalk.green(figures.tick),
          `${e.duration}ms`,
          chalk.green(filesize(stats.size)),
          figures.star,
          chalk.cyan(`${relative(config.dirname, e.input)} ${figures.arrowRight} ${relative(config.dirname, e.output[0])}`)
        );
        break;

      case "ERROR":
      case "FATAL":
        console.log(chalk.red(e.error));
        break;
    }
  });
}

doWatch("es");
doWatch("iife");

const app = express();
app.use(morgan('dev'));
app.use(express.static(program.dist));
app.use(express.static(resolve(config.dirname, 'node_modules')));
app.listen(8080, () => console.log('DevServer started on ',chalk.blue('http://localhost:8080')));

var lrserver = livereload.createServer();
lrserver.watch(program.dist);
