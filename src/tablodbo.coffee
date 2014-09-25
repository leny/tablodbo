###
 * tablodbò
 * https://github.com/leny/tablodbo
 *
 * JS/COFFEE Document - /tablodbo.js - module entry point
 *
 * Copyright (c) 2014 Leny
 * Licensed under the MIT license.
###

"use strict"

module.exports = ( sNPMUser, fNext = null ) ->

    # get packages list of sNPMUser

    # for each package, load :
        # version
        # build status from travis
        # dependencies status
        # dev dependencies status
        # downloads count
        # npm stars
        # dependents

    fNext null, []
