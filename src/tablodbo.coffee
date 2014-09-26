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

registry = require( "npm-stats" )()
async = require "async"
request = require "request"
url = require "url"
semver = require "semver"

aPackagesInfo = null
oDependenciesVersionCache = {}

fCheckDependency = ( oDependency, fNext ) ->
    if sRefVersion = oDependenciesVersionCache[ oDependency.name ]
        fNext null, semver.satisfies sRefVersion, oDependency.version
    else
        registry
            .module oDependency.name
            .latest ( oError, oInfos ) ->
                return fNext oError if oError
                oDependenciesVersionCache[ oInfos.name ] = ( sRefVersion = oInfos.version )
                fNext null, semver.satisfies sRefVersion, oDependency.version

fCheckDependencies = ( oDependencies, fNext ) ->
    aDependencies = for sDependency, sVersion of oDependencies
        name: sDependency, version: sVersion

    bOK = yes

    async.map aDependencies, fCheckDependency, ( oError, aResults ) ->
        return fNext oError if oError
        bOK = yes
        bOK = bOK and bStatus for bStatus in aResults
        fNext null, bOK

fGetPackageInfos = ( sPackageName, fNext ) ->
    oPackage = {}

    registry
        .module sPackageName
        .latest ( oError, oInfos ) ->
            return fNext oError if oError
            oPackage =
                name: oInfos.name
                version: oInfos.version
                build: "unknown"
                dependencies: "unknown"
                devDependencies: "unknown"
                downloads: "unknown"
                stars: "unknown"
                dependents: "unknown"
            async.parallel [
                    # travis build status
                    ( fNext ) ->
                        return fNext() unless oInfos.repository?.type is "git" and oInfos.repository?.url?.match /github/i
                        sGithubRepo = url.parse( oInfos.repository.url ).path.replace( ".git", "" ).split( "/" ).filter( Boolean ).join( "/" )
                        request "https://api.travis-ci.org/repos/#{ sGithubRepo }/builds.json", ( oError, oResponse, sBody ) ->
                            return fNext oError if oError
                            if oResponse.statusCode is 200 and oBuild = JSON.parse( sBody )[ 0 ]
                                if oBuild.state is "finished"
                                    if oBuild.result is 0
                                        oPackage.build = "passing"
                                    else
                                        oPackage.build = "failing"
                                else
                                    oPackage.build = "pending"
                            fNext()
                    # dependencies status
                    ( fNext ) ->
                        unless oInfos.dependencies
                            oPackage.dependencies = "none"
                            return fNext()
                        fCheckDependencies oInfos.dependencies, ( oError, bOK ) ->
                            return fNext oError if oError
                            oPackage.dependencies = if bOK then "up to date" else "out of date"
                            fNext()
                    # dev dependencies status
                    ( fNext ) ->
                        unless oInfos.devDependencies
                            oPackage.devDependencies = "none"
                            return fNext()
                        fCheckDependencies oInfos.devDependencies, ( oError, bOK ) ->
                            return fNext oError if oError
                            oPackage.devDependencies = if bOK then "up to date" else "out of date"
                            fNext()
                    # downloads count for last month
                    ( fNext ) ->
                        request "https://api.npmjs.org/downloads/point/last-month/#{ sPackageName }", ( oError, oResponse, sBody ) ->
                            return fNext oError if oError
                            oPackage.downloads = JSON.parse( sBody ).downloads if oResponse.statusCode is 200
                            fNext()
                    # stars on npm
                    ( fNext ) ->
                        registry
                            .module sPackageName
                            .stars ( oError, aStargazers ) ->
                                return fNext oError if oError
                                oPackage.stars = aStargazers.length
                                fNext()
                    # package dependents
                    ( fNext ) ->
                        request "http://isaacs.iriscouch.com/registry/_design/app/_view/dependedUpon?startkey=[%22#{ sPackageName }%22]&endkey=[%22#{ sPackageName }%22,%7B%7D]&group_level=2", ( oError, oResponse, sBody ) ->
                            return fNext oError if oError
                            oPackage.dependents = JSON.parse( sBody ).rows.length if oResponse.statusCode is 200
                            fNext()
                ], ( oError ) ->
                    return fNext oError if oError
                    aPackagesInfo.push oPackage
                    fNext()

module.exports = ( sNPMUser, fNext = null ) ->
    # get packages list of sNPMUser
    registry
        .user sNPMUser
        .list ( oError, aPackages ) ->
            return fNext oError if oError
            aPackagesInfo = []
            return fNext null, [] unless aPackages.length
            async.each aPackages, fGetPackageInfos, ( oError ) ->
                return fNext oError if oError
                fNext null, aPackagesInfo
