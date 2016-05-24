/**
 * MigrationFileProvider
 * Data provider for migration files
**/

'use strict'

var fs = require('fs');
var path = require('path');

var Errors = require("../../components/errors/migration-errors.js");
var MigrationFile = require("../models/migration-file.js");
var FileUtils = require("../../utils/file-utils.js").FileUtils;
var StringUtils = require("../../utils/string-utils.js");

var MigrationFileProviderOptions = function() {
    this.startIdentifier = null;
    this.ascending = true;
    this.endIdentifier = null;
}

/**
 * Constructor
 */
var MigrationFileProvider = function() {
}

/**
 * Get al list of migration files sorted by identifiers
 * @param directory
 * @return array
 */
MigrationFileProvider.getMigrationFiles = function(directory, options) {    
    //TODO Handle options if avaliable
    
    var fileNames = fs.readdirSync(directory);
    var migrationFiles = [];
    
    fileNames.forEach(function(fileName) {
        var migrationFile = MigrationFile.fromPath(path.join(directory, fileName));
        
        if(migrationFile instanceof MigrationFile) {
            if((!options.startIdentifier || options.startIdentifier <= migrationFile.identifier) &&
               (!options.endIdentifier || options.endIdentifier >= migrationFile.identifier)) {
                migrationFiles.push(migrationFile);
            }
        } else {
            throw Errors.invalidClass('migrationFile', 'MigrationFile');
        }
    });
    
    //Sort descending
    if(options.ascending && options.ascending === false) {
         migrationFiles.sort(function(migrationFile1, migrationFile2) {
            return migrationFile2.identifier - migrationFile1.identifier;
        });
    //Sort ascending (default)
    } else {
        migrationFiles.sort(function(migrationFile1, migrationFile2) {
            return migrationFile1.identifier - migrationFile2.identifier;
        });
    }
    
    return migrationFiles;
}

/**
 * Get then next file for a migration file in a specific directory
 * @param directory
 * @param title of migration file
 */
MigrationFileProvider.getNextFile = function(directory, title) {
    var migrationFiles = MigrationFileProvider.getMigrationFiles(directory);
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
    MigrationFileProviderOptions: MigrationFileProviderOptions
}
