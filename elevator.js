/**
 * Elevator
 * Data elevator
**/
var ElevatorBase = require('./lib/elevator-engine/elevator-base.js');
var ConsoleLogger = require('./lib/logger/console-logger.js');
var LevelController = require('./lib/level-controllers/file-level-controller.js');
/* eslint-disable no-undef */
var elevator = new ElevatorBase(new ConsoleLogger(false), LevelController, __dirname);
/* eslint-enable no-undef */

elevator.run(function(error) { });

