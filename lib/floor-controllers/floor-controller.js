/**
 * FloorController
 * Manage the floors
**/
const fs = require('fs')
const path = require('path')
const Errors = require('../errors/elevator-errors.js')
const Floor = require('./floor.js')
const FileUtils = require('../utils/file-utils.js').FileUtils
const StringUtils = require('../utils/string-utils.js')

const FloorIdentifiers = {
  GROUND: 'ground',
  TOP: 'top'
}

class FloorSelectionOptions {
  /**
   * Options for selecting a range of floors
   */
  constructor () {
    this.identifierRange = {
      min: null,
      max: null
    }

    this.ascending = true
  }

  /**
   * Create options for selecting range of floors
   * @param fromIdentifier - identifier from which the selection starts
   * @param toIdentifier - identifier from which the selection ends
   * @param ascending - order of the selection
   * @return FloorSelectionOptions
   */
  static createFromIdentifiers (fromIdentifier, toIdentifier, ascending) {
    const options = new FloorSelectionOptions()

    if (toIdentifier === FloorIdentifiers.TOP) {
      options.identifierRange.min = fromIdentifier
      options.identifierRange.max = null
      options.ascending = true
    } else if (toIdentifier === FloorIdentifiers.GROUND) {
      options.identifierRange.min = 0
      options.identifierRange.max = fromIdentifier
      options.ascending = false
    } else {
      options.identifierRange.min = Math.min(fromIdentifier, toIdentifier)
      options.identifierRange.max = Math.max(fromIdentifier, toIdentifier)
      options.ascending = (toIdentifier >= fromIdentifier)
    }

    return options
  }
}

class FloorController {
  /**
   * Get al list of floors sorted by identifiers
   * @param directory
   * @param FloorSelectionOptions
   * @return array
   * @throws error
   */
  static getFloors (directory, options) {
    const floors = []

    try {
      const fileNames = fs.readdirSync(directory)
      const ascending = (options instanceof FloorSelectionOptions) ? options.ascending : true
      const minIdentifier = (options instanceof FloorSelectionOptions) ? options.identifierRange.min : null
      const maxIdentifier = (options instanceof FloorSelectionOptions) ? options.identifierRange.max : null

      // If floor select options are valid
      if ((ascending === false && minIdentifier !== undefined && minIdentifier !== null && maxIdentifier) || ascending === true) {
        // Itterate the list of floor files
        fileNames.forEach(function (fileName) {
          const floor = Floor.fromPath(path.join(directory, fileName))

          if (floor instanceof Floor) {
            if ((!minIdentifier || floor.identifier > minIdentifier) &&
              (!maxIdentifier || floor.identifier <= maxIdentifier)) {
              floors.push(floor)
            }
          } else {
            throw Errors.invalidClass('floor', 'Floor')
          }
        })
        // Sort descending
        if (ascending === false) {
          floors.sort(function (floor1, floor2) {
            return floor2.identifier - floor1.identifier
          })
          // Sort ascending (default)
        } else {
          floors.sort(function (floor1, floor2) {
            return floor1.identifier - floor2.identifier
          })
        }
      }
    } catch (error) {
      throw Errors.generalError('Failed to get list of floors from directory: ' + directory, error)
    }
    return floors
  }

  /**
   * Get the next free floor in a specific directory
   * @param directory
   * @param title of migration file
   * @throws Error
   */
  static getNextFloor (directory, name) {
    const floors = FloorController.getFloors(directory, null)
    let nextIdentifier = 1

    // Update filename for next identifier if files are available
    if (floors.length > 0) {
      nextIdentifier = floors[floors.length - 1].identifier + 1
    }

    let nextFileName = StringUtils.padCharacter(nextIdentifier, 6)

    // Append the title if the title is valid
    if (name && name.length > 0) {
      name = StringUtils.removeQuotes(name)
      name = FileUtils.replaceIllegalFileNameCharacters(name, '-')
      nextFileName += '_' + name
    }

    return new Floor(path.join(directory, nextFileName + '.js'), nextIdentifier, name)
  }
}

module.exports = {
  FloorController: FloorController,
  FloorSelectionOptions: FloorSelectionOptions,
  FloorIdentifiers: FloorIdentifiers
}
