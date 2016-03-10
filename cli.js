#!/usr/bin/env node
var meow = require("meow");
var bemoScaffold = require("./index");
var fs = require("fs");

var parseOptions = {
  string: ['stylesheets-dir', 'extension'],
  alias: {
    'stylesheets-dir': ['s', 'stylesheetsDir'],
    'extension': ['e']
  },
};

var description = [
  "Usage",
  "  $ bemo-scaffold -s <STYLESHEETS_DIR> -e <EXTENSION>",
  "",
  "Options",
  "  -s, --stylesheets-dir  Directory where BEMO will be installed",
  "  -e, --extension        Extension to use for SASS files (default: `sass`)",
];

var cli = meow(description.join("\n"), parseOptions);
var args = cli.flags;
var stylesheetsDir = args.stylesheetsDir;

if (!stylesheetsDir) {
  console.log("Missing --stylesheets argument!");
  process.exit(1);
}

try {
  var stat = fs.statSync(stylesheetsDir);
  if (!stat.isDirectory()) {
    console.log(stylesheetsDir + " is not a directory!");
    process.exit(1);
  }
} catch(e) {
  console.log(stylesheetsDir + " does not exist!");
  process.exit(1);
}

bemoScaffold.generate(args, function(err) {
  if (err) {
    console.log(err.message);
    process.exit(1);
  } else {
    console.log("Hurray! Everything is ready!");
  }
});
