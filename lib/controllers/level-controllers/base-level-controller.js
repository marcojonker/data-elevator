/**
 * BaseLevelController
 * Base class for handling migration status
**/

'use strict'

var Errors = require('../../errors/errors.js');

/**
 * Constructor
 */
var BaseLevelController = function(config) {
    this.config = config;
};

/**
 * Save the migration status
 * @param floor
 * @param callback(error)
 */
BaseLevelController.prototype.saveCurrentLevel = function(level, callback) {
    throw Errors.methodNotImplemented('saveCurrentLevel', 'BaseLevelController');
};

/**
 * Retrieve the migration status
 * @param callback(error, migrationStatus)
 */
BaseLevelController.prototype.retrieveCurrentLevel = function(callback) {
    throw Errors.methodNotImplemented('retrieveCurrentLevel', 'BaseLevelController');
};

module.exports = BaseLevelController;
