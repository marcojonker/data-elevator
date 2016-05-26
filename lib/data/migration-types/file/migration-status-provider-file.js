/**
 * MigrationStatusProviderFile
 * Handle migrations status located in mongodb database
**/

'use strict'

var util = require('util');

var Errors = require('../../../errors/migration-errors.js');
var MigrationStatusProviderBase = require('../../migration-status-provider-base.js');
var MigrationStatus = require('../../../models/migration-status.js');

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
    //TODO: implement
    return callback(null);
};

/**
 * Retrieve the migration status
 * @param callback(error, migrationStatus)
 */
MigrationStatusProviderFile.prototype.retrieveStatus = function(callback) {
    //TODO: implement
    return callback(null);
};

module.exports = MigrationStatusProviderFile;