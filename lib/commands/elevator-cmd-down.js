/**
 * ElevatorCmdDown
 * Migrate down
 * 
**/

'use strict'

var util = require('util');

var ElevatorCmdBase = require('./elevator-cmd-base.js');
var Errors = require('../errors/errors.js');
var ElevatorEngine = require('../elevator-engine.js').ElevatorEngine;

/**
 * Constructor
 * @param options
 * @param logger
 * @param StatusHandler - Class derived from MigrationStatusHandlerBase used for custom status handlers
 */
var ElevatorCmdDown = function(options, logger, FloorController) {
    ElevatorCmdDown.super_.apply(this, arguments);
};

util.inherits(ElevatorCmdDown, ElevatorCmdBase);

/**
 * validate options for migrator function
 * @param options
 * @param callback
 */
ElevatorCmdDown.prototype.onValidateOptions = function(options, callback) {
    if(options['floor'] && typeof options['floor'] === 'number' ) {
        return callback(null);
    } else {
        return callback(Errors.invalidCmdArgument('floor', 'number'));
    }
}

/**
 * run migrator function
 * @param options
 * @param callback
 */
ElevatorCmdDown.prototype.onRun = function(options, callback) {
    var self = this
    this.logger.info('>> GOING DOWN');

    ElevatorEngine.goDown(this.getConfiguration(options), options['floor'], this.logger, function(error) {
        if(error) {
            self.logger.info('>> Elevator could not reach the destination, fix the problem or call the lobby: ' + error.message);
        } else {
            self.logger.info('>> Destination floor reached, doors are opening!');
        }
        return callback(error);
    });
}

module.exports = ElevatorCmdDown;