/**
 * MigratorUp
 * Migrate up
 * 
**/

'use strict'

var MigratorBase = require('./migrator-base.js');
var util = require('util');

/**
 * Constructor
 * @param options
 */
var MigratorUp = function(options) {
    MigratorUp.super_.apply(this, arguments);
};

util.inherits(MigratorUp, MigratorBase);

/**
 * validate options for migrator function
 * @param options
 * @param callback
 */
MigratorUp.prototype.onValidateOptions = function(options, callback) {
    return callback(null);
}

/**
 * run migrator function
 * @param options
 * @param callback
 */
MigratorUp.prototype.onRun = function(options, callback) {
    console.log('Run migrator up');
    return callback(null);
}

module.exports = MigratorUp;