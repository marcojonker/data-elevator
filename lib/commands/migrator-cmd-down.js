/**
 * MigratorDown
 * Migrate down
 * 
**/

'use strict'

var util = require('util');

var MigratorCmdBase = require('./migrator-cmd-base.js');
var Errors = require('../errors/migration-errors.js');
var MigrationProcessor = require('../migration-processor.js').MigrationProcessor;

/**
 * Constructor
 * @param options
 */
var MigratorCmdDown = function(options) {
    MigratorCmdDown.super_.apply(this, arguments);
};

util.inherits(MigratorCmdDown, MigratorCmdBase);

/**
 * validate options for migrator function
 * @param options
 * @param callback
 */
MigratorCmdDown.prototype.onValidateOptions = function(options, callback) {
    if(options['migrate-to'] && typeof options['migrate-to'] === 'number' ) {
        return callback(null);
    } else {
        return callback(Errors.invalidCmdArgument('migrate-to', 'number');
    }
}

/**
 * run migrator function
 * @param options
 * @param callback
 */
MigratorCmdDown.prototype.onRun = function(options, callback) {
    try{ 
        MigrationProcessor.migrateDown(this.getConfiguration(options), options['migrate-to'], callback);
    } catch(error) {
        return callback(error);
    } 
}

module.exports = MigratorCmdDown;