const loaderUtils = require('loader-utils');

module.exports = (input) => {
  const { text } = loaderUtils.getOptions(this);

  return input + text;
};
module.exports.pitch = (
  remainingRequest, precedingRequest, input
) => {
  console.log(
    'remaining request', remainingRequest,
    'preceding request', precedingRequest,
    'input', input
  );

  return 'pitched';
};
