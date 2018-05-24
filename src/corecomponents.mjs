import program from "commander";
import chalk from "chalk";
import figlet from "figlet";
import findPkg from "read-pkg-up";

import { config } from "./util/pkg.mjs";
import { name, version, description } from "../package.json";

console.log(chalk.keyword('orange')(figlet.textSync(name.replace(/^@?\w*\//i, ''))));
console.log(chalk.green(description));
console.log(chalk.red("veriosn: " + version));

console.log();
console.log(config.toString());
console.log();

program
.command("init [options]", "init")
.command("build [options]", "build")
.command("serve [options]", "serve")
.parse(process.argv);
