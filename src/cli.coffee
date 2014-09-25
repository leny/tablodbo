###
 * tablodbò
 * https://github.com/leny/tablodbo
 *
 * JS/COFFEE Document - /cli.js - cli entry point, commander setup and runner
 *
 * Copyright (c) 2014 Leny
 * Licensed under the MIT license.
###

"use strict"

pkg = require "../package.json"

path = require "path"
chalk = require "chalk"
error = chalk.bold.red
( spinner = require "simple-spinner" )
    .change_sequence [
        "◓"
        "◑"
        "◒"
        "◐"
    ]

( program = require "commander" )
    .version pkg.version
    .usage "[options] <npm-user>"
    .description "A CLI-dashboard for your npm packages"
    .parse process.argv

# --- get npm user

unless sNPMUser = program.args[ 0 ]
    console.log error "✘ No NPM username given!"
    process.exit 1

# --- get tablodbo informations

spinner.start 50
require( "./tablodbo.js" ) sNPMUser, ( oError, aInfos ) ->
    spinner.stop()
    if oError
        console.log error "✘ #{ oError }."
        process.exit 1

    console.log aInfos

    process.exit 0

