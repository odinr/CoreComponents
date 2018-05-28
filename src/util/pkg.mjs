import fs from "fs-extra";
import { dirname, basename, resolve, relative } from "path";
import chalk from "chalk";
import { basicTable } from "./table.mjs";
import findPkg from "read-pkg-up";
import npm from "npm";


class ProjectPackage {
  constructor({ pkg, path }) {
    this.pkg = pkg;
    this.path = path;
  }

  get dirname() {
    return dirname(this.path);
  }

  get basename(){
    return basename(this.dirname);
  }

  get defaultPrefix(){
    return "@coretrek/core-component";
  }

  async npmInit(){
    process.chdir(this.dirname);
    return await new Promise(resolve => npm.load(this.pkg, e => resolve(e))); 
  }

  async npmInstall(packages=[]) {
    return await new Promise((resolve, reject) => npm.commands.install(packages, (error, data) => (error ? reject(error) : resolve(data))));
  }

  relative(path) {
    return relative(this.dirname, path);
  }
  resolve(path) {
    return resolve(this.dirname, path);
  }

  toString(attr = ["version", "name", "description", "keywords"]) {
    const table = basicTable();
    attr.map(a => table.push({ [a]: this.pkg[a] }));
    table.push({ src: this.path });
    return table.toString();
  }
  async store(pkg){
    await fs.writeJson(this.path, {...this.pkg,...pkg});   
    return this.pkg = await fs.readJSON(this.path);
  }
}

export async function config(cwd) {
  const config = await findPkg({ cwd });
  return config.pkg ? new ProjectPackage(config) : undefined;
}

export default config;
