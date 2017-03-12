const loaderUtils = require('loader-utils');

module.exports = function(input) {
  const { text } = loaderUtils.getOptions(this);

  return input + text;
};
module.exports.pitch = function(
  remainingRequest, precedingRequest, input
) {
  console.log(`
Remaining request: ${remainingRequest}
Preceding request: ${precedingRequest}
Input: ${JSON.stringify(input, null, 2)}
  `);

  return 'pitched';
};