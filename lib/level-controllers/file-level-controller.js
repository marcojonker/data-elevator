/**
 * FileLevelController
 * Store and retrieve current level from file
**/
const fs = require('fs')
const path = require('path')
const BaseLevelController = require('./base-level-controller.js')
const Errors = require('../errors/elevator-errors.js')
const Level = require('./level.js')
const FileUtils = require('../utils/file-utils').FileUtils
const CreateDirectory = require('../utils/file-utils').CreateDirectory

class FileLevelController extends BaseLevelController {
  _getLevelFilePath (config) {
    let filePath = null

    if (config.levelControllerConfig && config.levelControllerConfig.fileName) {
      filePath = path.join(this._getLevelDir(config), config.levelControllerConfig.fileName)
    } else {
      throw Errors.invalidConfig('Invalid configuration. Level controller file name not defined.')
    }
    return filePath
  }

  _getLevelDir (config) {
    let directory = null

    if (config.workingDir) {
      directory = path.join(config.workingDir, 'level')
    } else {
      throw Errors.invalidConfig('Invalid configuration. Working directory not defined.')
    }

    return directory
  }

  /**
   * Save the current level
   * @param level
   * @param callback(error)
   */
  saveCurrentLevel (level, callback) {
    let filePath = null
    let fileDir = null

    try {
      filePath = this._getLevelFilePath(this.config)
      fileDir = this._getLevelDir(this.config)
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
  retrieveCurrentLevel (callback) {
    let level = null
    let filePath = null

    try {
      filePath = this._getLevelFilePath(this.config)
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
}

module.exports = FileLevelController
