// Skip execution in Node
if (module.hot) {
  const context = require.context(
    'mocha-loader!./', // Process through mocha-loader
    false, // Skip recursive processing
    /_test.js$/ // Pick only files ending with _test
  );

  // Execute each test suite
  context.keys().forEach(context);
}
