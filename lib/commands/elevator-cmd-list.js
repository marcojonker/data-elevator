/**
 * ElevatorCmdList
 * Print list of all floors
 *
**/

'use strict'

const util = require('util')
const ElevatorCmdBase = require('./elevator-cmd-base.js')
const ElevatorEngine = require('../elevator-engine/elevator-engine.js').ElevatorEngine

/**
 * Constructor
 * @param commandLineOptions - Command line options
 * @param logger - Instance of BaseLogger
 * @param LevelController - Class derived from BaseLevelController used for storing the current level
 */
const ElevatorCmdList = function (options, logger, LevelController) {
  ElevatorCmdList.super_.apply(this, arguments)
}

util.inherits(ElevatorCmdList, ElevatorCmdBase)

/**
 * Validate command line options options for command
 * @param options
 * @param callback(error)
 */
ElevatorCmdList.prototype.onValidateOptions = function (options, callback) {
  return callback(null)
}

/**
 * Run the command
 * @param options
 * @param callback(error)
 */
ElevatorCmdList.prototype.onRun = function (options, callback) {
  ElevatorEngine.printList(this.getConfiguration(options), this.logger, this.LevelController, function (error) {
    return callback(error)
  })
}

module.exports = ElevatorCmdList
