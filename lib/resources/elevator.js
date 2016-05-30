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
var Elevator = function() {
    Elevator.super_.apply(this, arguments);
};

util.inherits(Elevator, ElevatorBase);

var elevator = new Elevator(null);

elevator.run(function(error) {
    if(error) {
        console.log(error.message);
    }
});