var streamReader = require('../lib/streamReader.js');
var fileSystem = require('fs');
var assert = require('assert');

describe('streamReader', function () {
  describe('readStream', function () {
    it('reads from a stream and returns the data', function (done) {
      var stream = fileSystem.createReadStream('test/single-line.json');
      streamReader.readStream(stream, function (error, data) {
        assert.strictEqual(null, error);
        assert.equal(data, '{"test":"single-line","a":1}\n');
        done();
      });
    });
  })
});
