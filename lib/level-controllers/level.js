/**
 * Level
 * Model for level
**/

'use strict'

var Errors = require('../errors/elevator-errors.js');

/**
 * Constructor
 */
var Level = function() {
    this.timestamp = null;
    this.identifier = null;
};

/**
 * Create a level
 * @param identifer
 * @return Level
 */
Level.create = function(identifier) {
    var level = new Level();
    level.identifier = identifier.toString();
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
    
    if(jsonObject.identifier) {
        level.identifier = jsonObject.identifier;
        level.timestamp = jsonObject.timestamp;  
    } else {
        throw Errors.generalError('Invalid json level data');
    }
    
    return level;  
}

module.exports = Level;