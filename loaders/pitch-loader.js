module.exports = function (input) {
  return input + this.getOptions().text;
};
module.exports.pitch = function (remaining, preceding, input) {
  console.log(`Remaining: ${remaining}, preceding: ${preceding}
Input: ${JSON.stringify(input, null, 2)}
  `);

  return "pitched";
};
