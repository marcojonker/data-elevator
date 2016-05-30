/**
 * Level
 * Model for level
**/

'use strict'

var Errors = require('../../errors/errors.js');

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

/**
 * Load level from a JSON string
 * @param json
 * @return Level 
 */
Level.fromJson = function(json) {
    var jsonObject = JSON.parse(json);
    var level = new Level();
    
    if(jsonObject.identifier && jsonObject.direction) {
        level.identifier = jsonObject.identifier;
        level.direction = jsonObject.direction;
        level.timestamp = jsonObject.timestamp;  
    } else {
        throw Errors.systemError('Invalid json level data');
    }
    
    return level;  
}

module.exports = Level;