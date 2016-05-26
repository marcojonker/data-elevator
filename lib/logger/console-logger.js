'use strict';

var util = require("util");
var BaseLogger = require("./base-logger.js");

/**
 * Constructor
 * @constructor
 */
function ConsoleLogger(verboseMode) {
    this.verboseMode = verboseMode ? true : false;
    BaseLogger.super_.apply(this, arguments);
}

util.inherits(ConsoleLogger, BaseLogger);

/**
 * Verbose message
 * @param message
 */
ConsoleLogger.prototype.verbose = function(message) {
    if(this.verboseMode === true) {
        console.info(this.formatMessage(BaseLogger.TYPE.VERBOSE, message, null));
    }
}


/**
 * Log info
 * @param message
 * @param error
 */
ConsoleLogger.prototype.info = function(message, error) {
    console.info(this.formatMessage(BaseLogger.TYPE.INFO, message, error));
}

/**
 * Log warning
 * @param message
 * @param error
 */
ConsoleLogger.prototype.warning = function(message, error) {
    console.warn(this.formatMessage(BaseLogger.TYPE.WARNING, message, error));
}

/**
 * Log error
 * @param message
 * @param error
 */
ConsoleLogger.prototype.error = function(message, error) {
    console.error(this.formatMessage(BaseLogger.TYPE.ERROR, message, error));
}

module.exports = ConsoleLogger;
