/**
 * ElevatorCmdMove
 * Command for moving the elevator down
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
const ElevatorCmdMove = function (options, logger, LevelController) {
  ElevatorCmdMove.super_.apply(this, arguments)
}

util.inherits(ElevatorCmdMove, ElevatorCmdBase)

/**
 * Validate command line options options for command
 * @param options
 * @param callback(error)
 */
ElevatorCmdMove.prototype.onValidateOptions = function (options, callback) {
  if (options.workingDir && typeof options.workingDir === 'string') {
    if (options.floor && (typeof options.floor === 'number' ||
                                options.floor === 'ground' ||
                                options.floor === 'top')) {
      return callback(null)
    } else {
      const floorError = Errors.invalidCmdArgument('floor', 'number')
      this.logger.error(floorError)
      return callback(floorError)
    }
  } else {
    const workingDirError = Errors.invalidCmdArgument('workingDir', 'string')
    this.logger.error(workingDirError)
    return callback(workingDirError)
  }
}

/**
 * Run the command
 * @param options
 * @param callback(error)
 */
ElevatorCmdMove.prototype.onRun = function (options, callback) {
  const self = this

  ElevatorEngine.move(this.getConfiguration(options), options.floor, this.logger, this.LevelController, function (error) {
    if (error) {
      self.logger.error('>> Elevator could not reach the destination.', error)
    } else {
      if (options.floor === 'top') {
        self.logger.info('>> Top floor reached')
      } else if (options.floor === 'ground') {
        self.logger.info('>> Ground floor reached')
      } else {
        self.logger.info('>> Floor ' + options.floor + ' reached')
      }
    }
    return callback(error)
  })
}

module.exports = ElevatorCmdMove
