/**
 * MigratorCmdInit
 * Initialize new migrator
 * 
**/

'use strict'

var util = require('util');
var path = require('path');

var MigratorCmdBase = require('./migrator-cmd-base.js');
var MigratorType = require('../migrator-type.js');
var FileUtils = require('../utils/file-utils.js').FileUtils;
var CopyFile = require('../utils/file-utils.js').CopyFile;
var CreateDirectory = require('../utils/file-utils.js').CreateDirectory;
var StringUtils = require('../utils/string-utils.js');

/**
 * Constructor
 * @param options
 */
var MigratorCmdInit = function(options) {
    MigratorCmdInit.super_.apply(this, arguments);
};

util.inherits(MigratorCmdInit, MigratorCmdBase);

/**
 * validate options for migrator function
 * @param options
 * @param callback
 */
MigratorCmdInit.prototype.onValidateOptions = function(options, callback) {
    if(options.type && (options.type === MigratorType.FILE || options.type === MigratorType.MONGODB)) {
        return callback(null);
    } else {
        return callback(new Error("Paramenter 'type' not found or invalid value."));
    }
}

/**
 * run migrator function
 * @param options
 * @param callback
 */
MigratorCmdInit.prototype.onRun = function(options, callback) {
    var migrationsDir = options['migrations-dir'] ? options['migrations-dir'] : './data-migrator';
    migrationsDir = StringUtils.removeQuotes(migrationsDir);
    
    //Create directory that will contain the migrations
    FileUtils.createDirectory(new CreateDirectory(migrationsDir, true), function(error) {
       if(!error) {
          var typeFileIdentifier = options['type'].toLowerCase();
          
          //Prepare files to copy
          var copyFiles = [
            new CopyFile(
                path.join(__dirname, '../resources', typeFileIdentifier + '-migration-template.js'),
                path.join(migrationsDir, 'migration-template.js'),
                true
               ),
            new CopyFile(
                path.join(__dirname, '../resources', typeFileIdentifier + '-migrator-config.js'),
                path.join(migrationsDir, 'config.js'),
                true
               ),
            new CopyFile(
                path.join(__dirname, '../resources', 'migrator.js'),
                path.join(migrationsDir, 'migrator.js'),
                true
               )
            ];
           
           //Copy the files
           FileUtils.copyFiles(copyFiles, callback);
       } else {
           return callback(error);
       }
    })
}

module.exports = MigratorCmdInit;