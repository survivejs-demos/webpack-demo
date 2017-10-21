const path = require("path");
const parts = require("./webpack.parts");

module.exports = config => {
  const tests = "tests/*.test.js";

  config.set({
    frameworks: ["mocha"],

    files: [
      {
        pattern: tests,
      },
    ],

    // Preprocess through webpack
    preprocessors: {
      [tests]: ["webpack"],
    },

    webpack: parts.loadJavaScript(),

    singleRun: true,

    browsers: ["PhantomJS"],
  });
};
