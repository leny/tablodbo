#!/usr/bin/env node
/*
 * tablodbò
 * https://github.com/leny/tablodbo
 *
 * JS/COFFEE Document - /cli.js - cli entry point, commander setup and runner
 *
 * Copyright (c) 2014 Leny
 * Licensed under the MIT license.
 */
"use strict";
var chalk, error, path, pkg, program, sNPMUser, spinner;

pkg = require("../package.json");

path = require("path");

chalk = require("chalk");

error = chalk.bold.red;

(spinner = require("simple-spinner")).change_sequence(["◓", "◑", "◒", "◐"]);

(program = require("commander")).version(pkg.version).usage("[options] <npm-user>").description("A CLI-dashboard for your npm packages").parse(process.argv);

if (!(sNPMUser = program.args[0])) {
  console.log(error("✘ No NPM username given!"));
  process.exit(1);
}

spinner.start(50);

require("./tablodbo.js")(sNPMUser, function(oError, aInfos) {
  spinner.stop();
  if (oError) {
    console.log(error("✘ " + oError + "."));
    process.exit(1);
  }
  console.log(aInfos);
  return process.exit(0);
});
