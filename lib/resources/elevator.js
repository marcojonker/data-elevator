/**
 * Elevator
 * Data elevator
**/

'use strict'

const util = require('util')
const ElevatorBase = require('data-elevator/lib/elevator-engine/elevator-base')
const ConsoleLogger = require('data-elevator/lib/logger/console-logger')
const FileLevelController = require('data-elevator/lib/level-controllers/file-level-controller')

/**
 * Constructor
 * @param logger
 * @param LevelController
 */
const Elevator = function (logger, LevelController) {
  Elevator.super_.apply(this, arguments)
}

util.inherits(Elevator, ElevatorBase)

const elevator = new Elevator(new ConsoleLogger(false), FileLevelController)

// Run the elevator
elevator.run(function () { })
