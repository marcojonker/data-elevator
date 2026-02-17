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
    let error = null

    try {
      filePath = this._getLevelFilePath(this.config)
      fileDir = this._getLevelDir(this.config)
    } catch (error) {
      return callback(error)
    }

    try {
      FileUtils.createDirectory(new CreateDirectory(fileDir, false))
      fs.writeFileSync(filePath, JSON.stringify(level))
    } catch (err) {
      error = Errors.generalError("Failed to write level file '" + filePath + "'", err)
    }

    if (error) {
      return callback(error)
    }

    return callback(null)
  }

  /**
   * Retrieve the current level
   * @param callback(error, level)
   */
  retrieveCurrentLevel (callback) {
    let level = null
    let filePath = null
    let error = null

    try {
      filePath = this._getLevelFilePath(this.config)
    } catch (error) {
      return callback(error)
    }

    try {
      if (FileUtils.fileExists(filePath)) {
        const json = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' })
        level = Level.fromJson(json)
      }
    } catch (err) {
      error = Errors.generalError('Failed to read level file ' + filePath, err)
    }

    if(error) {
       return callback(error)
    }
    return callback(null, level)
  }
}

module.exports = FileLevelController
