/**
 * MigrationProcessor
 * Handle the migrations 
**/

var async = require('async');
var path = require('path');

var Errors = require('./errors/migration-errors.js');
var MigrationFileSelectionOptions = require('./data/migration-file-provider.js').MigrationFileSelectionOptions;
var MigrationFileProvider = require('./data/migration-file-provider.js').MigrationFileProvider;

'use strict'

//Direction Enum
var MigrationDirection = {
    UP: "UP",
    DOWN: "DOWN"
}

//Migration type Enum
var MigrationType = {
    MONGODB: "MONGODB",
    FILE: "FILE"   
};

/**
 * Constructor
 */
var MigrationProcessor = function() {
}

/**
 * Create migration options from migration status and directions
 * @param migrationStatus
 * @param direction
 * @param toIdentifier
 * @result MigrationFileSelectionOptions
 * @throws Error
 */
//TODO check usage because changed to throw error
MigrationProcessor.createMigrationOptions = function(migrationStatus, direction, identifier) {
    var result = null;
    var fromIdentifier = null;
    var toIdentifier = identifier;
    
    if(migrationStatus) {
        fromIdentifier = migrationStatus.identifier;
        
        //The last handled migration has been stored as a status. If the direction is the same as the previous direction
        //then the migrations stored in the database has already been performed
        if(migrationStatus.direction === MigrationDirection.UP && direction === MigrationDirection.UP) {
            fromIdentifier++;
        } else if(migrationStatus.direction === MigrationDirection.DOWN && direction === MigrationDirection.DOWN) {
            fromIdentifier--;
        }
    } else {
        //Migrating down not possible when not migrated before
        if(direction === MigrationDirection.DOWN) {
            toIdentifier = null;
        }
    }
    
    return MigrationFileSelectionOptions.createFromIdentifiers(fromIdentifier, toIdentifier, (direction === MigrationDirection.UP));
}

/**
 * Migrate up
 * @param config
 * @param endIdentifier
 * @param callback(error)
 */
MigrationProcessor.migrateUp = function(config, endIdentifier, logger, callback) {
    MigrationProcessor.migrate(config, MigrationDirection.UP, endIdentifier, logger, callback);
};

/**
 * Migrate down
 * @param config
 * @param endIdentifier
 * @param callback(error)
 */
MigrationProcessor.migrateDown = function(config, endIdentifier, logger, callback) {
    MigrationProcessor.migrate(config, MigrationDirection.DOWN, endIdentifier, logger, callback);
};

/**
 * Migrate
 * @param config
 * @param direction
 * @param endIdentifier
 * @param callback(error)
 */
MigrationProcessor.migrate = function(config, direction, endIdentifier, logger, callback) {
    //Validate arguments
    if(!config) {
        return callback(Errors.invalidArgument('config', 'Object'));
    }
    
    if(!direction || (direction != MigrationDirection.UP && direction != MigrationDirection.DOWN)) {
        return callback(Errors.invalidArgumentEnum('direction', 'MigrationDirection'));
    }

    if(direction === MigrationDirection.DOWN && !endIdentifier) {
        return callback(Errors.invalidArgument('config', 'integer'));
    }
    
    var self = this;
    var typeFileIdentifier = config['type'].toLowerCase();
    var StatusDataProvider = require('./data/migration-types/' + typeFileIdentifier + '/migration-status-provider-' + typeFileIdentifier + '.js');
    var MigrationParameters = require('./data/migration-types/' + typeFileIdentifier + '/migration-parameters-' + typeFileIdentifier + '.js');
    var statusDataProvider = new StatusDataProvider(config); 
    
    //Retreive the current migration status
    statusDataProvider.retrieveStatus(function(error, migrationStatus) {
        
        if(error) {
            return callback(error);
        } else {
            var options = null;
            var migrationFiles = null;
            
            try{
                //Get the migrations files that need to be migrated
                options = self.createMigrationOptions(migrationStatus, direction, endIdentifier);
            } catch(error) {
                logger.info('No migrations avaialble');
                return callback(null);
            }   

            try{
                var migrationFiles = MigrationFileProvider.getMigrationFiles(config.migrationsDirectory, options);
            } catch(error) {
                return callback(error);
            }   

             if(migrationFiles != null && migrationFiles.length > 0) {
                //Itterate migrations files
                async.eachSeries(migrationFiles, function(migrationFile, callback) {
                    
                    var migrationPath = path.join(process.cwd(), migrationFile.filePath);
                    var migrationParameters = new MigrationParameters(config, statusDataProvider, migrationFile);
                    var migration = require(migrationPath);
                    var migrationMethod = (direction === MigrationDirection.UP) ? 'onUp' : 'onDown';
                    
                    logger.info('>> Migrating ' + direction + ': ' + migrationFile.identifier + ' ' + migrationFile.title);
                    
                    //Call the migration method
                    migration[migrationMethod](migrationParameters, function(error) {
                        if(error) {
                            logger.info('>> Migration FAILED: ' + migrationFile.identifier + ' ' + migrationFile.title);
                            return callback(error);                    
                        } else {
                            statusDataProvider.saveStatus(migrationFile.identifier, direction, function(error) {
                                logger.info('>> Migration SUCCESEEDED: ' + migrationFile.identifier + ' ' + migrationFile.title);
                                if(error) {
                                    logger.info('>> Faile to save migrations status for migration: ' + migrationFile.identifier);
                                }
                                return callback(null);                    
                            })
                        }
                    });
                }, function(error) {
                    return callback(error);
                })
             }else {
                 logger.info('No migrations avaliable');
             }
        }
    })
}

module.exports = {
    MigrationProcessor: MigrationProcessor,
    MigrationDirection: MigrationDirection,
    MigrationType: MigrationType
};