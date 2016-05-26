/**
 * MigratorCmdUp
 * Migrate up
 * 
**/

'use strict'

var util = require('util');

var MigratorCmdBase = require('./migrator-cmd-base.js');
var MigrationProcessor = require('../migration-processor.js').MigrationProcessor;

/**
 * Constructor
 * @param options
 */
var MigratorCmdUp = function(options) {
    MigratorCmdUp.super_.apply(this, arguments);
};

util.inherits(MigratorCmdUp, MigratorCmdBase);

/**
 * validate options for migrator function
 * @param options
 * @param callback
 */
MigratorCmdUp.prototype.onValidateOptions = function(options, callback) {
    return callback(null);
}

/**
 * run migrator function
 * @param options
 * @param callback
 */
MigratorCmdUp.prototype.onRun = function(options, callback) {    
    this.logger.info('>> Migrating UP');

    MigrationProcessor.migrateUp(this.getConfiguration(options), options['migrate-to'], this.logger, callback);
}

module.exports = MigratorCmdUp;