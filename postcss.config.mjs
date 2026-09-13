import babelConfig from "./babel.config.js";

export default {
  plugins: {
    "@stylexjs/postcss-plugin": {
      // Match literal route-group parentheses rather than glob grouping.
      include: ["src/app/[(]site[)]/**/*.{ts,tsx}"],
      babelConfig: {
        babelrc: false,
        configFile: false,
        parserOpts: { plugins: ["typescript", "jsx"] },
        plugins: babelConfig.plugins,
      },
      useCSSLayers: true,
    },
    "@tailwindcss/postcss": {},
  },
};
