/**
 * FloorController
 * Manage the floors
**/

'use strict'

var fs = require('fs');
var path = require('path');
var Errors = require("../errors/elevator-errors.js");
var Floor = require("./floor.js");
var FileUtils = require("../utils/file-utils.js").FileUtils;
var StringUtils = require("../utils/string-utils.js");

var FloorIdentifiers = {
    GROUND: 'ground',
    TOP: 'top'
}

/**
 * Options for selecting a range of floors
 */
var FloorSelectionOptions = function() {
    this.identifierRange = {
        min: null,
        max: null
    }
    
    this.ascending = true;
}

/**
 * Create options for selecting range of floors
 * @param fromIdentifier - identifier from which the selection starts
 * @param toIdentifier - identifier from which the selection ends 
 * @param ascending - order of the selection 
 * @return FloorSelectionOptions
 */
FloorSelectionOptions.createFromIdentifiers = function(fromIdentifier, toIdentifier, ascending) {
    var options = new FloorSelectionOptions();

    if(toIdentifier === FloorIdentifiers.TOP) {
        options.identifierRange.min = fromIdentifier;
        options.identifierRange.max = null;
        options.ascending = true;
    } else if (toIdentifier === FloorIdentifiers.GROUND) {
        options.identifierRange.min = 0;
        options.identifierRange.max = fromIdentifier;
        options.ascending = false;
    } else{
        options.identifierRange.min = Math.min(fromIdentifier, toIdentifier);
        options.identifierRange.max = Math.max(fromIdentifier, toIdentifier);
        options.ascending = (toIdentifier >= fromIdentifier);
    }

    return options;
}

/**
 * Constructor
 */
var FloorController = function() {
}

/**
 * Get al list of floors sorted by identifiers
 * @param directory
 * @param FloorSelectionOptions
 * @return array
 * @throws error
 */
FloorController.getFloors = function(directory, options) {    
    try {
        var fileNames = fs.readdirSync(directory);
        var floors = [];
        var ascending = (options instanceof FloorSelectionOptions) ? options.ascending : true;
        var minIdentifier = (options instanceof FloorSelectionOptions) ? options.identifierRange.min : null;
        var maxIdentifier = (options instanceof FloorSelectionOptions) ? options.identifierRange.max : null;
        
        //If floor select options are valid
        if((ascending === false && minIdentifier != undefined && minIdentifier != null && maxIdentifier) || ascending == true) {
            
            //Itterate the list of floor files
            fileNames.forEach(function(fileName) {
                var floor = Floor.fromPath(path.join(directory, fileName));
            
                if(floor instanceof Floor) {
                    if((!minIdentifier || floor.identifier > minIdentifier) && 
                       (!maxIdentifier || floor.identifier <= maxIdentifier)) {
                        floors.push(floor);
                    }
                } else {
                    throw Errors.invalidClass('floor', 'Floor');
                }
            });
            //Sort descending
            if(ascending === false) {
                floors.sort(function(floor1, floor2) {
                    return floor2.identifier - floor1.identifier;
                });
            //Sort ascending (default)
            } else {
                floors.sort(function(floor1, floor2) {
                    return floor1.identifier - floor2.identifier;
                });
            }
        }
    } catch(error) {
        throw Errors.generalError('Failed to get list of floors from directory: ' + directory, error);
    }      
    return floors;
}

/**
 * Get the next free floor in a specific directory
 * @param directory
 * @param title of migration file
 * @throws Error
 */
FloorController.getNextFloor = function(directory, name) {
    var floors = FloorController.getFloors(directory, null);
    var nextIdentifier = 1;

    //Update filename for next identifier if files are available
    if(floors.length > 0) {
        nextIdentifier = floors[floors.length - 1].identifier + 1;
    }

    var nextFileName = StringUtils.padCharacter(nextIdentifier, 6);

    //Append the title if the title is valid  
    if(name && name.length > 0) {
        name = StringUtils.removeQuotes(name);
        name = FileUtils.replaceIllegalFileNameCharacters(name, "-");
        nextFileName += "_" + name;
    }

    return new Floor(path.join(directory, nextFileName + ".js"), nextIdentifier, name);
}

module.exports = {
    FloorController: FloorController,
    FloorSelectionOptions: FloorSelectionOptions,
    FloorIdentifiers: FloorIdentifiers
}
