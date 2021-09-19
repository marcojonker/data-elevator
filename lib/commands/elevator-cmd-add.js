/**
 * ElevatorCmdAdd
 * Command for creating a new floor
**/

'use strict'

const util = require('util')
const ElevatorCmdBase = require('./elevator-cmd-base.js')
const FloorController = require('../floor-controllers/floor-controller.js').FloorController
const FileUtils = require('../utils/file-utils.js').FileUtils
const CopyFile = require('../utils/file-utils.js').CopyFile
const CreateDirectory = require('../utils/file-utils.js').CreateDirectory
const Errors = require('../errors/elevator-errors.js')

/**
 * Constructor
 * @param commandLineOptions - Command line options
 * @param logger - Instance of BaseLogger
 * @param LevelController - Class derived from BaseLevelController used for storing the current level
 */
const ElevatorCmdAdd = function (options, logger, LevelController) {
  ElevatorCmdAdd.super_.apply(this, arguments)
}

util.inherits(ElevatorCmdAdd, ElevatorCmdBase)

/**
 * Validate command line options options for command
 * @param options
 * @param callback(error)
 */
ElevatorCmdAdd.prototype.onValidateOptions = function (options, callback) {
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
ElevatorCmdAdd.prototype.onRun = function (options, callback) {
  this.logger.info('>> Adding a new floor.')

  try {
    const config = this.getConfiguration(options)

    // Create migrations path and add file
    FileUtils.createDirectory(new CreateDirectory(config.floorsDir, false))

    // Get the next floor file
    const floor = FloorController.getNextFloor(config.floorsDir, options.name)

    // Copy the template file to the new migration file
    FileUtils.copyFile(new CopyFile(config.floorTemplateFilePath, floor.filePath, true))
    this.logger.info('>> New floor added: ' + floor.filePath)

    return callback(null)
  } catch (error) {
    this.logger.error('>> Failed to add floor.', error)
    return callback(error)
  }
}

module.exports = ElevatorCmdAdd
