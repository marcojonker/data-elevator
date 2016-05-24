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
 * Invalid argument enum error
 */
MigrationErrors.invalidArgumentEnum = function(objectName, enumClass) {
    return new Error("Argument '" + objectName + "' should be a value of enum '" + enumClass + "'");
};

module.exports = MigrationErrors;