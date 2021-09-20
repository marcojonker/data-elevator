/**
 * ElevatorError
 * Elevator error
 *
**/
class ElevatorError extends Error {
  /**
   * Constructor
   * @param message
   * @param code
   * @param baseError
   */
  constructor (message, baseError) {
    super([message])
    this.message = message
    this.baseError = baseError
  }

  /**
   * Create a log string for an error
   * @param verbose
   */
  static toLogString (error, verbose) {
    let message = (verbose === true) ? error.stack : error.message
    let baseError = error.baseError

    while (baseError) {
      message += '\r\n'

      if (verbose === true) {
        message += baseError.stack
      } else {
        message += baseError.message
      }

      baseError = baseError.baseError
    }

    return message
  }
}

module.exports = ElevatorError
