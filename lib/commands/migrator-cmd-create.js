/**
 * MigratorCmdCreate
 * Create new migration
 * 
**/

'use strict'

var util = require('util');
var path = require('path');

var MigratorCmdBase = require('./migrator-cmd-base.js');
var MigrationFileProvider = require('../data/providers/migration-file-provider.js').MigrationFileProvider;
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
    var title = options['title'] ? options['title'] : null;
    var version = options['version'] ? options['version'] : null;
    var config = this.getConfiguration(options);
    var migrationsDirectory = config.migrationsDirectory;
    
    //Add version to path if available
    if(version && version.length > 0) {
        migrationsDirectory = path.join(config.migrationsDirectory, version);
    }

    //Create migrations path and add file
    FileUtils.createDirectoryPath(migrationsDirectory, function(error) {
        var migrationFile = MigrationFileProvider.getNextFile(migrationsDirectory, title);
        var copyFile = new CopyFile(config.migrationTemplateFile, migrationFile.filePath, true);
        FileUtils.copyFile(copyFile, callback);
    })
}

module.exports = MigratorCmdCreate;
