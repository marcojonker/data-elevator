/**
 * MigrationStatusHandlerBase
 * Base class for handling migration status
**/

'use strict'

var Errors = require('../errors/migration-errors.js');

/**
 * Constructor
 */
var MigrationStatusHandlerBase = function(config) {
    this.config = config;
};

/**
 * Save the migration status
 * @param identifier
 * @param direction
 * @param callback(error)
 */
MigrationStatusHandlerBase.prototype.saveStatus = function(identifier, direction, callback) {
    throw Errors.methodNotImplemented('saveStatus', 'MigrationStatusHandlerBase');
};

/**
 * Retrieve the migration status
 * @param callback(error, migrationStatus)
 */
MigrationStatusHandlerBase.prototype.retrieveStatus = function(callback) {
    throw Errors.methodNotImplemented('retrieveStatus', 'MigrationStatusHandlerBase');
};

module.exports = MigrationStatusHandlerBase;
