/**
 * MigratorCmdInit
 * Initialize new migrator
 * 
**/

'use strict'

var MigratorCmdBase = require('./migrator-cmd-base.js');
var util = require('util');
var path = require('path');
var ConfigLoader = require('../config-loader.js');
var FileUtils = require('../utils/file-utils.js');
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
    if(options.type && (options.type === ConfigLoader.MIGRATOR_TYPE.FILE || options.type === ConfigLoader.MIGRATOR_TYPE.MONGODB)) {
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
    FileUtils.createDirectory(migrationsDir, true, function(error) {
       if(!error) {
           var typeFileIdentifier = options['type'].toLowerCase();
           var sourceTemplateFile = path.join(__dirname, '../resources', typeFileIdentifier + '-migration-template.js');
           var destinationTemplateFile = path.join(migrationsDir, 'migration-template.js');
           var sourceConfigFile = path.join(__dirname, '../resources', typeFileIdentifier + '-migrator-config.js');
           var destinationConfigFile = path.join(migrationsDir, 'config.js');
           var sourceMigratorFile = path.join(__dirname, '../resources', 'migrator.js');
           var destinationMigratorFile = path.join(migrationsDir, 'migrator.js');

            FileUtils.copyFile(sourceTemplateFile, destinationTemplateFile, true, function(error) {
                if(!error) {
                    FileUtils.copyFile(sourceConfigFile, destinationConfigFile, true, function(error) {
                        if(!error) {
                            FileUtils.copyFile(sourceMigratorFile, destinationMigratorFile, true, function(error) {
                                if(!error) {
                                    return callback(null);
                                } else {
                                    return callback(error);
                                }
                            });
                        } else {
                            return callback(error);
                        }
                    })
                } else {
                    return callback(error);
                }
            })
       } else {
           return callback(error);
       }
    })
}

module.exports = MigratorCmdInit;