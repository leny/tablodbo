
/*
 * tablodbò
 * https://github.com/leny/tablodbo
 *
 * JS/COFFEE Document - /tablodbo.js - module entry point
 *
 * Copyright (c) 2014 Leny
 * Licensed under the MIT license.
 */
"use strict";
var aPackagesInfo, async, fCheckDependencies, fCheckDependency, fGetPackageInfos, oDependenciesVersionCache, registry, request, semver, url;

registry = require("npm-stats")();

async = require("async");

request = require("request");

url = require("url");

semver = require("semver");

aPackagesInfo = null;

oDependenciesVersionCache = {};

fCheckDependency = function(oDependency, fNext) {
  var sRefVersion;
  if (sRefVersion = oDependenciesVersionCache[oDependency.name]) {
    return fNext(null, semver.satisfies(sRefVersion, oDependency.version));
  } else {
    return registry.module(oDependency.name).latest(function(oError, oInfos) {
      if (oError) {
        return fNext(oError);
      }
      oDependenciesVersionCache[oInfos.name] = (sRefVersion = oInfos.version);
      return fNext(null, semver.satisfies(sRefVersion, oDependency.version));
    });
  }
};

fCheckDependencies = function(oDependencies, fNext) {
  var aDependencies, bOK, sDependency, sVersion;
  aDependencies = (function() {
    var _results;
    _results = [];
    for (sDependency in oDependencies) {
      sVersion = oDependencies[sDependency];
      _results.push({
        name: sDependency,
        version: sVersion
      });
    }
    return _results;
  })();
  bOK = true;
  return async.map(aDependencies, fCheckDependency, function(oError, aResults) {
    var bStatus, _i, _len;
    if (oError) {
      return fNext(oError);
    }
    bOK = true;
    for (_i = 0, _len = aResults.length; _i < _len; _i++) {
      bStatus = aResults[_i];
      bOK = bOK && bStatus;
    }
    return fNext(null, bOK);
  });
};

fGetPackageInfos = function(sPackageName, fNext) {
  var oPackage;
  oPackage = {};
  return registry.module(sPackageName).latest(function(oError, oInfos) {
    if (oError) {
      return fNext(oError);
    }
    oPackage = {
      name: oInfos.name,
      version: oInfos.version,
      build: "unknown",
      dependencies: "unknown",
      devDependencies: "unknown",
      downloads: "unknown",
      stars: "unknown",
      dependents: "unknown"
    };
    return async.parallel([
      function(fNext) {
        var sGithubRepo, _ref, _ref1, _ref2;
        if (!(((_ref = oInfos.repository) != null ? _ref.type : void 0) === "git" && ((_ref1 = oInfos.repository) != null ? (_ref2 = _ref1.url) != null ? _ref2.match(/github/i) : void 0 : void 0))) {
          return fNext();
        }
        sGithubRepo = url.parse(oInfos.repository.url).path.replace(".git", "").split("/").filter(Boolean).join("/");
        return request("https://api.travis-ci.org/repos/" + sGithubRepo + "/builds.json", function(oError, oResponse, sBody) {
          var oBuild;
          if (oError) {
            return fNext(oError);
          }
          if (oResponse.statusCode === 200 && (oBuild = JSON.parse(sBody)[0])) {
            if (oBuild.state === "finished") {
              if (oBuild.result === 0) {
                oPackage.build = "passing";
              } else {
                oPackage.build = "failing";
              }
            } else {
              oPackage.build = "pending";
            }
          }
          return fNext();
        });
      }, function(fNext) {
        if (!oInfos.dependencies) {
          oPackage.dependencies = "none";
          return fNext();
        }
        return fCheckDependencies(oInfos.dependencies, function(oError, bOK) {
          if (oError) {
            return fNext(oError);
          }
          oPackage.dependencies = bOK ? "up to date" : "out of date";
          return fNext();
        });
      }, function(fNext) {
        if (!oInfos.devDependencies) {
          oPackage.devDependencies = "none";
          return fNext();
        }
        return fCheckDependencies(oInfos.devDependencies, function(oError, bOK) {
          if (oError) {
            return fNext(oError);
          }
          oPackage.devDependencies = bOK ? "up to date" : "out of date";
          return fNext();
        });
      }, function(fNext) {
        return request("https://api.npmjs.org/downloads/point/last-month/" + sPackageName, function(oError, oResponse, sBody) {
          if (oError) {
            return fNext(oError);
          }
          if (oResponse.statusCode === 200) {
            oPackage.downloads = JSON.parse(sBody).downloads;
          }
          return fNext();
        });
      }, function(fNext) {
        return registry.module(sPackageName).stars(function(oError, aStargazers) {
          if (oError) {
            return fNext(oError);
          }
          oPackage.stars = aStargazers.length;
          return fNext();
        });
      }, function(fNext) {
        return request("http://isaacs.iriscouch.com/registry/_design/app/_view/dependedUpon?startkey=[%22" + sPackageName + "%22]&endkey=[%22" + sPackageName + "%22,%7B%7D]&group_level=2", function(oError, oResponse, sBody) {
          if (oError) {
            return fNext(oError);
          }
          if (oResponse.statusCode === 200) {
            oPackage.dependents = JSON.parse(sBody).rows.length;
          }
          return fNext();
        });
      }
    ], function(oError) {
      if (oError) {
        return fNext(oError);
      }
      aPackagesInfo.push(oPackage);
      return fNext();
    });
  });
};

module.exports = function(sNPMUser, fNext) {
  if (fNext == null) {
    fNext = null;
  }
  return registry.user(sNPMUser).list(function(oError, aPackages) {
    if (oError) {
      return fNext(oError);
    }
    aPackagesInfo = [];
    if (!aPackages.length) {
      return fNext(null, []);
    }
    return async.each(aPackages, fGetPackageInfos, function(oError) {
      if (oError) {
        return fNext(oError);
      }
      return fNext(null, aPackagesInfo);
    });
  });
};
