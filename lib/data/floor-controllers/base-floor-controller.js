/**
 * BaseFloorController
 * Base class for handling migration status
**/

'use strict'

var Errors = require('../errors/errors.js');

/**
 * Constructor
 */
var BaseFloorController = function(config) {
    this.config = config;
};

/**
 * Save the migration status
 * @param floor
 * @param callback(error)
 */
BaseFloorController.prototype.saveCurrentFloor = function(floor, callback) {
    throw Errors.methodNotImplemented('saveCurrentFloor', 'BaseFloorController');
};

/**
 * Retrieve the migration status
 * @param callback(error, migrationStatus)
 */
BaseFloorController.prototype.retrieveCurrentFloor = function(callback) {
    throw Errors.methodNotImplemented('retrieveCurrentFloor', 'BaseFloorController');
};

module.exports = BaseFloorController;
