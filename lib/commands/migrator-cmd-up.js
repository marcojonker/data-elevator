/**
 * MigratorCmdUp
 * Migrate up
 * 
**/

'use strict'

var util = require('util');

var MigratorCmdBase = require('./migrator-cmd-base.js');
var MigrationProcessor = require('../components/migration-processor.js').MigrationProcessor;

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
    MigrationProcessor.migrateUp(this.getConfiguration(options), options['migrate-to'], callback);
}

module.exports = MigratorCmdUp;