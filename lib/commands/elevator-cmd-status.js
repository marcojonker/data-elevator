/**
 * ElevatorCmdStatus
 * Print the status of the elevator
 * 
**/

'use strict'

var util = require('util');
var ElevatorCmdBase = require('./elevator-cmd-base.js');
var Errors = require('../errors/elevator-errors.js');
var ElevatorEngine = require('../controllers/elevator-engine/elevator-engine.js').ElevatorEngine;

/**
 * Constructor
 * @param commandLineOptions - Command line options
 * @param logger - Instance of BaseLogger
 * @param LevelController - Class derived from BaseLevelController used for storing the current level
 */
var ElevatorCmdStatus = function(options, logger, LevelController) {
    ElevatorCmdStatus.super_.apply(this, arguments);
};

util.inherits(ElevatorCmdStatus, ElevatorCmdBase);

/**
 * Validate command line options options for command
 * @param options
 * @param callback(error)
 */
ElevatorCmdStatus.prototype.onValidateOptions = function(options, callback) {
    return callback(null);
}

/**
 * Run the command
 * @param options
 * @param callback(error)
 */
ElevatorCmdStatus.prototype.onRun = function(options, callback) {
    var self = this
    
    ElevatorEngine.printStatus(this.getConfiguration(options), this.logger, this.LevelController, function(error) {
        return callback(error);
    });
}

module.exports = ElevatorCmdStatus;