/**
 * MigratorCmdCreate
 * Create new migration
 * 
**/

'use strict'

var util = require('util');

var MigratorCmdBase = require('./migrator-cmd-base.js');
var MigrationFileProvider = require('../data/migration-file-provider.js').MigrationFileProvider;
var FileUtils = require('../utils/file-utils.js').FileUtils;
var CopyFile = require('../utils/file-utils.js').CopyFile;

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
    var self = this;
    var title = options['title'] ? options['title'] : null;
    
    this.logger.info('>> Creating a new migration');
        
    try{
        var config = this.getConfiguration(options);
        
        //Create migrations path and add file
        FileUtils.createDirectoryPath(config.migrationsDirectory, function(error) {
            //Get the next migration file
            var migrationFile = MigrationFileProvider.getNextFile(config.migrationsDirectory, title);
            
            //Copy the template file to the new migration file
            FileUtils.copyFile(new CopyFile(config.migrationTemplateFile, migrationFile.filePath, true), function(error) {
                if(!error) {
                    self.logger.info('>> Migration file created: ' + migrationFile.filePath);
                }
                return callback(error);
            });
        })
    } catch(error) {
        return callback(error);
    }
}

module.exports = MigratorCmdCreate;
