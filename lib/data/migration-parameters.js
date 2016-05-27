/**
 * MigrationParameters
 * Parameters passed into each migration
 * 
**/

'use strict'

var Errors = require('../errors/migration-errors.js');
var MigrationFile = require('./migration-file.js');
var BaseLogger = require('../logger/base-logger.js');

/**
 * Constructor
 */
var MigrationParameters = function(config, logger, migrationFile) {
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
    
    if(logger instanceof BaseLogger) {
        this.logger = logger;
    } else {
        throw Errors.invalidParameter('logger', 'BaseLogger');
    }
};

module.exports = MigrationParameters;