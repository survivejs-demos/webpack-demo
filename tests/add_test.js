const assert = require('assert');
const add = require('./add');

describe('Demo', function() {
  it('should add correctly', function() {
    assert.equal(add(1, 1), 2);
  });
});
