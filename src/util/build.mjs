import rollup from "rollup";
import resolve from "rollup-plugin-node-resolve";
import cjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import uglify from "rollup-plugin-uglify";

import presetsCommonJS from "./build-preset-cjs.mjs";
import presetsModern from "./build-preset-modern.mjs";

/**
 * https://rollupjs.org/guide/en#rollup-rollup
 * @param options
 */
export async function build({ input, output, bundle }) {
  const plugins = input.plugins || [];
  input.plugins = plugins.concat([
    cjs(),
    resolve({ jsnext: true, browser: true }),
    babel(output.format === "es" ? presetsModern : presetsCommonJS),
  ]);
  if(bundle) input.plugins.push(uglify());
  const bundler = await rollup.rollup(input);
  const out = await bundler.write(output);
  return {
    file: output.file
  };
}

export default build;


