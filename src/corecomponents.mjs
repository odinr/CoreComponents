import program from "commander";
import chalk from "chalk";
import figlet from "figlet";
import findPkg from "read-pkg-up";

import { config } from "./util/pkg.mjs";
import { name, version, description } from "../package.json";

console.log(chalk.keyword('orange')(figlet.textSync(name)));
console.log(chalk.green(description));
console.log(chalk.red("veriosn: " + version));

console.log();
console.log(config.toString());
console.log();

program.command("build [s]", "search with optional query").parse(process.argv);
