#! /usr/bin/env node

var fileSystem = require('fs');
var optimist = require('optimist')
  .usage('Pretty-prints JSON.\n\nUsage: json [options] <file>')
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
    }
  });
var args = optimist.argv;

if (args.help || args._.length < 1) {
  optimist.showHelp();
  process.exit(1);
}

readFile(args._[0]);


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
