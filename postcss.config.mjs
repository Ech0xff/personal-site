import babelConfig from "./babel.config.js";

export default {
  plugins: {
    "@stylexjs/postcss-plugin": {
      // Both roots and shared components feed the same generated stylesheet.
      include: ["src/**/*.{ts,tsx}"],
      babelConfig: {
        babelrc: false,
        configFile: false,
        parserOpts: { plugins: ["typescript", "jsx"] },
        plugins: babelConfig.plugins,
      },
      useCSSLayers: true,
    },
  },
};
