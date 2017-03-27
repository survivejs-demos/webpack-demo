const loaderUtils = require('loader-utils');

module.exports = function(content) {
  const { name } = loaderUtils.getOptions(this);
  const url = loaderUtils.interpolateName(
    this, name, { content }
  );

  this.emitFile(url, content);

  const filePath = `__webpack_public_path__+${JSON.stringify(url)};`;

  return `export default ${filePath}`;
};