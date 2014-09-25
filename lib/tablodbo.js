
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
module.exports = function(sNPMUser, fNext) {
  if (fNext == null) {
    fNext = null;
  }
  console.log("get infos for " + sNPMUser);
  return fNext(null, []);
};
