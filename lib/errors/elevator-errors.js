/**
 * Errors
**/
const ElevatorError = require('./elevator-error.js')

class ElevatorErrors {
  /**
   * Invalid class error
   */
  static invalidClass (objectName, expectedClass, baseError) {
    return new ElevatorError("'" + objectName + "' should be an instance of '" + expectedClass + "'", baseError)
  }

  /**
   * Invalid argument error
   */
  static invalidArgument (objectName, expectedType, baseError) {
    return new ElevatorError("Argument '" + objectName + "' should be of type '" + expectedType + "'", baseError)
  }

  /**
   * Invalid arguments error
   * @param objectNames string
   * @param message string
   */
  static invalidArguments (objectNames, message, baseError) {
    return new ElevatorError("Arguments '" + objectNames + "' are invalid. " + message, baseError)
  }

  /**
   * Invalid argument enum error
   */
  static invalidArgumentEnum (objectName, enumClass, baseError) {
    return new ElevatorError("Argument '" + objectName + "' should be a value of enum '" + enumClass + "'", baseError)
  }

  /**
   * Invalid command-line argument
   */
  static invalidCmdArgument (argumentName, exprectedType, baseError) {
    return new ElevatorError("Invalid or unknown command-line argument '" + argumentName + "', should be a value of type '" + exprectedType + "'", baseError)
  }

  /**
   * Invalid command-line command
   */
  static invalidCommand (command, baseError) {
    return new ElevatorError("Invalid or unknown command '" + command + "'", baseError)
  }

  /**
   * Invalid command-line argument enum
   */
  static invalidCmdArgumentEnum (argumentName, enumClass, baseError) {
    return new ElevatorError("Invalid or unknown command-line argument '" + argumentName + "', should be a value of enum '" + enumClass + "'", baseError)
  }

  /**
   * Invalid configuration
   */
  static invalidConfig (message, baseError) {
    return new ElevatorError(message, baseError)
  }

  /**
   * Method not implemented error
   */
  static methodNotImplemented (method, className, baseError) {
    return new ElevatorError("Method '" + method + "' not implemented for class '" + className + "'", baseError)
  }

  /**
   * General error
   */
  static generalError (message, baseError) {
    return new ElevatorError(message, baseError)
  }
}

module.exports = ElevatorErrors
