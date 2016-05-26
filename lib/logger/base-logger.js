'use strict';

var Errors = require('../errors/migration-errors.js');

/**
 * Constructor
 * @constructor
 */
function BaseLogger() {
}


BaseLogger.TYPE = { 
    VERBOSE: 'VRB',
    INFO: "INF",
    WARNING: "WRN",
    ERROR: "ERR",
}

/**
 * Format the error message
 * @param type
 * @param message
 * @param error
 * @returns {*}
 */
BaseLogger.prototype.formatMessage = function(type, message, error) {
    var result = message;
    if(error) {
        result += " " + JSON.stringify(error);
    }

    if(type !== BaseLogger.TYPE.INFO) {
        result = type + ": " + result;
    }
    
    return result;
}

/**
 * verbose message
 * @param message
 * @param error
 */
BaseLogger.prototype.verbose = function(message) {
    Errors.methodNotImplemented('verbose', 'BaseLogger');
}

/**
 * Info message
 * @param message
 * @param error
 */
BaseLogger.prototype.info = function(message) {
    Errors.methodNotImplemented('info', 'BaseLogger');
}


/**
 * Log an warning message
 * @param message
 * @param error
 */
BaseLogger.prototype.warning = function(message, error) {
    Errors.methodNotImplemented('error', 'BaseLogger');
}

/**
 * Log an error message
 * @param message
 * @param error
 */
BaseLogger.prototype.error = function(message, error) {
    Errors.methodNotImplemented('error', 'BaseLogger');
}

module.exports = BaseLogger;