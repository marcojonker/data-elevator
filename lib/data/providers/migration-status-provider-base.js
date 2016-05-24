/**
 * MigrationStatusProviderBase
 * Base class for handling migration status
**/

'use strict'

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
    throw new Error('saveStatus not implemented');
};

/**
 * Retrieve the migration status
 * @param callback(error, migrationStatus)
 */
MigrationStatusProviderBase.prototype.retrieveStatus = function(callback) {
    throw new Error('retrieveStatus not implemented');
};

module.exports = MigrationStatusProviderBase;
