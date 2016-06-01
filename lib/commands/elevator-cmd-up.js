/**
 * ElevatorCmdUp
 * Command for moving the elevator up
**/

'use strict'

var util = require('util');
var ElevatorCmdBase = require('./elevator-cmd-base.js');
var ElevatorEngine = require('../elevator-engine/elevator-engine.js').ElevatorEngine;

/**
 * Constructor
 * @param commandLineOptions - Command line options
 * @param logger - Instance of BaseLogger
 * @param LevelController - Class derived from BaseLevelController used for storing the current level
 */
var ElevatorCmdUp = function(options, logger, LevelController) {
    ElevatorCmdUp.super_.apply(this, arguments);
};

util.inherits(ElevatorCmdUp, ElevatorCmdBase);

/**
 * Validate command line options options for command
 * @param options
 * @param callback(error)
 */
ElevatorCmdUp.prototype.onValidateOptions = function(options, callback) {
    return callback(null);
}

/**
 * Run the command
 * @param options
 * @param callback(error)
 */
ElevatorCmdUp.prototype.onRun = function(options, callback) {    
    var self = this;
    this.logger.info('>> GOING UP!!!');

    ElevatorEngine.moveUp(this.getConfiguration(options), options.floor, this.logger, this.LevelController, function(error) {
        if(error) {
            self.logger.error('>> Elevator could not reach the destination, fix the problem or call the lobby.', error);
        } else {
            self.logger.info('>> Destination floor reached, doors are opening and data is ready to be used!');
        }
        return callback(error);
    });
}

module.exports = ElevatorCmdUp;