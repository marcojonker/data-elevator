/**
 * MigratorCmdCreate
 * Create new migration
 * 
**/

'use strict'

var MigratorCmdBase = require('./migrator-cmd-base.js');
var util = require('util');

/**
 * Constructor
 * @param options
 */
var MigratorCmdCreate = function(options) {
    MigratorCmdCreate.super_.apply(this, arguments);
};

util.inherits(MigratorCmdCreate, MigratorCmdBase);

/**
 * validate options for migrator function
 * @param options
 * @param callback
 */
MigratorCmdCreate.prototype.onValidateOptions = function(options, callback) {
    return callback(null);
}

/**
 * run migrator function
 * @param options
 * @param callback
 */
MigratorCmdCreate.prototype.onRun = function(options, callback) {
    console.log('Run migrator create');
    return callback(null);
}

module.exports = MigratorCmdCreate;