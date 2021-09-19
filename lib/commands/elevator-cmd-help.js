/**
 * MigratorCmdInit
 * Command for displaying the help file
**/

'use strict'

const util = require('util')
const ElevatorCmdBase = require('./elevator-cmd-base.js')
const BaseLevelController = require('../level-controllers/base-level-controller')

/**
 * Constructor
 * @param commandLineOptions - Command line options
 * @param logger - Instance of BaseLogger
 * @param LevelController - Class derived from BaseLevelController used for storing the current level
 */
function ElevatorCmdHelp (options, logger, LevelController) {
  ElevatorCmdHelp.super_.apply(this, arguments)
}

util.inherits(ElevatorCmdHelp, ElevatorCmdBase)

/**
 * Validate command line options options for command
 * @param options
 * @param callback(error)
 */
ElevatorCmdHelp.prototype.onValidateOptions = function (options, callback) {
  return callback(null)
}

/**
 * Run the command
 * @param options
 * @param callback(error)
 */
ElevatorCmdHelp.prototype.onRun = function (options, callback) {
  if (this.LevelController.getManual) {
    this.LevelController.getManual(function (error, content) {
      if (!error) {
        console.log(content)
      }
      return callback(error)
    })
  } else {
    BaseLevelController.getManual(function (error, content) {
      if (!error) {
        console.log(content)
      }
      return callback(error)
    })
  }
}

module.exports = ElevatorCmdHelp
