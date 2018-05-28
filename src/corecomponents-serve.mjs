import program from "commander";
import chalk from "chalk";
import fs from "fs-extra";
import filesize from "filesize";
import figures from "figures";

import livereload from "livereload";

import server from "./util/server.mjs";
import { watch } from "./util/rollup.mjs";
import config from "./util/pkg.mjs";
import configBuilder from "./util/build-config.mjs";

(async () => {
  const project = await config();
  const { dirname, pkg } = project;
  program
    .description("Compile source code")
    .option("-n, --name  <name>", "only apllies when watching", pkg.name.replace(/@+\w*\//, ""))
    .option("-d, --dist  <dir> ", "target html root, also target for watcher", project.resolve("demo"))
    .option("-i, --input <src> ", "only apllies when watching", project.resolve("src/index.mjs"))
    .option("-w, --watch", "Watch source code")
    .option("-r, --reload", "Reload content on new build")
    .parse(process.argv);

  console.log(program.watch ? figures.circleFilled : figures.circle, "Watch");
  console.log(program.reload ? figures.circleFilled : figures.circle, "LiveReload");

  server({ sources: [program.dist, project.resolve("node_modules")] });
  program.watch && doWatch(program, project);
  program.reload && doReload(program);
})();

function doReload({ dist }) {
  const socket = livereload.createServer().watch(dist);
  console.log(chalk.green(figures.tick), "LiveReload enabled",chalk.blue(program.input));
}

function doWatch(program, project) {
  const buildConfig = configBuilder({
    project,
    input: program.input,
    name: program.name,
    dist: program.dist,
    dependencies: Object.keys(project.pkg.dependencies || {})
  });
  ["es", "iife"].map(type => {
    const options = buildConfig(type, true);
    watch(options).on("event", onBuild(options));
  });
  console.log(chalk.green(figures.tick), "Watcher enabled",chalk.blue(program.input));
}


function onBuild(options) {
  const { project } = options;
  return event => {
    switch (event.code) {
      case "BUNDLE_END":
        const { duration, input } = event;
        event.output.map(output => {
          const { size } = fs.statSync(output);
          console.log(
            chalk.green(figures.tick),
            `${duration}ms`,
            chalk.green(filesize(size)),
            chalk.cyan(
              project.relative(input),
              figures.arrowRight,
              project.relative(output)
            )
          );
        });
        break;
      case "ERROR":
      case "FATAL":
        console.log(chalk.red(event.error));
        break;
    }
  };
}
