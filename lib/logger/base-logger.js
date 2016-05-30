'use strict';

var Errors = require('../errors/elevator-errors.js');

/**
 * Create a log string for an error
 * @param error
 * @param verbose
 */
var _errorToLogString = function(error, verbose) {
    var message = "";
 
    //Some errors have a base error (in case of ElevatorError for example)
    while(error) {
        message += (verbose === true && error.stack) ? error.stack : error.message;
        error = error.baseError;
        
        if(error) {
            message += "\r\n";
        } 
    }
    
    return message;
} 

/**
 * Constructor
 * @param debugMode
 */
function BaseLogger(verboseMode) {
    this.verboseMode = verboseMode ? true : false;
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
        
        result += '\r\n------------------------ DETAILS ------------------------\r\n';
        result += _errorToLogString(error, this.verboseMode);
        if(this.verboseMode === false) {
            result += "\r\n\r\nRUN THE COMMAND IN VERBOSE MODE '--verbose' or '-v' TO GET MORE DETAILS";
        }
        result += '\r\n---------------------------------------------------------\r\n';
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