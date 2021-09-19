/**
 * ElevatorCmdConstruct
 * Command for initializing a new elevator
**/

'use strict'

const util = require('util')
const path = require('path')
const ElevatorCmdBase = require('./elevator-cmd-base.js')
const Errors = require('../errors/elevator-errors.js')
const FileUtils = require('../utils/file-utils.js').FileUtils
const CopyFile = require('../utils/file-utils.js').CopyFile

/**
 * Constructor
 * @param commandLineOptions - Command line options
 * @param logger - Instance of BaseLogger
 * @param LevelController - Class derived from BaseLevelController used for storing the current level
 */
const ElevatorCmdConstruct = function (options, logger, LevelController) {
  ElevatorCmdConstruct.super_.apply(this, arguments)
}

util.inherits(ElevatorCmdConstruct, ElevatorCmdBase)

/**
 * Validate command line options options for command
 * @param options
 * @param callback(error)
 */
ElevatorCmdConstruct.prototype.onValidateOptions = function (options, callback) {
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
ElevatorCmdConstruct.prototype.onRun = function (options, callback) {
  this.logger.info('>> Constructing a new data elevator.')
  const workingDir = options.workingDir
  const configDir = options.configDir ? options.configDir : workingDir

  try {
    // Prepare files to copy
    const copyFiles = [
      new CopyFile(
        path.join(options.moduleDir, './lib/resources', 'config.js'),
        path.join(configDir, 'config.js'),
        true)
    ]

    // Create directory that will contain the migrations
    FileUtils.createDirectoryPath(workingDir, true)
    FileUtils.createDirectoryPath(configDir, false)

    // Copy the files
    FileUtils.copyFiles(copyFiles)

    FileUtils.copyRecusive(
      path.join(options.moduleDir, './lib/resources'),
      workingDir)

    FileUtils.copyRecusive(
      path.join(__dirname, '../resources'),
      workingDir)

    this.logger.info(">> Elevator has been constructed. Use the 'add' command to add a floor.")
    return callback(null)
  } catch (error) {
    this.logger.error('>> Failed to construct the new elevator.', error)
    return callback(error)
  }
}

module.exports = ElevatorCmdConstruct
