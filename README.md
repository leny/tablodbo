# tablodbò

[![NPM version](http://img.shields.io/npm/v/tablodbo.svg)](https://www.npmjs.org/package/tablodbo) ![Dependency Status](https://david-dm.org/leny/tablodbo.svg) ![Downloads counter](http://img.shields.io/npm/dm/tablodbo.svg)

> A CLI-dashboard for your npm packages

* * *

## How it works ?

For each npm package of the given user, **tablodbò** will outputs these informations : name, version, build status (on Travis), dependencies update status, dev dependencies update status, last month's downloads on npm, npm stars and dependents packages amount.

## Usage as node.js module

### Installation

To use **tablodbò** as a node.js module, install it first to your project.

    npm install --save tablodbo
    
### Usage

Using **tablodbò** is simple, after require it : 

    tablodbo = require( "tablodbo" );
    
    tablodbo( "leny", function( oError, aInfos ) {
        // do awesome things here.
    } );
    
### Signature

    tablodbo( sNPMUser [, fCallback ] ] )
    
#### Arguments

- `sNPMUser` is the name of the npm user from which get information 
- `fCallback` is the callback function, which returns two arguments : 
    - `oError`: if an error occurs during the process
    - `aInfos`: an array of repositories informations
    
## Usage as *command-line tool*

### Installation

To use **tablodbò** as a command-line tool, it is preferable to install it globally.

    (sudo) npm install -g tablodbo

### Usage

Using **tablodbò** is simple: 

    tablodbo [options] <npm-user>
    
    Options:

        -h, --help             output usage information
        -V, --version          output the version number
    
If no user is given, **tablodbò** will try to guess the current npm user logged on the system.

#### Options

##### help (`-h`,`--help`)

Output usage information.

##### version (`-v`,`--version`)

Output **tablodbò**' version number.

#### Sample

**tablodbò** outputs his results in a table, like this :  
![tablodbò sample results](https://raw.githubusercontent.com/leny/tablodbo/master/sample.png)

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Lint your code using [Grunt](http://gruntjs.com/).

## Release History

* **0.1.0**: Initial release (*26/09/14*)

### TODO
    
- [ ] add option to exclude information
- [x] use current local npm user if no one given

## License
Copyright (c) 2014 Leny  
Licensed under the MIT license.
