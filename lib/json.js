#! /usr/bin/env node

var fileSystem = require('fs');
var streamReader = require('./streamReader.js');
var optimist = require('optimist')
  .usage('Pretty-prints JSON.\n\nUsage: json [options] [file ...]')
  .options({
    'h': {
      alias: 'help',
      describe: 'Prints this help/usage message.',
      boolean: true
    },
    'i': {
      alias: 'indent',
      describe: 'Sets how many spaces to indent.',
      default: 2
    },
    'v': {
      alias: 'version',
      describe: 'Displays the version of this tool.',
      boolean: true
    }
  });
var args = optimist.argv;

if (args.version) {
  var packageData = require('../package.json');
  console.log(packageData.name + ' version ' + packageData.version);
  process.exit(0);
}

if (args.help) {
  optimist.showHelp();
  process.exit(1);
}

if (args._.length < 1) {
  readStdin();
} else {
  for (var index = 0; index < args._.length; index++) {
    readFile(args._[index]);
  }
}


function readStdin() {
  streamReader.readStream(process.stdin, function (error, data) {
    if (error) {
      printErrorAndExit('Could not read from standard input.', error);
    }
    reformat(data);
  });
}

function readFile(filename) {
  try {
    reformat(fileSystem.readFileSync(filename, {encoding: 'utf8'}));
  }
  catch (error) {
    printErrorAndExit('Error reading file: ' + filename, error);
  }
}

function reformat(data) {
	console.log(JSON.stringify(tryParseJson(data), null, args.indent));
}

function tryParseJson(data) {
  try {
    return JSON.parse(data);
  }
  catch (error) {
    printErrorAndExit('Could not parse JSON.', error);
  }
}

function printErrorAndExit(message, error) {
  console.error('Error:', message);
  console.error(error.message);
  process.exit(1);
}
