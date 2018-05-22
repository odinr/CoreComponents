import preset from "@babel/preset-env";
import runtime from "babel-plugin-transform-runtime";
import helpers from "babel-plugin-external-helpers";
export const presetsCommonJS = {
  runtimeHelpers: true,
  plugins: [
    helpers
  ],
  presets: [
    [
      preset,
      {
        modules: false,
        targets: {
          browsers: ["last 2 versions"]
        }
      }
    ]
  ],
  ignore: ["node_modules/**"]
};

export default presetsCommonJS;
