import preset from "babel-preset-modern-browsers";
import runtime from "babel-plugin-transform-runtime";
import helpers from "babel-plugin-external-helpers";
export const presetsModern = {
  externalHelpers: true,
  runtimeHelpers: true,
  plugins: [
    runtime,
    helpers
  ],
  presets: [
    [
      preset,
      {
        modules: false,
        loose: true
      }
    ]
  ],
  ignore: ["node_modules/**"]
};
export default presetsModern;
