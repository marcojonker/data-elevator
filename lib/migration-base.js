/**
 * MigrationBase
 * Base class for migrations
 * 
**/

'use strict'

/**
 * Constructor
 */
var MigrationBase = function(config, options) {
    this.config = config;
    this.options = options;
  
};

/**
 * Uninitalize general components here
 * @param config
 * @param options
 * @param callback
 */
var onInitialize = function(config, options, callback) {
    //TODO: Initialize general components here 
    return callback(null);
}

/**
 * Uninitalize general components here
 * @param config
 * @param options
 * @param callback
 */
var onUnInitialize = function(config, options, callback) {
    //TODO: Uninitalize general components here
    return callback(null); 
}

/**
 * Uninitalize general components here
 * @param config
 * @param options
 * @param callback
 */
var onUnInitialize = function(config, options, callback) {
    //TODO: Uninitalize general components here
    return callback(null); 
}

/**
 * Handle onUp
 * @param callback
 */
MigrationBase.prototype.onUp = function(callback) {
    throw new Error('onUp not implemented');
}

/**
 * Handle onDown
 * @param callback
 */
MigrationBase.prototype.onDown = function(callback) {
    throw new Error('onDown not implemented');
}


/**
 * Function
 */
MigrationBase.prototype.run = function(callback) {

    if(this.options.command === 'up') {
        
    } else if(this.options.command === 'down') {
        
    }
};

module.exports = MigrationBase;