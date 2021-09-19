/**
 * ElevatorError
 * Elevator error
 *
**/

'use strict'

const util = require('util')

/**
 * Constructor
 * @param message
 * @param code
 * @param baseError
 */
const ElevatorError = function (message, baseError) {
  ElevatorError.super_.apply(this, [message])
  this.message = message
  this.baseError = baseError
}

util.inherits(ElevatorError, Error)

/**
 * Create a log string for an error
 * @param verbose
 */
ElevatorError.toLogString = function (error, verbose) {
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

module.exports = ElevatorError
