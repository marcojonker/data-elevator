/**
 * Elevator
 * Data elevator
 * 
**/

'use strict'

var util = require('util');
var ElevatorBase = require('./lib/elevator-base.js');
var ConsoleLogger = require('./lib/logger/console-logger.js');

/**
 * Constructor
 */
var Elevator = function(logger, LevelController) {
    Elevator.super_.apply(this, arguments);
};

util.inherits(Elevator, ElevatorBase);

var elevator = new Elevator(new ConsoleLogger(false));

elevator.run(function(error) { });

