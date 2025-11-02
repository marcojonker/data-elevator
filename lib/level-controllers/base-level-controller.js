/**
 * BaseLevelController
 * Base class for storing and retrieving the current level on which the elevator is located
**/
const Errors = require('../errors/elevator-errors.js')

class BaseLevelController {
  constructor (config) {
    this.config = config
  }

  /**
   * Save the current level
   * @param level
   * @param callback(error)
   */
  saveCurrentLevel (_level, _callback) {
    throw Errors.methodNotImplemented('saveCurrentLevel', 'BaseLevelController')
  }

  /**
   * Retrieve the current level
   * @param callback(error, level)
   */
  retrieveCurrentLevel (_callback) {
    throw Errors.methodNotImplemented('retrieveCurrentLevel', 'BaseLevelController')
  }
}

module.exports = BaseLevelController
