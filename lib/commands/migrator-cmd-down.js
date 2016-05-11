/**
 * MigratorDown
 * Migrate down
 * 
**/

'use strict'

var MigratorCmdBase = require('./migrator-cmd-base.js');
var util = require('util');

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
    return callback(null);
}

/**
 * run migrator function
 * @param options
 * @param callback
 */
MigratorCmdDown.prototype.onRun = function(options, callback) {
    console.log('Run migrator down');
    return callback(null);
}

module.exports = MigratorCmdDown;