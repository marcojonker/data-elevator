/**
 * Errors
**/

'use strict'

/**
 * Constructor
 */
var Errors = function() {
};

/**
 * Invalid class error
 */
Errors.invalidClass = function(objectName, expectedClass) {
    return new Error("'" + objectName + "' should be an instance of '" + expectedClass + "'");
};

/**
 * Invalid argument error
 */
Errors.invalidArgument = function(objectName, expectedType) {
    return new Error("Argument '" + objectName + "' should be of type '" + expectedType + "'");
};

/**
 * Invalid arguments error
 * @param objectNames string
 * @param message string
 */
Errors.invalidArguments = function(objectNames, message) {
    return new Error("Arguments '" + objectNames + "' are invalid. " + message);
};

/**
 * Invalid argument enum error
 */
Errors.invalidArgumentEnum = function(objectName, enumClass) {
    return new Error("Argument '" + objectName + "' should be a value of enum '" + enumClass + "'");
};

/**
 * Invalid command-line argument
 */
Errors.invalidCmdArgument = function(argumentName, exprectedType) {
    return new Error("Invalid or unknow command-line argment '" + argumentName + "', should be a value of type '" + exprectedType + "'");
};

/**
 * Invalid command-line command
 */
Errors.invalidCommand = function(command) {
    return new Error("Invalid or unknow command '" + command + "'");
};


/**
 * Invalid command-line argument enum
 */
Errors.invalidCmdArgumentEnum = function(argumentName, enumClass) {
    return new Error("Invalid or unknow command-line argment '" + argumentName + "', should be a value of enum '" + enumClass + "'");
};

/**
 * Invalid configuration
 */
Errors.invalidConfig = function(message) {
    return new Error(message);
}

/**
 * Method not implemented error
 */
Errors.methodNotImplemented = function(method, className) {
    return new Error("Method '" + method + "' not implemented for class '" + className + "'"); 
}

/**
 * Method not implemented error
 */
Errors.systemError = function(message, error) {
    //TODO, what to do with the embedded error
    return new Error(message); 
}

module.exports = Errors;