/**
 * Elevator
 * Data elevator
**/
const ElevatorBase = require('data-elevator/lib/elevator-engine/elevator-base')
const ConsoleLogger = require('data-elevator/lib/logger/console-logger')
const FileLevelController = require('data-elevator/lib/level-controllers/file-level-controller')

class Elevator extends ElevatorBase {
}

const elevator = new Elevator(new ConsoleLogger(false), FileLevelController)

// Run the elevator
elevator.run(function () { })
