/**
 * ElevatorCmdUp
 * Elevator go up
 * 
**/

'use strict'

var util = require('util');

var ElevatorCmdBase = require('./elevator-cmd-base.js');
var ElevatorEngine = require('../controllers/elevator-engine/elevator-engine.js').ElevatorEngine;

/**
 * Constructor
 * @param options
 * @param logger
 * @param StatusHandler - Class derived from MigrationStatusHandlerBase used for custom status handlers
 */
var ElevatorCmdUp = function(options, logger, FloorController) {
    ElevatorCmdUp.super_.apply(this, arguments);
};

util.inherits(ElevatorCmdUp, ElevatorCmdBase);

/**
 * validate options
 * @param options
 * @param callback
 */
ElevatorCmdUp.prototype.onValidateOptions = function(options, callback) {
    return callback(null);
}

/**
 * run command
 * @param options
 * @param callback
 */
ElevatorCmdUp.prototype.onRun = function(options, callback) {    
    var self = this;
    this.logger.info('>> GOING UP!!!');

    ElevatorEngine.moveUp(this.getConfiguration(options), options['floor'], this.logger, this.FloorController, function(error) {
        if(error) {
            self.logger.info('>> Elevator could not reach the destination, fix the problem or call the lobby: ' + error.message);
        } else {
            self.logger.info('>> Destination floor reached, doors are opening!');
        }
        return callback(error);
    });
}

module.exports = ElevatorCmdUp;