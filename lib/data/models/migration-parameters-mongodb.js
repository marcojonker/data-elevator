/**
 * MigrationParametersMongoDb
 * Migration parameters passed into each mongodb migration
 * 
**/

'use strict'

var util = require('util');

var MigrationParametersBase = require('./migration-parameters-base.js');
var MigrationStatusProviderMongoDb = require('../providers/migration-status-provider-mongodb.js');
var Errors = require('../../components/errors/migration-errors.js')

/**
 * Constructor
 */
var MigrationParametersMongoDb = function(config, migrationStatusProvider, migrationFile) {
    MigrationParametersMongoDb.super_.apply(this, arguments);
    
    if(migrationStatusProvider instanceof MigrationStatusProviderMongoDb) {
        this.database = migrationStatusProvider.database;
    } else {
        throw Errors.invalidClass('migrationsStatusProvider', 'MigrationStatusProviderMongoDb');
    }
};

util.inherits(MigrationParametersMongoDb, MigrationParametersBase);

module.exports = MigrationParametersMongoDb;