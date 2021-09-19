/**
 * FloorWorkerParameters
 * Parameters for passing settings the floor workers
**/

'use strict'

const Errors = require('../errors/elevator-errors.js')
const Floor = require('../floor-controllers/floor.js')
const BaseLogger = require('../logger/base-logger.js')

/**
 * Constructor
 */
const FloorWorkerParameters = function (config, logger, floor) {
  if (config) {
    this.config = config
  } else {
    throw Errors.invalidParameter('config', 'Object')
  }

  if (floor instanceof Floor) {
    this.floor = floor
  } else {
    throw Errors.invalidParameter('floor', 'Floor')
  }

  if (logger instanceof BaseLogger) {
    this.logger = logger
  } else {
    throw Errors.invalidParameter('logger', 'BaseLogger')
  }
}

module.exports = FloorWorkerParameters
