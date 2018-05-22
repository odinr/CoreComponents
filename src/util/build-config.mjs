import { resolve } from "path";
import snake2camel from "./camelcase.mjs";

export function configBuilder({ name, input, dist, dependencies }) {
  return (format = "es", bundle = false) => {
    const external = bundle ? undefined : dependencies;
    const dir = resolve(dist, bundle ? "bundle" : "");
    const file = resolve(dir, `index.${format === "es" ? "mjs" : "js"}`);;
    resolve(
      dist,
      bundle ? "bundle" : "",
      `${name}.${format === "es" ? "mjs" : "js"}`
    );
    return {
      bundle,
      name,
      input: { input, external },
      output: { name: snake2camel(name), format, file }
    };
  };
}

export default configBuilder;
