import { dirname } from "path";
import { resolve, relative } from "path";
import chalk from "chalk";
import { basicTable } from "./table.mjs";
import findPkg from "read-pkg-up";

class ProjectPackage {
  constructor({ pkg, path }) {
    this.pkg = pkg;
    this.path = path;
  }

  get dirname() {
    return dirname(this.path);
  }

  relative(path) {
    return relative(this.dirname, path);
  }
  resolve(path) {
    return resolve(this.dirname, path);
  }

  toString(attr = ["version", "name", "description"]) {
    const table = basicTable();
    attr.map(a => table.push({ [a]: this.pkg[a] }));
    table.push({ src: this.path });
    return table.toString();
  }
}

export async function config(cwd) {
  const config = await findPkg({ cwd });
  return config.pkg ? new ProjectPackage(config) : undefined;
}

export default config;
