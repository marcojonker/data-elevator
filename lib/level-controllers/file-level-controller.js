/**
 * FileLevelController
 * Store and retrieve current level from file
**/

'use strict'

const util = require('util')
const fs = require('fs')
const path = require('path')
const BaseLevelController = require('./base-level-controller.js')
const Errors = require('../errors/elevator-errors.js')
const Level = require('./level.js')
const FileUtils = require('../utils/file-utils').FileUtils
const CreateDirectory = require('../utils/file-utils').CreateDirectory

/**
 * Get level directory
 * @param config
 * @result string
 * @throws Error
 */
const _getLevelDir = function (config) {
  let directory = null

  if (config.workingDir) {
    directory = path.join(config.workingDir, 'level')
  } else {
    throw Errors.invalidConfig('Invalid configuration. Working directory not defined.')
  }

  return directory
}

/**
 * Get level file path
 * @param config
 * @result string
 * @throws Error
 */
const _getLevelFilePath = function (config) {
  let filePath = null

  if (config.levelControllerConfig && config.levelControllerConfig.fileName) {
    filePath = path.join(_getLevelDir(config), config.levelControllerConfig.fileName)
  } else {
    throw Errors.invalidConfig('Invalid configuration. Level controller file name not defined.')
  }
  return filePath
}

/**
 * Constructor
 * @param config
 */
const FileLevelController = function (config) {
  FileLevelController.super_.apply(this, arguments)
}

util.inherits(FileLevelController, BaseLevelController)

/**
 * Save the current level
 * @param level
 * @param callback(error)
 */
FileLevelController.prototype.saveCurrentLevel = function (level, callback) {
  let filePath = null
  let fileDir = null

  try {
    filePath = _getLevelFilePath(this.config)
    fileDir = _getLevelDir(this.config)
  } catch (error) {
    return callback(error)
  }

  try {
    FileUtils.createDirectory(new CreateDirectory(fileDir, false))
    fs.writeFileSync(filePath, JSON.stringify(level))
    return callback(null)
  } catch (error) {
    return callback(Errors.generalError("Failed to write level file '" + filePath + "'", error))
  }
}

/**
 * Retrieve the current level
 * @param callback(error, level)
 */
FileLevelController.prototype.retrieveCurrentLevel = function (callback) {
  let level = null
  let filePath = null

  try {
    filePath = _getLevelFilePath(this.config)
  } catch (error) {
    return callback(error)
  }

  try {
    if (FileUtils.fileExists(filePath)) {
      const json = fs.readFileSync(filePath, 'utf8')
      level = Level.fromJson(json)
    }

    return callback(null, level)
  } catch (error) {
    return callback(Errors.generalError('Failed to read level file '.filePath, error))
  }
}

module.exports = FileLevelController
