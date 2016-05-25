/**
 * MigratorDown
 * Migrate down
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
        return callback(new Error("Paramenter 'migrate-to' not found or invalid number."));
    }
}

/**
 * run migrator function
 * @param options
 * @param callback
 */
MigratorCmdDown.prototype.onRun = function(options, callback) {
    MigrationProcessor.migrateDown(this.getConfiguration(options), options['migrate-to'], callback);
}

module.exports = MigratorCmdDown;