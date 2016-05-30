/**
 * ElevatorCmdDown
 * Command for moving the elevator down
 * 
**/

'use strict'

var util = require('util');
var ElevatorCmdBase = require('./elevator-cmd-base.js');
var Errors = require('../errors/errors.js');
var ElevatorEngine = require('../elevator-engine.js').ElevatorEngine;

/**
 * Constructor
 * @param commandLineOptions - Command line options
 * @param logger - Instance of BaseLogger
 * @param LevelController - Class derived from BaseLevelController used for storing the current level
 */
var ElevatorCmdDown = function(options, logger, LevelController) {
    ElevatorCmdDown.super_.apply(this, arguments);
};

util.inherits(ElevatorCmdDown, ElevatorCmdBase);

/**
 * Validate command line options options for command
 * @param options
 * @param callback(error)
 */
ElevatorCmdDown.prototype.onValidateOptions = function(options, callback) {
    if(options['floor'] && typeof options['floor'] === 'number' ) {
        return callback(null);
    } else {
        return callback(Errors.invalidCmdArgument('floor', 'number'));
    }
}

/**
 * Run the command
 * @param options
 * @param callback(error)
 */
ElevatorCmdDown.prototype.onRun = function(options, callback) {
    var self = this
    this.logger.info('>> GOING DOWN!!');

    ElevatorEngine.goDown(this.getConfiguration(options), options['floor'], this.logger, function(error) {
        if(error) {
            self.logger.info('>> Elevator could not reach the destination, fix the problem or call the lobby: ' + error.message);
        } else {
            self.logger.info('>> Destination floor reached, doors are opening and data is ready to be used!');
        }
        return callback(error);
    });
}

module.exports = ElevatorCmdDown;