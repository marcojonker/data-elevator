/**
 * Elevator
 * Data elevator
**/

'use strict';

var ElevatorBase = require('./lib/elevator-engine/elevator-base.js');
var ConsoleLogger = require('./lib/logger/console-logger.js');
var LevelController = require('./lib/level-controllers/file-level-controller.js');

var elevator = new ElevatorBase(new ConsoleLogger(false), LevelController, __dirname);
elevator.run(function(error) { });

