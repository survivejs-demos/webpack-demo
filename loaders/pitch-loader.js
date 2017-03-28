const loaderUtils = require('loader-utils');

module.exports = function(input) {
  const { text } = loaderUtils.getOptions(this);

  return input + text;
};
module.exports.pitch = function(remainingReq, precedingReq, input) {
  console.log(`
Remaining request: ${remainingReq}
Preceding request: ${precedingReq}
Input: ${JSON.stringify(input, null, 2)}
  `);

  return 'pitched';
};