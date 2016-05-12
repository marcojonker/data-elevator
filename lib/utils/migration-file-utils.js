/**
 * MigrationFileUtils
 * Descripti
 * 
**/

'use strict'

var fs = require('fs');
var path = require('path');
var MigrationFile = require("./migration-file.js");
var FileUtils = require("./file-utils.js");
var StringUtils = require("./string-utils.js");

/**
 * Constructor
 */
var MigrationFileUtils = function() {
}


/**
 * Get al list of migration files sorted by identifiers
 * @param directory
 * @return array
 */
MigrationFileUtils.getMigrationFiles = function(directory) {
    var fileNames = fs.readdirSync(directory);
    var migrationFiles = [];
    
    fileNames.forEach(function(fileName) {
        var migrationFile = MigrationFile.fromPath(path.join(directory, fileName));
        if(migrationFile instanceof MigrationFile) {
            migrationFiles.push(migrationFile);
        }
    });
    
    migrationFiles.sort(function(migrationFile1, migrationFile2) {
        return migrationFile1.identifier - migrationFile2.identifier;
    });
    
    return migrationFiles;
}

/**
 * Get then next file for a migration file in a specific directory
 * @param directory
 * @param title of migration file
 */

MigrationFileUtils.getNextFile = function(directory, title) {
    var migrationFiles = MigrationFileUtils.getMigrationFiles(directory);
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


module.exports = MigrationFileUtils;