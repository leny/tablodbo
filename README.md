# tablodbò

[![NPM version](http://img.shields.io/npm/v/tablodo.svg)](https://www.npmjs.org/package/tablodo) ![Dependency Status](https://david-dm.org/leny/tablodo.svg) ![Downloads counter](http://img.shields.io/npm/dm/tablodo.svg)

> A CLI-dashboard for your npm packages

* * *

## How it works ?

_TODO_

## Usage as node.js module

### Installation

To use **tablodo** as a node.js module, install it first to your project.

    npm install --save tablodo
    
### Usage

Using **tablodo** is simple, after require it : 

    tablodo = require( "tablodo" );
    
    tablodo( "leny", function( oError, aInfos ) {
        // do awesome things here.
    } );
    
### Signature

    tablodo( sNPMUser [, fCallback ] ] )
    
#### Arguments

- `sNPMUser` is the name of the npm user from which get information 
- `fCallback` is the callback function, which returns two arguments : 
    - `oError`: if an error occurs during the process
    - `aInfos`: an array of repositories informations
    
## Usage as *command-line tool*

### Installation

To use **tablodo** as a command-line tool, it is preferable to install it globally.

    (sudo) npm install -g tablodo

### Usage

Using **tablodo** is simple: 

    tablodo [options] <npm-user>
    
    Options:

        -h, --help             output usage information
        -V, --version          output the version number
    
#### Options

##### help (`-h`,`--help`)

Output usage information.

##### version (`-v`,`--version`)

Output **tablodo**' version number.

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Lint your code using [Grunt](http://gruntjs.com/).

## Release History

* **0.0.1**: Starting project, initial release (*25/09/14*)

### TODO
    
- [ ] add option to exclude information
- [ ] use current local npm user if no one given

## License
Copyright (c) 2014 Leny  
Licensed under the MIT license.
