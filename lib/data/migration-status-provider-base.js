/**
 * MigrationStatusProviderBase
 * Base class for handling migration status
**/

'use strict'

var Errors = require('../errors/migration-errors.js');

/**
 * Constructor
 */
var MigrationStatusProviderBase = function(config) {
    this.config = config;
};

/**
 * Save the migration status
 * @param identifier
 * @param direction
 * @param callback(error)
 */
MigrationStatusProviderBase.prototype.saveStatus = function(identifier, direction, callback) {
    throw Erros.methodNotImplemented('saveStatus', 'MigrationStatusProviderBase');
};

/**
 * Retrieve the migration status
 * @param callback(error, migrationStatus)
 */
MigrationStatusProviderBase.prototype.retrieveStatus = function(callback) {
    throw Erros.methodNotImplemented('retrieveStatus', 'MigrationStatusProviderBase');
};

module.exports = MigrationStatusProviderBase;
