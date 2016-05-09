
'use strict';

var util = require("util");
var fs = require('fs');
var path = require('path');

var MigratorBase = require('./migrator-base.js');

/**
 * Constructor
 * @param options
 */
function MigratorHelp(options) {
    MigratorHelp.super_.apply(this, arguments);
}

util.inherits(MigratorHelp, MigratorBase);

/**
 * validate options for migrator function
 * @param options
 * @param callback
 */
MigratorHelp.prototype.onValidateOptions = function(options, callback) {
    return callback(null);
}

/**
 * run migrator function
 * @param options
 * @param callback
 */
MigratorHelp.prototype.onRun = function(options, callback) {
    var manualPath = path.join(__dirname, "resources/manual.txt");
    console.log(manualPath);
    
    fs.readFile(manualPath, 'utf8', function(error, data) {
        if(!error) {
            console.log(data);
            return callback(null);
        } else {
            return callback(error);
        }
    })
}

module.exports = MigratorHelp;
