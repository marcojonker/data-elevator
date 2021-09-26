/**
 * BaseLevelController
 * Base class for storing and retrieving the current level on which the elevator is located
**/
const Errors = require('../errors/elevator-errors.js')
const path = require('path')
const fs = require('fs')

class BaseLevelController {
  constructor (config) {
    this.config = config
  }

  /**
   * Save the current level
   * @param level
   * @param callback(error)
   */
  saveCurrentLevel (level, callback) {
    throw Errors.methodNotImplemented('saveCurrentLevel', 'BaseLevelController')
  }

  /**
   * Retrieve the current level
   * @param callback(error, level)
   */
  retrieveCurrentLevel (callback) {
    throw Errors.methodNotImplemented('retrieveCurrentLevel', 'BaseLevelController')
  }

  /**
   * Retrieve the content of the manual, this method can be overriden to display a custom manual
   * @param callback(error, content)
   */
  static getManual (callback) {
    /* eslint-disable no-undef */
    const manualPath = path.join(__dirname, '../manual/manual.txt')
    /* eslint-enable no-undef */

    fs.readFile(manualPath, 'utf8', function (error, content) {
      if (!error) {
        return callback(null, content)
      } else {
        return callback(Errors.generalError('Manual could not be read from path: ' + manualPath, error))
      }
    })
  }
}

module.exports = BaseLevelController
