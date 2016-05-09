/**
 * MigratorCreate
 * Create new migration
 * 
**/

'use strict'

var MigratorBase = require('./migrator-base.js');
var util = require('util');

/**
 * Constructor
 * @param options
 */
var MigratorCreate = function(options) {
    MigratorCreate.super_.apply(this, arguments);
};

util.inherits(MigratorCreate, MigratorBase);

/**
 * validate options for migrator function
 * @param options
 * @param callback
 */
MigratorCreate.prototype.onValidateOptions = function(options, callback) {
    return callback(null);
}

/**
 * run migrator function
 * @param options
 * @param callback
 */
MigratorCreate.prototype.onRun = function(options, callback) {
    console.log('Run migrator create');
    return callback(null);
}

module.exports = MigratorCreate;