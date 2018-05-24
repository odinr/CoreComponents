import fs from "fs";
import { resolve } from "path";
import program from "commander";
import inquirer from "inquirer";

import git from "nodegit";
import chalk from "chalk";
import figures from "figures";

const repo = "https://github.com/odinr/CoreComponents-Boilerplate.git";
program
  .arguments("<project>")
  .usage("[options] <project>")
  .action(project => {
    if (project === undefined) {
      console.error(chalk.bold.red("no project name provided"));
      console.log(program.help());
      process.exit(1);
    }
    init(project);
  })
  .parse(process.argv);

async function checkTargetDir(path) {
  if (fs.existsSync(path)) {
    await inquirer.prompt({
      type: "confirm",
      name: "answer",
      default: false,
      message: `${chalk.blue(path)} exists, Continue?`,
      prefix: chalk.red(figures.cross)
    }).then(i => i.answer === true || process.exit(1));
  }
}

async function init(name) {
  const target = resolve(process.cwd(), name);
  console.log('\n',chalk.green(figures.smiley),`Initializing project ${chalk.blue(repo)}`);
  await checkTargetDir(target);
  console.log("ok");
  git.Clone(repo, target).then(e => {
    console.log(e.getMasterCommit());
  });
}
