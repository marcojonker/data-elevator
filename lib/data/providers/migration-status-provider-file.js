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
 * @param migrationStatus
 * @param callback(error)
 */
MigrationStatusProviderFile.prototype.saveStatus = function(migrationStatus, callback) {
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