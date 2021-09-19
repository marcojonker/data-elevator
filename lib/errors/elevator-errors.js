/**
 * Errors
**/

'use strict'

const ElevatorError = require('./elevator-error.js')

/**
 * Constructor
 */
const ElevatorErrors = function () {
}

/**
 * Invalid class error
 */
ElevatorErrors.invalidClass = function (objectName, expectedClass, baseError) {
  return new ElevatorError("'" + objectName + "' should be an instance of '" + expectedClass + "'", baseError)
}

/**
 * Invalid argument error
 */
ElevatorErrors.invalidArgument = function (objectName, expectedType, baseError) {
  return new ElevatorError("Argument '" + objectName + "' should be of type '" + expectedType + "'", baseError)
}

/**
 * Invalid arguments error
 * @param objectNames string
 * @param message string
 */
ElevatorErrors.invalidArguments = function (objectNames, message, baseError) {
  return new ElevatorError("Arguments '" + objectNames + "' are invalid. " + message, baseError)
}

/**
 * Invalid argument enum error
 */
ElevatorErrors.invalidArgumentEnum = function (objectName, enumClass, baseError) {
  return new ElevatorError("Argument '" + objectName + "' should be a value of enum '" + enumClass + "'", baseError)
}

/**
 * Invalid command-line argument
 */
ElevatorErrors.invalidCmdArgument = function (argumentName, exprectedType, baseError) {
  return new ElevatorError("Invalid or unknown command-line argument '" + argumentName + "', should be a value of type '" + exprectedType + "'", baseError)
}

/**
 * Invalid command-line command
 */
ElevatorErrors.invalidCommand = function (command, baseError) {
  return new ElevatorError("Invalid or unknown command '" + command + "'", baseError)
}

/**
 * Invalid command-line argument enum
 */
ElevatorErrors.invalidCmdArgumentEnum = function (argumentName, enumClass, baseError) {
  return new ElevatorError("Invalid or unknown command-line argument '" + argumentName + "', should be a value of enum '" + enumClass + "'", baseError)
}

/**
 * Invalid configuration
 */
ElevatorErrors.invalidConfig = function (message, baseError) {
  return new ElevatorError(message, baseError)
}

/**
 * Method not implemented error
 */
ElevatorErrors.methodNotImplemented = function (method, className, baseError) {
  return new ElevatorError("Method '" + method + "' not implemented for class '" + className + "'", baseError)
}

/**
 * General error
 */
ElevatorErrors.generalError = function (message, baseError) {
  return new ElevatorError(message, baseError)
}

module.exports = ElevatorErrors
