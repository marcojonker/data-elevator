/**
 * MigratorInit
 * Initialize new migrator
 * 
**/

'use strict'

var MigratorBase = require('./migrator-base.js');
var util = require('util');

/**
 * Constructor
 * @param options
 */
var MigratorInit = function(options) {
    MigratorInit.super_.apply(this, arguments);
};

util.inherits(MigratorInit, MigratorBase);

/**
 * validate options for migrator function
 * @param options
 * @param callback
 */
MigratorInit.prototype.onValidateOptions = function(options, callback) {
    return callback(null);
}

/**
 * run migrator function
 * @param options
 * @param callback
 */
MigratorInit.prototype.onRun = function(options, callback) {
    console.log('Run migrator init');
    return callback(null);
}

module.exports = MigratorInit;