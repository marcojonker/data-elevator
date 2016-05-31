/**
 * BaseLevelController
 * Base class for storing and retrieving the current level on which the elevator is located
**/

'use strict'

var Errors = require('../errors/elevator-errors.js');

/**
 * Constructor
 */
var BaseLevelController = function(config) {
    this.config = config;
};

/**
 * Save the current level
 * @param level
 * @param callback(error)
 */
BaseLevelController.prototype.saveCurrentLevel = function(level, callback) {
    throw Errors.methodNotImplemented('saveCurrentLevel', 'BaseLevelController');
};

/**
 * Retrieve the current level
 * @param callback(error, level)
 */
BaseLevelController.prototype.retrieveCurrentLevel = function(callback) {
    throw Errors.methodNotImplemented('retrieveCurrentLevel', 'BaseLevelController');
};

module.exports = BaseLevelController;
