var assert = require('assert');
var exec = require('child_process').exec;
var packageData = require('../package.json');


describe('json command', function () {
  it('will format a file using default options', function (done) {
    var options = {
      args: ' test/single-line.json'
    };
    doTest(options, function (stdout, stderr) {
      assert.equal(stdout, '{\n  "test": "single-line",\n  "a": 1\n}\n');
      assert.equal(stderr, '');
      done();
    });
  });
  
  it('will read from standard input when no file is provided', function (done) {
    var options = {
      prefix: 'cat test/single-line.json | '
    };
    doTest(options, function (stdout, stderr) {
      assert.equal(stdout, '{\n  "test": "single-line",\n  "a": 1\n}\n');
      assert.equal(stderr, '');
      done();
    });
  });
  
  it('can read multiple files', function (done) {
    var options = {
      args: ' test/single-line.json test/multi-line.json'
    };
    doTest(options, function (stdout, stderr) {
      assert.equal(stdout, '{\n  "test": "single-line",\n  "a": 1\n}\n' +
                           '{\n  "test": "multi-line",\n  "a": 1\n}\n');
      assert.equal(stderr, '');
      done();
    });
  });
  
  it('will display the help when the -h option is used', function (done) {
    var options = {
      args: ' -h'
    };
    doTest(options, function (stdout, stderr) {
      assert.equal(stdout, '');
      validateHelpMessage(stderr);
      done();
    });
  });
  
  it('aliases -h with --help',  function (done) {
    var options = {
      args: ' --help test/single-line.json'
    };
    doTest(options, function (stdout, stderr) {
      assert.equal(stdout, '');
      validateHelpMessage(stderr);
      done();
    });
  });
  
  it('will honor the -i option', function (done) {
    var options = {
      args: ' -i 0 test/multi-line.json'
    };
    doTest(options, function (stdout, stderr) {
      assert.equal(stdout, '{"test":"multi-line","a":1}\n');
      assert.equal(stderr, '');
      done();
    });
  });
  
  it('aliases -i with --indent', function (done) {
    var options = {
      args: ' --indent 4 test/multi-line.json'
    };
    doTest(options, function (stdout, stderr) {
      assert.equal(stdout, '{\n    "test": "multi-line",\n    "a": 1\n}\n');
      assert.equal(stderr, '');
      done();
    });
  });
  
  it('outputs the version if the -v option is provided', function (done) {
    var options = {
      args: ' -v'
    };
    doTest(options, function (stdout, stderr) {
      assert.equal(stdout, packageData.name + ' version ' + packageData.version + '\n');
      assert.equal(stderr, '');
      done();
    });
  });
  
  it('aliases -v with --version', function (done) {
    var options = {
      args: ' --version'
    };
    doTest(options, function (stdout, stderr) {
      assert.equal(stdout, packageData.name + ' version ' + packageData.version + '\n');
      assert.equal(stderr, '');
      done();
    });
  });
  
  it('fails with an error if there is a JSON parse error', function (done) {
    var options = {
      args: ' test/not-json.txt'
    };
    doTest(options, function (stdout, stderr) {
      assert.equal(stdout, '');
      assert.equal(stderr, 'Error: Could not parse JSON.\nUnexpected token T\n');
      done();
    });
  });
});


function doTest(options, callback) {
  var command = (options.prefix || '') + 'node lib/json.js' + (options.args || '');
  exec(command, {timeout: 1000}, function (error, stdout, stderr) {
    callback(stdout, stderr);
  });
}

function validateHelpMessage(output) {
  var expected = [
    /Pretty-prints JSON\.\n\nUsage: json \[options\] \[file\ \.\.\.]\n\nOptions:\n/,
    /-h,\s+--help\s+Prints this help\/usage message\./,
    /-i,\s+--indent\s+Sets how many spaces to indent\.\s+\[default: 2\]/,
    /-v,\s+--version\s+Displays the version of this tool\./
  ];
  for (var index = 0; index < expected.length; index++) {
  	var pattern = expected[index];
    assert(pattern.test(output), 'Did not match ' + pattern);
  }
}
