/**
 * Floor
 * Floor object
**/
const path = require('path')

class Floor {
  /**
   * Constructor
   * @param filePath
   * @param identifier
   * @param name
   */
  constructor (filePath, identifier, name) {
    this.filePath = filePath
    this.identifier = identifier
    this.name = name || ''
  }

  /**
   * Parse file path into floor
   * @param filePath
   * @return Floor (return null if path was invalid)
   */
  static fromPath (filePath) {
    let floor = null
    const parsedFilePath = path.parse(filePath)
    if (parsedFilePath.ext === '.js') {
      const nameElements = parsedFilePath.name.split('_')
      if (nameElements && (nameElements.length === 1 || nameElements.length === 2)) {
        const identifier = parseInt(nameElements[0])
        if (identifier) {
          const name = nameElements.length === 2 ? nameElements[1] : null
          floor = new Floor(filePath, identifier, name)
        }
      }
    }
    return floor
  }

  /**
   * Get full name of the floor
   * @return string
   */
  getLongName () {
    let floorName = this.identifier

    if (this.name && this.name.length > 0) {
      floorName += ' - ' + this.name
    }

    return floorName
  }
}

module.exports = Floor
