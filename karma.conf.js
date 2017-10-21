const path = require("path");
const parts = require("./webpack.parts");

module.exports = config => {
  const tests = "tests/*.test.js";

  process.env.BABEL_ENV = "karma";

  config.set({
    frameworks: ["mocha"],

    files: [
      {
        pattern: tests,
      },
    ],

    preprocessors: {
      [tests]: ["webpack"],
    },

    webpack: parts.loadJavaScript(),

    singleRun: true,

    browsers: ["PhantomJS"],
  });
};
