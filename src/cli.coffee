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

tablodbo = require "./tablodbo.js"
exec = require( "child_process" ).exec
chalk = require "chalk"
error = ( oError ) ->
    console.log chalk.bold.red "✘ #{ oError }."
    process.exit 1
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
    exec "npm whoami", ( oError, sSTDOut ) ->
        error oError if oError
        sNPMUser = sSTDOut.trim()
        fProcess sNPMUser
else
    fProcess sNPMUser

# --- get tablodbo informations

fProcess = ( sUser ) ->
    spinner.start 50
    tablodbo sUser, ( oError, aInfos ) ->
        spinner.stop()
        error oError if oError

        console.log aInfos

        process.exit 0

