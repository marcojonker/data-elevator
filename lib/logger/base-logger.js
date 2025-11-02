const Errors = require('../errors/elevator-errors.js')

class BaseLogger {
  /**
   * Constructor
   * @param debugMode
   */
  constructor (verboseMode) {
    this.verboseMode = !!verboseMode
  }

  static get TYPE () {
    return {
      VERBOSE: 'VRB',
      INFO: 'INF',
      WARNING: 'WRN',
      ERROR: 'ERR'
    }
  }

  /**
   * Create a log string for an error
   * @param error
   * @param verbose
   */
  _errorToLogString (error, verbose) {
    let message = ''

    // Some errors have a base error (in case of ElevatorError for example)
    while (error) {
      message += (verbose === true && error.stack) ? error.message + ': \r\n' + error.stack : error.message
      error = error.baseError

      if (error) {
        message += '\r\n'
      }
    }

    return message
  }

  /**
   * Format the error message
   * @param type
   * @param message
   * @param error
   * @returns {*}
   */
  formatMessage (type, message, error) {
    let result = message
    if (error) {
      result += '\r\n------------------------ DETAILS ------------------------\r\n'
      result += this._errorToLogString(error, this.verboseMode)
      if (this.verboseMode === false) {
        result += "\r\n\r\nRUN THE COMMAND IN VERBOSE MODE '--verbose' or '-v' TO GET MORE DETAILS"
      }
      result += '\r\n---------------------------------------------------------\r\n'
    }

    if (type !== BaseLogger.TYPE.INFO) {
      result = type + ': ' + result
    }

    return result
  }

  /**
   * verbose message
   * @param message
   * @param error
   */
  verbose (_message) {
    throw Errors.methodNotImplemented('verbose', 'BaseLogger')
  }

  /**
   * Info message
   * @param message
   * @param error
   */
  info (_message) {
    throw Errors.methodNotImplemented('info', 'BaseLogger')
  }

  /**
   * Log an warning message
   * @param message
   * @param error
   */
  warning (_message, _error) {
    throw Errors.methodNotImplemented('error', 'BaseLogger')
  }

  /**
   * Log an error message
   * @param message
   * @param error
   */
  error (_message, _error) {
    throw Errors.methodNotImplemented('error', 'BaseLogger')
  }
}

module.exports = BaseLogger
