
'use strict';

var util = require("util");
var fs = require('fs');
var path = require('path');

var ElevatorCmdBase = require('./elevator-cmd-base.js');
var Errors = require('../errors/errors.js');

/**
 * Constructor
 * @param options
 * @param logger
 * @param StatusHandler - Class derived from MigrationStatusHandlerBase used for custom status handlers
 */
function ElevatorCmdHelp(options, logger, FloorHandler) {
    ElevatorCmdHelp.super_.apply(this, arguments);
}

util.inherits(ElevatorCmdHelp, ElevatorCmdBase);

/**
 * validate options for migrator function
 * @param options
 * @param callback
 */
ElevatorCmdHelp.prototype.onValidateOptions = function(options, callback) {
    return callback(null);
}

/**
 * run migrator function
 * @param options
 * @param callback
 */
ElevatorCmdHelp.prototype.onRun = function(options, callback) {
    var manualPath = path.join(__dirname, "../resources/manual.txt");
    
    fs.readFile(manualPath, 'utf8', function(error, data) {
        if(!error) {
            console.log(data);
            return callback(null);
        } else {
            return callback(Errors.systemError('Manual could not be read from path: ' + manualPath, error));
        }
    })
}

module.exports = ElevatorCmdHelp;
