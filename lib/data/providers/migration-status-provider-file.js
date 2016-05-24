/**
 * MigrationStatusProviderFile
 * Handle migrations status located in mongodb database
**/

'use strict'

var util = require('util');
var MigrationStatusProviderBase = require('./migration-status-provider-base.js');

/**
 * Constructor
 */
var MigrationStatusProviderFile = function(config) {
    MigrationStatusProviderFile.super_.apply(this, arguments);
};

util.inherits(MigrationStatusProviderFile, MigrationStatusProviderBase);

/**
 * Save the migration status
 * @param identifier
 * @param direction
 * @param callback(error)
 */
MigrationStatusProviderFile.prototype.saveStatus = function(identifier, direction, callback) {
    return callback(null);
};

/**
 * Retrieve the migration status
 * @param callback(error, migrationStatus)
 */
MigrationStatusProviderFile.prototype.retrieveStatus = function(callback) {
    return callback(null);
};

module.exports = MigrationStatusProviderFile;