/**
 * Level
 * Model for level
**/

'use strict'

const Errors = require('../errors/elevator-errors.js')

/**
 * Constructor
 */
const Level = function () {
  this.timestamp = null
  this.identifier = null
}

/**
 * Create a level
 * @param identifer
 * @return Level
 */
Level.create = function (identifier) {
  const level = new Level()
  level.identifier = identifier.toString()
  level.timestamp = Date.now()
  return level
}

/**
 * Load level from a JSON string
 * @param json
 * @return Level
 */
Level.fromJson = function (json) {
  const jsonObject = JSON.parse(json)
  const level = new Level()

  if (jsonObject.identifier) {
    level.identifier = jsonObject.identifier
    level.timestamp = jsonObject.timestamp
  } else {
    throw Errors.generalError('Invalid json level data')
  }

  return level
}

module.exports = Level
