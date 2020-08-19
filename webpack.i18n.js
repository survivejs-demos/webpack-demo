const path = require("path");
const I18nPlugin = require("embed-i18n-webpack-plugin");

const TRANSLATIONS = {
  fi: {
    greeting: {
      hello: "Terve maailma",
    },
  },
  en: {
    greeting: {
      hello: "Hello world",
    },
  },
};

module.exports = Object.entries(TRANSLATIONS).map(
  ([language, translation]) => ({
    mode: "production",
    entry: {
      index: path.join(__dirname, "src", "i18n.js"),
    },
    output: {
      path: path.join(__dirname, "i18n-build"),
      filename: `[name].${language}.js`,
    },
    plugins: [new I18nPlugin(translation)],
  })
);
