
'use strict';

var util = require("util");
var fs = require('fs');
var path = require('path');

var MigratorCmdBase = require('./migrator-cmd-base.js');

/**
 * Constructor
 * @param options
 */
function MigratorCmdHelp(options) {
    MigratorCmdHelp.super_.apply(this, arguments);
}

util.inherits(MigratorCmdHelp, MigratorCmdBase);

/**
 * validate options for migrator function
 * @param options
 * @param callback
 */
MigratorCmdHelp.prototype.onValidateOptions = function(options, callback) {
    return callback(null);
}

/**
 * run migrator function
 * @param options
 * @param callback
 */
MigratorCmdHelp.prototype.onRun = function(options, callback) {
    var manualPath = path.join(__dirname, "../resources/manual.txt");
    
    fs.readFile(manualPath, 'utf8', function(error, data) {
        if(!error) {
            console.log(data);
            return callback(null);
        } else {
            return callback(error);
        }
    })
}

module.exports = MigratorCmdHelp;
