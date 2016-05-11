/**
 * MigratorCmdUp
 * Migrate up
 * 
**/

'use strict'

var MigratorCmdBase = require('./migrator-cmd-base.js');
var util = require('util');

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
    console.log('Run migrator up');
    return callback(null);
}

module.exports = MigratorCmdUp;