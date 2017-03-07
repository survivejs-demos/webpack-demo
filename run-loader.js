const fs = require('fs');
const path = require('path');
const { runLoaders } = require('loader-runner');

runLoaders({
  resource: './demo.txt',
  loaders: [
    {
      loader: path.resolve(__dirname, './loaders/demo-loader'),
      options: {
        text: 'demo',
      },
    },
  ],
  readResource: fs.readFile.bind(fs),
},
function(err, result) {
  if(err) {
    return console.error(err);
  }

  console.log(result);
});
