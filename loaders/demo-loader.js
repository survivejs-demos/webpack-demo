const loaderUtils = require('loader-utils');

module.exports = function(input) {
  const { text } = loaderUtils.getOptions(this);

  return input + text;
};
module.exports.pitch = function(
  remainingRequest, precedingRequest, input
) {
  console.log(
    'remaining request', remainingRequest,
    'preceding request', precedingRequest,
    'input', input
  );

  return 'pitched';
};
