/**
 * MigrationFileProvider
 * Data provider for migration files
**/

'use strict'

var fs = require('fs');
var path = require('path');

var Errors = require("../errors/migration-errors.js");
var MigrationFile = require("./migration-file.js");
var FileUtils = require("../utils/file-utils.js").FileUtils;
var StringUtils = require("../utils/string-utils.js");


/**
 * Selection options for selecting migration files
 */
var MigrationFileSelectionOptions = function() {
    this.identifierRange = {
        min: null,
        max: null
    }
    
    this.ascending = true;
}

/**
 * Create options for selecting migrations files
 * @param fromIdentifier - identifier from which the selection starts
 * @param toIdentifier - identifier from which the selection ends 
 * @param ascending - order of the selection 
 * @throws Error
 */
MigrationFileSelectionOptions.createFromIdentifiers = function(fromIdentifier, toIdentifier, ascending) {
    if((ascending === true && toIdentifier && fromIdentifier > toIdentifier)  ||
       (ascending === false && fromIdentifier < toIdentifier)) {
        throw Errors.invalidArguments('fromIdentifier, toIdentifier', 'Values are out of range.');
    }
    
    var options = new MigrationFileSelectionOptions();
    
    if(ascending === false && toIdentifier) {
        options.identifierRange.min = Math.min(fromIdentifier, toIdentifier);
        options.identifierRange.max = Math.max(fromIdentifier, toIdentifier);
    } else {
        options.identifierRange.min = fromIdentifier;
        options.identifierRange.max = toIdentifier;
    }
    options.ascending = ascending;
    return options;
}

/**
 * Constructor
 */
var MigrationFileProvider = function() {
}

/**
 * Get al list of migration files sorted by identifiers
 * @param directory
 * @param MigrationFileSelectionOptions
 * @return array
 * @throws error
 */
MigrationFileProvider.getMigrationFiles = function(directory, options) {    
    try {
        var fileNames = fs.readdirSync(directory);
        var migrationFiles = [];
        var ascending = (options instanceof MigrationFileSelectionOptions) ? options.ascending : true;
        var minIdentifier = (options instanceof MigrationFileSelectionOptions) ? options.identifierRange.min : null;
        var maxIdentifier = (options instanceof MigrationFileSelectionOptions) ? options.identifierRange.max : null;
        
        if((ascending === false && minIdentifier && maxIdentifier) || ascending == true) {
            fileNames.forEach(function(fileName) {
                var migrationFile = MigrationFile.fromPath(path.join(directory, fileName));
            
                if(migrationFile instanceof MigrationFile) {
                    if((!minIdentifier || minIdentifier <= migrationFile.identifier) && 
                    (!maxIdentifier || maxIdentifier >= migrationFile.identifier)) {
                    migrationFiles.push(migrationFile);
                    }
                } else {
                    throw Errors.invalidClass('migrationFile', 'MigrationFile');
                }
            });
            //Sort descending
            if(ascending === false) {
                migrationFiles.sort(function(migrationFile1, migrationFile2) {
                    return migrationFile2.identifier - migrationFile1.identifier;
                });
            //Sort ascending (default)
            } else {
                migrationFiles.sort(function(migrationFile1, migrationFile2) {
                    return migrationFile1.identifier - migrationFile2.identifier;
                });
            }
        }
    } catch(error) {
        throw Errors.systemError('Failed to get list of migration files from directory: ' + director, error);
    }      
    return migrationFiles;
}

/**
 * Get then next file for a migration file in a specific directory
 * @param directory
 * @param title of migration file
 * @throws Error
 */
MigrationFileProvider.getNextFile = function(directory, title) {
    var migrationFiles = MigrationFileProvider.getMigrationFiles(directory, null);
    var nextIdentifier = 1;

    //Update filename for next identifier if files are available
    if(migrationFiles.length > 0) {
        nextIdentifier = migrationFiles[migrationFiles.length - 1].identifier + 1;
    }

    var nextFileName = nextIdentifier;

    //Append the title if the title is valid  
    if(title && title.length > 0) {
        title = StringUtils.removeQuotes(title);
        title = FileUtils.replaceIllegalFileNameCharacters(title, "-");
        nextFileName += "_" + title;
    }

    return new MigrationFile(path.join(directory, nextFileName + ".js"), nextIdentifier, title);
}

module.exports = {
    MigrationFileProvider: MigrationFileProvider,
    MigrationFileSelectionOptions: MigrationFileSelectionOptions
}
