/**
 * MigrationParametersBase
 * Parameters passed into each migration
 * 
**/

'use strict'

var Errors = require('../errors/migration-errors.js')

/**
 * Constructor
 */
var MigrationParametersBase = function(config, migrationFile) {
    if(config) {
        this.config = config;
    } else {
        throw Errors.invalidParameter('config', 'Object');
    }

    if(migrationFile instanceof MigrationFile) {
        this.migrationFile = migrationFile;
    } else {
        throw Errors.invalidParameter('migrationFile', 'MigrationFile');
    }
};

module.exports = MigrationParametersBase;