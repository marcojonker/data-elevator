/**
 * Floor
 * Floor object
**/

'use strict'

var path = require('path');

/**
 * Constructor
 * @param filePath
 * @param identifier
 * @param name
 */
var Floor = function(filePath, identifier, name) {
    this.filePath = filePath;
    this.identifier = identifier;
    this.name = name ? name : '';
};

/**
 * Parse file path into floor
 * @param filePath
 * @return Floor (return null if path was invalid)
 */
Floor.fromPath = function(filePath) {
    var floor = null;
    var parsedFilePath = path.parse(filePath);
    if(parsedFilePath.ext === '.js') {
        var nameElements = parsedFilePath.name.split('_');
        if(nameElements && nameElements.length == 1 || nameElements.length == 2) {
            var identifier = parseInt(nameElements[0]);
            if(identifier) {
                var name = nameElements.length === 2 ? nameElements[1] : null;
                floor = new Floor(filePath, identifier, name);
            }
        }
    }
    return floor;    
};

/**
 * Get full name of the floor
 * @return string
 */
Floor.prototype.getLongName = function() {
    var floorName = this.identifier;
    
    if(this.name && this.name.length > 0) {
        floorName += ' - ' + this.name;
    }

    return floorName;
}

module.exports = Floor;