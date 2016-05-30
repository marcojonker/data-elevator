/**
 * MigratorCmdInit
 * Command for displaying the help file
**/

'use strict';

var util = require("util");
var fs = require('fs');
var path = require('path');
var ElevatorCmdBase = require('./elevator-cmd-base.js');
var Errors = require('../errors/elevator-errors.js');

/**
 * Constructor
 * @param commandLineOptions - Command line options
 * @param logger - Instance of BaseLogger
 * @param LevelController - Class derived from BaseLevelController used for storing the current level
 */
function ElevatorCmdHelp(options, logger, LevelController) {
    ElevatorCmdHelp.super_.apply(this, arguments);
}

util.inherits(ElevatorCmdHelp, ElevatorCmdBase);

/**
 * Validate command line options options for command
 * @param options
 * @param callback(error)
 */
ElevatorCmdHelp.prototype.onValidateOptions = function(options, callback) {
    return callback(null);
}

/**
 * Run the command
 * @param options
 * @param callback(error)
 */
ElevatorCmdHelp.prototype.onRun = function(options, callback) {
    var manualPath = path.join(__dirname, "../resources/manual.txt");
    
    fs.readFile(manualPath, 'utf8', function(error, data) {
        if(!error) {
            console.log(data);
            return callback(null);
        } else {
            return callback(Errors.generalError('Manual could not be read from path: ' + manualPath, error));
        }
    })
}

module.exports = ElevatorCmdHelp;
