/**
 * MigrationStatusHandlerFile
 * Handle migrations status located in mongodb database
**/

'use strict'

var util = require('util');

var Errors = require('../../../errors/migration-errors.js');
var MigrationStatusHandlerBase = require('../../migration-status-handler-base.js');
var MigrationStatus = require('../../migration-status.js');

/**
 * Constructor
 */
var MigrationStatusHandlerFile = function(config) {
    MigrationStatusHandlerFile.super_.apply(this, arguments);
};

util.inherits(MigrationStatusHandlerFile, MigrationStatusHandlerBase);

/**
 * Save the migration status
 * @param identifier
 * @param direction
 * @param callback(error)
 */
MigrationStatusHandlerFile.prototype.saveStatus = function(identifier, direction, callback) {
    //TODO: implement
    return callback(null);
};

/**
 * Retrieve the migration status
 * @param callback(error, migrationStatus)
 */
MigrationStatusHandlerFile.prototype.retrieveStatus = function(callback) {
    //TODO: implement
    return callback(null);
};

module.exports = MigrationStatusHandlerFile;