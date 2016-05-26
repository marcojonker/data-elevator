/**
 * MigrationErrors
**/

'use strict'

/**
 * Constructor
 */
var MigrationErrors = function() {
};

/**
 * Invalid class error
 */
MigrationErrors.invalidClass = function(objectName, expectedClass) {
    return new Error("'" + objectName + "' should be an instance of '" + expectedClass + "'");
};

/**
 * Invalid argument error
 */
MigrationErrors.invalidArgument = function(objectName, expectedType) {
    return new Error("Argument '" + objectName + "' should be of type '" + expectedType + "'");
};

/**
 * Invalid arguments error
 * @param objectNames string
 * @param message string
 */
MigrationErrors.invalidArguments = function(objectNames, message) {
    return new Error("Arguments '" + objectName + "' are invalid. " + message);
};

/**
 * Invalid argument enum error
 */
MigrationErrors.invalidArgumentEnum = function(objectName, enumClass) {
    return new Error("Argument '" + objectName + "' should be a value of enum '" + enumClass + "'");
};

/**
 * Invalid command-line argument
 */
MigrationErrors.invalidCmdArgument = function(argumentName, exprectedType) {
    return new Error("Invalid or unknow command-line argment '" + argumentName + "', should be a value of type '" + exprectedType + "'");
};

/**
 * Invalid command-line argument enum
 */
MigrationErrors.invalidCmdArgumentEnum = function(argumentName, enumClass) {
    return new Error("Invalid or unknow command-line argment '" + argumentName + "', should be a value of enum '" + enumClass + "'");
};

/**
 * Invalid configuration
 */
MigrationErrors.invalidConfig = function(message) {
    return new Error(message);
}

/**
 * Method not implemented error
 */
MigrationErrors.methodNotImplemented = function(method, className) {
    return new Error("Method '" + method + "' not implemented for class '" + className + "'"); 
}

/**
 * Method not implemented error
 */
MigrationErrors.systemError = function(message, error) {
    //TODO, what to do with the embedded error
    return new Error(message); 
}

module.exports = MigrationErrors;