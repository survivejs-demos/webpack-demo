const loaderUtils = require("loader-utils");

module.exports = function (content) {
  const { name } = loaderUtils.getOptions(this);
  const url = loaderUtils.interpolateName(this, name, { content });

  this.emitFile(url, content);

  const path = `__webpack_public_path__ + ${JSON.stringify(url)};`;

  return `export default ${path}`;
};
