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
var Table, chalk, error, exec, fColorizeText, fProcess, pkg, program, sNPMUser, spinner, tablodbo;

pkg = require("../package.json");

tablodbo = require("./tablodbo.js");

exec = require("child_process").exec;

Table = require("cli-table");

chalk = require("chalk");

error = function(oError) {
  console.log(chalk.bold.red("✘ " + oError + "."));
  return process.exit(1);
};

(spinner = require("simple-spinner")).change_sequence(["◓", "◑", "◒", "◐"]);

(program = require("commander")).version(pkg.version).usage("[options] <npm-user>").description("A CLI-dashboard for your npm packages").parse(process.argv);

fColorizeText = function(sText) {
  switch (sText) {
    case "passing":
    case "up to date":
      return chalk.green(sText);
    case "failing":
    case "out of date":
      return chalk.red(sText);
    case "pending":
      return chalk.blue(sText);
    case "unknown":
      return chalk.gray(sText);
    default:
      return sText;
  }
};

fProcess = function(sUser) {
  spinner.start(50);
  return tablodbo(sUser, function(oError, aInfos) {
    var oPackage, oTable, _i, _len;
    spinner.stop();
    if (oError) {
      error(oError);
    }
    if (!aInfos.length) {
      error("User " + sUser + " has no packages on npm!");
    }
    oTable = new Table({
      head: [chalk.cyan("name"), chalk.cyan("version"), chalk.cyan("build status"), chalk.cyan("dependencies"), chalk.cyan("dev dependencies"), chalk.cyan("downloads") + "\n" + chalk.cyan("(last month)"), chalk.cyan("stars"), chalk.cyan("dependents")]
    });
    for (_i = 0, _len = aInfos.length; _i < _len; _i++) {
      oPackage = aInfos[_i];
      oTable.push([oPackage.name, oPackage.version, fColorizeText(oPackage.build), fColorizeText(oPackage.dependencies), fColorizeText(oPackage.devDependencies), fColorizeText(oPackage.downloads), fColorizeText(oPackage.stars), fColorizeText(oPackage.dependents)]);
    }
    console.log("\n");
    console.log(oTable.toString());
    return process.exit(0);
  });
};

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
