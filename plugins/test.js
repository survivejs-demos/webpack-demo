const webpack = require("webpack");
const { createFsFromVolume, Volume } = require("memfs");
const DemoPlugin = require("./demo-plugin");

// The compiler helper accepts filenames should be in the output
// so it's possible to assert the output easily.
function compile(config, filenames = []) {
  return new Promise((resolve, reject) => {
    const compiler = webpack(config);

    compiler.outputFileSystem = createFsFromVolume(new Volume());
    const memfs = compiler.outputFileSystem;

    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }

      // Now only errors are captured from stats.
      // It's possible to capture more to assert.
      if (stats.hasErrors()) {
        return reject(stats.toString("errors-only"));
      }

      const ret = {};

      filenames.forEach((filename) => {
        // The assumption is that webpack outputs behind ./dist.
        ret[filename] = memfs.readFileSync(`./dist/${filename}`, {
          encoding: "utf-8",
        });
      });

      return resolve(ret);
    });
  });
}

async function test() {
  const result = await compile(
    {
      entry: "./test-entry.js",
      plugins: [new DemoPlugin({ name: "demo" })],
    },
    ["demo"]
  );

  console.log(result);
}

test();
