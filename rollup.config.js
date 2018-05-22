import pkg from "./package.json";
import babel from "rollup-plugin-babel";
import cjs from "rollup-plugin-commonjs";
import nsr from "rollup-plugin-node-resolve";
import json from "rollup-plugin-json";
import { readdirSync } from "fs";
import { resolve } from "path";

const src = resolve("./src");
const dist = resolve("./bin");
const external = Object.keys(pkg.dependencies || {});
const files = readdirSync(src).filter(file => file.match(/.js$/));
export default files.map(file => {
  return {
    input: resolve(src, file),
    output: {
      file: resolve(dist, file.replace(/mjs$/, "js")),
      format: "cjs",
      banner: "#!/usr/bin/env node",
      interop: false
    },
    plugins: [cjs(),json(),nsr(),babel({ runtimeHelpers: true })],
    external
  };
});
