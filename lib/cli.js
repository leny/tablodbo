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
var chalk, error, exec, fProcess, pkg, program, sNPMUser, spinner, tablodbo;

pkg = require("../package.json");

tablodbo = require("./tablodbo.js");

exec = require("child_process").exec;

chalk = require("chalk");

error = function(oError) {
  console.log(chalk.bold.red("✘ " + oError + "."));
  return process.exit(1);
};

(spinner = require("simple-spinner")).change_sequence(["◓", "◑", "◒", "◐"]);

(program = require("commander")).version(pkg.version).usage("[options] <npm-user>").description("A CLI-dashboard for your npm packages").parse(process.argv);

if (!(sNPMUser = program.args[0])) {
  exec("npm whoami", function(oError, sSTDOut) {
    if (oError) {
      error(oError);
    }
    sNPMUser = sSTDOut.trim();
    return fProcess(sNPMUser);
  });
} else {
  fProcess(sNPMUser);
}

fProcess = function(sUser) {
  spinner.start(50);
  return tablodbo(sUser, function(oError, aInfos) {
    spinner.stop();
    if (oError) {
      error(oError);
    }
    console.log(aInfos);
    return process.exit(0);
  });
};
