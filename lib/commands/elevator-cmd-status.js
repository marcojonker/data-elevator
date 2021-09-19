/**
 * ElevatorCmdStatus
 * Print the status of the elevator
 *
**/

'use strict'

const util = require('util')
const ElevatorCmdBase = require('./elevator-cmd-base.js')
const Errors = require('../errors/elevator-errors.js')
const ElevatorEngine = require('../elevator-engine/elevator-engine.js').ElevatorEngine

/**
 * Constructor
 * @param commandLineOptions - Command line options
 * @param logger - Instance of BaseLogger
 * @param LevelController - Class derived from BaseLevelController used for storing the current level
 */
const ElevatorCmdStatus = function (options, logger, LevelController) {
  ElevatorCmdStatus.super_.apply(this, arguments)
}

util.inherits(ElevatorCmdStatus, ElevatorCmdBase)

/**
 * Validate command line options options for command
 * @param options
 * @param callback(error)
 */
ElevatorCmdStatus.prototype.onValidateOptions = function (options, callback) {
  if (options.workingDir && typeof options.workingDir === 'string') {
    return callback(null)
  } else {
    const error = Errors.invalidCmdArgument('workingDir', 'string')
    this.logger.error(error)
    return callback(error)
  }
}

/**
 * Run the command
 * @param options
 * @param callback(error)
 */
ElevatorCmdStatus.prototype.onRun = function (options, callback) {
  ElevatorEngine.printStatus(this.getConfiguration(options), this.logger, this.LevelController, function (error) {
    return callback(error)
  })
}

module.exports = ElevatorCmdStatus
