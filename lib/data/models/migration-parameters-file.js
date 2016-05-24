/**
 * MigrationParametersMongoDb
 * Migration parameters passed into each mongodb migration
 * 
**/

'use strict'

var util = require('util');

var MigrationParametersBase = require('./migration-parameters-base.js');
var MigrationStatusProviderFile = require('../providers/migration-status-provider-file.js');
var Errors = require('../../components/errors/migration-errors.js')

/**
 * Constructor
 */
var MigrationParametersMongoDb = function(config, migrationStatusProvider, migrationFile) {
    MigrationParametersMongoDb.super_.apply(this, arguments);
    
    if(migrationStatusProvider instanceof MigrationStatusProviderFile) {
        //Add additional data if needed
    } else {
        throw Errors.invalidClass('migrationsStatusProvider', 'MigrationStatusProviderFile');
    }
};

util.inherits(MigrationParametersMongoDb, MigrationParametersBase);

module.exports = MigrationParametersMongoDb;