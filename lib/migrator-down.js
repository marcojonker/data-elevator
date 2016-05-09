/**
 * MigratorDown
 * Migrate down
 * 
**/

'use strict'

var MigratorBase = require('./migrator-base.js');
var util = require('util');

/**
 * Constructor
 * @param options
 */
var MigratorDown = function(options) {
    MigratorDown.super_.apply(this, arguments);
};

util.inherits(MigratorDown, MigratorBase);

/**
 * validate options for migrator function
 * @param options
 * @param callback
 */
MigratorDown.prototype.onValidateOptions = function(options, callback) {
    return callback(null);
}

/**
 * run migrator function
 * @param options
 * @param callback
 */
MigratorDown.prototype.onRun = function(options, callback) {
    console.log('Run migrator down');
    return callback(null);
}

module.exports = MigratorDown;