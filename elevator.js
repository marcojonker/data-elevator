/**
 * Migrator
 * Processor for migrations
 * 
**/

'use strict'

var ElevatorBase = require('./lib/elevator-base.js');
var ConsoleLogger = require('./lib/logger/console-logger.js');

var util = require('util');

/**
 * Constructor
 */
var Elevator = function() {
    Elevator.super_.apply(this, arguments);
};

util.inherits(Elevator, ElevatorBase);

var elevator = new ElevatorBase(new ConsoleLogger(false));

elevator.run(function(error) {
    if(error) {
        console.log(error.message);
    }
})

