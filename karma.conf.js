const path = require('path');

module.exports = function(config) {
  const tests = 'tests/*_test.js';

  config.set({
    frameworks: ['mocha'],

    files: [
      {
        pattern: tests,
      },
    ],

    // Preprocess through webpack
    preprocessors: {
      [tests]: ['webpack'],
    },

    singleRun: true,

    browsers: ['PhantomJS'],

    webpack: require('./webpack.parts').loadJavaScript({
      include: path.join(__dirname, 'tests'),
    }),

    reporters: ['coverage'],

    coverageReporter: {
      dir: 'build',
      reporters: [
        {
          type: 'html',
          subdir: 'coverage',
        },
        {
          type: 'lcov',
          subdir: 'lcov',
        },
      ],
    },
  });
};