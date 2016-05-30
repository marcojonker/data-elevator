/**
 * Elevator
 * Data elevator
 * 
**/

'use strict'

var util = require('util');
var ElevatorBase = require('./lib/elevator-base.js');

/**
 * Constructor
 */
var Elevator = function(logger, LevelController) {
    Elevator.super_.apply(this, arguments);
};

util.inherits(Elevator, ElevatorBase);

/**
 * Initialize custom components after all migrations have been applied
 * @param callback(error)
 */
ElevatorBase.prototype.onInitialize = function(callback) {
    return callback(null);
};

/**
 * Uninitiailze custom components after all migrations have been applied
 * @param callback(error)
 */
ElevatorBase.prototype.onUnInitialize = function(callback) {
    return callback(null);
}

//A custom logger or level controller can be set here if needed
var elevator = new Elevator(null, null);

//Run the elevator
elevator.run(function(error) { });