import fs from "fs-extra";
import { resolve } from "path";
import { exec, spawn } from "child_process";

import program from "commander";
import inquirer from "inquirer";

import git from "nodegit";

import chalk from "chalk";
import figures from "figures";

import config from "./util/pkg.mjs";

// const cmdexec = util.promisify(exec);

program
  .arguments("<project>")
  .option("-s, --boilerplate <url> ", "source of boilerplate", "https://github.com/odinr/CoreComponents-Boilerplate.git")
  .usage("[options] <project>")
  .action((project, cmd) => {
    if (project === undefined) {
      console.error(chalk.bold.red("no project name provided"));
      console.log(program.help());
      process.exit(1);
    }
    init(project, cmd.boilerplate);
  })
  .parse(process.argv);

async function checkTargetDir(path) {
  if (fs.existsSync(path)) {
    await inquirer
      .prompt({
        type: "confirm",
        name: "answer",
        default: true,
        message: `${chalk.blue(path)} exists, Continue?`,
        prefix: chalk.red(figures.cross)
      })
      .then(i => i.answer === true || process.exit(1));
    return false;
  }
  return true;
}

async function init(name, boilerplate) {
  const target = resolve(process.cwd(), name);
  console.log(`Initializing project ${chalk.blue(boilerplate)}`);
  if (await checkTargetDir(target)) {
    const repo = await git.Clone(boilerplate, target, { version: 1 });
    console.log(chalk.green(figures.tick), "cloned repo");
    await fs.remove(resolve(repo.workdir(), ".git"));
  }
  const project = await config(target);
  await npmInit(project);

  console.log(`\n${project.toString()}\n`);
}

async function gitInit(project) {
  // const elg = await git.Repository.open(project.dirname);

  // await elg.getStatus().then(e => {
  //   e.map(ff=> console.log(ff.path(), ff.status()));
  // });
}

function prompt(options){
  return inquirer.prompt({
    type: "input",
    name: "input",
    ...options
  }).then(({input}) => input);
}

async function createProjectName(project) {
  const validateName = input => !!input.match(/^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/);
  let name = await prompt({
    default: `${project.defaultPrefix}-${project.basename}`,
    message: `What is the component name?`,
    validate: val => validateName(val) || `Invalid package name ${val}`
  });
  if (name.match(/^(?:@[a-z0-9-~][a-z0-9-._~]*\/)/)) {
    return name;
  }
  const fixedName = `${project.defaultPrefix}-${name}`;
  return await prompt({
      type: "confirm",
      default: true,
      message: `The package ${chalk.red(name)} does not seem to have namespace, change to ${fixedName}?`
    }).then(answer => answer ? fixedName : name);
}

async function npmInit(project) {
  await updateNpmPackage(project);
  await project.npmInit();
  const modules = await project.npmInstall();
  modules.map(mod => console.log(chalk.green(figures.tick), chalk.cyan(mod[0])));
}

async function updateNpmPackage(project){
  let { author,keywords,license } = project.pkg;
  const pkg = {
    ...project.pkg,
    version: "1.0.0",
    name: await createProjectName(project),
    description: await prompt({message: `Project description....`}),
    author: await prompt({message: `Author`, default: author}),
    keywords: await prompt({message: `Keywords`, default: keywords}),
    license: await prompt({message: `License`, default: license}),
  }
  return await project.store(pkg);
}
