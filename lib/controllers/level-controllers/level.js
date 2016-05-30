/**
 * Level
 * Model for level
**/

'use strict'

/**
 * Constructor
 */
var Level = function() {
    this.timestamp = null;
    this.identifier = null;
    this.direction = null;
};

/**
 * Create a level
 * @param identifer
 * @param direction
 * @return Level
 */
Level.create = function(identifier, direction) {
    var level = new Level();
    level.identifier = identifier;
    level.direction = direction;
    level.timestamp = Date.now();  
    return level;  
}

module.exports = Level;