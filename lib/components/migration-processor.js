/**
 * MigrationProcessor
 * Handle the migrations 
**/

var async = require('async');
var path = require('path');

var Errors = require('./errors/migration-errors.js');
var MigrationFileProviderOptions = require('../data/providers/migration-file-provider.js').MigrationFileProviderOptions;
var MigrationFileProvider = require('../data/providers/migration-file-provider.js').MigrationFileProvider;

'use strict'

var MigrationDirection = {
    UP: "UP",
    DOWN: "DOWN"
}

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
 * @result MigrationFileProviderOptions or Error
 */
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
    
    try {
        result = MigrationFileProviderOptions.createFromIdentifiers(fromIdentifier, toIdentifier, (direction === MigrationDirection.UP));
    } catch (error) {
        result = error;
    }
    
    return result;
}

/**
 * Migrate up
 * @param config
 * @param endIdentifier
 * @param callback(error)
 */
MigrationProcessor.migrateUp = function(config, endIdentifier, callback) {
    MigrationProcessor.migrate(config, MigrationDirection.UP, endIdentifier, callback);
};

/**
 * Migrate down
 * @param config
 * @param endIdentifier
 * @param callback(error)
 */
MigrationProcessor.migrateDown = function(config, endIdentifier, callback) {
    MigrationProcessor.migrate(config, MigrationDirection.DOWN, endIdentifier, callback);
};

/**
 * Migrate
 * @param config
 * @param direction
 * @param endIdentifier
 * @param callback(error)
 */
MigrationProcessor.migrate = function(config, direction, endIdentifier, callback) {
    //Validate arguments
    if(!config) {
        throw Errors.invalidArgument('config', 'Object')
    }
    
    if(!direction || (direction != MigrationDirection.UP && direction != MigrationDirection.DOWN)) {
        throw Errors.invalidArgumentEnum('direction', 'MigrationDirection')
    }

    if(direction === MigrationDirection.DOWN && !endIdentifier) {
        throw Errors.invalidArgument('config', 'integer')
    }
    
    var self = this;
    var typeFileIdentifier = config['type'].toLowerCase();
    var StatusDataProvider = require('../data/providers/migration-status-provider-' + typeFileIdentifier + '.js');
    var MigrationParameters = require('../data/models/migration-parameters-' + typeFileIdentifier + '.js');
    var statusDataProvider = new StatusDataProvider(config); 
    
    //Retreive the current migration status
    statusDataProvider.retrieveStatus(function(error, migrationStatus) {
        
        if(error) {
            return callback(error);
        } else {
            //Get the migrations files that need to be migrated
            var options = self.createMigrationOptions(migrationStatus, direction, endIdentifier);
            var migrationFiles = MigrationFileProvider.getMigrationFiles(config.migrationsDirectory, options);
            
            //Itterate migrations files
            async.eachSeries(migrationFiles, function(migrationFile, callback) {
                
                var migrationPath = path.join(process.cwd(), migrationFile.filePath);
                var migrationParameters = new MigrationParameters(config, statusDataProvider, migrationFile);
                var migration = require(migrationPath);
                var migrationMethod = (direction === MigrationDirection.UP) ? 'onUp' : 'onDown';
                
                console.log('>> Migrating ' + direction + ': ' + migrationFile.identifier + ' ' + migrationFile.title);
                
                //Call the migration method
                migration[migrationMethod](migrationParameters, function(error) {
                    if(error) {
                        console.log('>> Migration FAILED: ' + migrationFile.identifier + ' ' + migrationFile.title);
                        return callback(error);                    
                    } else {
                        statusDataProvider.saveStatus(migrationFile.identifier, direction, function(error) {
                            console.log('>> Migration SUCCESEEDED: ' + migrationFile.identifier + ' ' + migrationFile.title);
                            if(error) {
                                console.log('>> Faile to save migrations status for migration: ', migrationFile.identifier);
                            }
                            return callback(null);                    
                        })
                    }
                });
            }, function(error) {
                return callback(error);
            })
        }
    })
}

module.exports = {
    MigrationProcessor: MigrationProcessor,
    MigrationDirection: MigrationDirection,
    MigrationType: MigrationType
};