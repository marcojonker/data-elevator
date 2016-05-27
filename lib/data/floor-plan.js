/**
 * MigrationFile
 * Migration file object
 * 
**/

'use strict'

var path = require('path');

/**
 * Constructor
 */
var MigrationFile = function(filePath, identifier, title) {
    this.filePath = filePath;
    this.identifier = identifier;
    this.title = title ? title : '';
};

/**
 * Fill migration file from path
 * @return MigrationFile (return null if path was invalid)
 */
MigrationFile.fromPath = function(filePath) {
    var migrationFile = null;
    var parsedFilePath = path.parse(filePath);
    if(parsedFilePath.ext === '.js') {
        var nameElements = parsedFilePath.name.split('_');
        if(nameElements && nameElements.length == 1 || nameElements.length == 2) {
            var identifier = parseInt(nameElements[0]);
            if(identifier) {
                var title = nameElements.length === 2 ? nameElements[1] : null;
                migrationFile = new MigrationFile(filePath, identifier, title);
            }
        }
    }
    return migrationFile;    
};

module.exports = MigrationFile;