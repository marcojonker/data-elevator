/**
 * MigratorCmdCreate
 * Create new migration
 * 
**/

'use strict'

var util = require('util');
var fs = require('fs');
var path = require('path');

var MigratorCmdBase = require('./migrator-cmd-base.js');
var MigrationFileUtils = require('../utils/migration-file-utils.js');
var FileUtils = require('../utils/file-utils.js');
var StringUtils = require('../utils/string-utils.js');


/**
 * Constructor
 * @param options
 */
var MigratorCmdCreate = function(options) {
    MigratorCmdCreate.super_.apply(this, arguments);
};

util.inherits(MigratorCmdCreate, MigratorCmdBase);

/**
 * validate options for migrator function
 * @param options
 * @param callback
 */
MigratorCmdCreate.prototype.onValidateOptions = function(options, callback) {
    return callback(null);
}



/**
 * run migrator function
 * @param options
 * @param callback
 */
MigratorCmdCreate.prototype.onRun = function(options, callback) {
    var title = options['title'] ? options['title'] : null;
    var version = options['version'] ? options['version'] : null;
    var configDirectory = options['config-dir'] ? options['config-dir'] : "./data-migrator";
    var config = require(path.join(process.cwd(), configDirectory, "config.js"));    
    var migratorDirectory = config.migratorDirectory ? config.migratorDirectory : "./data-migrator";
    var migrationsDirectory = path.join(migratorDirectory, "migrations");
    var migrationTemplateFile = path.join(migratorDirectory, 'migration-template.js');

    FileUtils.createDirectory(migrationsDirectory, false, function(error) {
       if(!error) {
           if(version && version.length > 0) {
               migrationsDirectory = path.join(migrationsDirectory, version);
                FileUtils.createDirectory(migrationsDirectory, false, function(error) {
                    if(!error) {
                        var migrationFile = MigrationFileUtils.getNextFile(migrationsDirectory, title);
                        FileUtils.copyFile(migrationTemplateFile, migrationFile.filePath, true, callback);
                    } else {
                        return callback(error);
                    }
                });
           } else {
                var migrationFile = MigrationFileUtils.getNextFile(migrationsDirectory, title);
                FileUtils.copyFile(migrationTemplateFile, migrationFile.filePath, true, callback);
           }
       } else {
           return callback(error);
       }
    });  
}

module.exports = MigratorCmdCreate;