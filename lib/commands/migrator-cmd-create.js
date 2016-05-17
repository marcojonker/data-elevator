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
var MigrationFileProvider = require('../data/providers/migration-file-provider.js');
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
    var config = this.getConfiguration(options);

    FileUtils.createDirectory(config.migrationsDirectory, false, function(error) {
       if(!error) {
           if(version && version.length > 0) {
               migrationsDirectory = path.join(config.migrationsDirectory, version);
                FileUtils.createDirectory(config.migrationsDirectory, false, function(error) {
                    if(!error) {
                        var migrationFile = MigrationFileProvider.getNextFile(config.migrationsDirectory, title);
                        FileUtils.copyFile(config.migrationTemplateFile, migrationFile.filePath, true, callback);
                    } else {
                        return callback(error);
                    }
                });
           } else {
                var migrationFile = MigrationFileProvider.getNextFile(config.migrationsDirectory, title);
                FileUtils.copyFile(config.migrationTemplateFile, migrationFile.filePath, true, callback);
           }
       } else {
           return callback(error);
       }
    });  
}

module.exports = MigratorCmdCreate;
