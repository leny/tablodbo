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
Table = require "cli-table"
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

fColorizeText = ( sText ) ->
    switch sText
        when "passing", "up to date" then chalk.green sText
        when "failing", "out of date" then chalk.red sText
        when "pending" then chalk.blue sText
        when "unknown" then chalk.gray sText
        else sText

fProcess = ( sUser ) ->
    spinner.start 50
    tablodbo sUser, ( oError, aInfos ) ->
        spinner.stop()
        error oError if oError
        error "User #{ sUser } has no packages on npm!" unless aInfos.length

        oTable = new Table
            head: [
                chalk.cyan( "name" )
                chalk.cyan( "version" )
                chalk.cyan( "build status" )
                chalk.cyan( "dependencies" )
                chalk.cyan( "dev dependencies" )
                chalk.cyan( "downloads" ) + "\n" + chalk.cyan( "(last month)" )
                chalk.cyan( "stars" )
                chalk.cyan( "dependents" )
            ]

        for oPackage in aInfos
            oTable.push [
                oPackage.name
                oPackage.version
                fColorizeText oPackage.build
                fColorizeText oPackage.dependencies
                fColorizeText oPackage.devDependencies
                fColorizeText oPackage.downloads
                fColorizeText oPackage.stars
                fColorizeText oPackage.dependents
            ]

        console.log "\n"
        console.log oTable.toString()

        process.exit 0

unless sNPMUser = program.args[ 0 ]
    exec "npm whoami", ( oError, sSTDOut ) ->
        error oError if oError
        sNPMUser = sSTDOut.trim()
        fProcess sNPMUser
else
    fProcess sNPMUser
