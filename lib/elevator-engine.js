/**
 * MigrationProcessor
 * Handle the migrations 
**/

var async = require('async');
var path = require('path');

var Errors = require('./errors/migration-errors.js');
var MigrationFileSelectionOptions = require('./data/migration-file-provider.js').MigrationFileSelectionOptions;
var MigrationFileProvider = require('./data/migration-file-provider.js').MigrationFileProvider;
var MigrationParameters = require('./data/migration-parameters.js');

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
 * @result MigrationFileSelectionOptions or null if optiosn were invalid
 */
var _createMigrationOptions = function(migrationStatus, direction, identifier) {
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
    
    var options = null;
    try {
        options = MigrationFileSelectionOptions.createFromIdentifiers(fromIdentifier, toIdentifier, (direction === MigrationDirection.UP));
    } catch(error) {
    }

    return options;
}

/**
 * Migrate an array of migration files
 * @param config
 * @param direction
 * @param migrationFiles
 * @param logger
 * @param statusHandler - Object derived from MigrationStatusHandlerBase to do custom status storage
 * @param callback(error)
 */
var _migrateFiles = function(config, direction, migrationFiles, logger, statusHandler, callback) {
    var self = this;
    
    //Itterate migrations files
    async.eachSeries(migrationFiles, function(migrationFile, callback) {
        var migrationPath = path.join(process.cwd(), migrationFile.filePath);
        var migrationParameters = new MigrationParameters(config, self.logger, migrationFile);
        var migration = require(migrationPath);
        var migrationMethod = (direction === MigrationDirection.UP) ? 'onUp' : 'onDown';
        
        logger.info('>> Migrating ' + direction + ': ' + migrationFile.identifier + ' ' + migrationFile.title);
        
        //Checkf if function is available in migration file
        if(migration[migrationMethod]) {
            async.waterfall([
                function(callback) {
                    migration[migrationMethod](migrationParameters, function(error) {
                        if(error) {
                            logger.info('>> Migration FAILED: ' + migrationFile.identifier + ' ' + migrationFile.title);
                        } else {
                            logger.info('>> Migration SUCCESEEDED: ' + migrationFile.identifier + ' ' + migrationFile.title);
                        }
                        return callback(error);
                    });                
                },
                function(callback) {
                    statusHandler.saveStatus(migrationFile.identifier, direction, function(error) {
                        //Saving the status might go wrong but should not break the migration process
                        //so it is only logged
                        if(error) {
                            logger.info('>> Failed to save migrations status for migration: ' + migrationFile.identifier);
                        }
                        return callback(null);                    
                    });
                }
            ], function(error) {
                return callback(error);                    
            })
        } else {
            return callback(Errors.systemError('Invalid migrationfile: ' + migrationFile.filePath));
        }
    }, function(error) {
        return callback(error);
    })

}
/**
 * Get migration files for status
 * @param config
 * @param direction
 * @param migrationStatus
 * @param endIdentifier
 * @param callback(error, migrationFiles)
 */
var _getMigrationFiles = function(config, direction, migrationStatus, endIdentifier, callback) {
    var migrationFiles = [];
    var options = _createMigrationOptions(migrationStatus, direction, endIdentifier);
             
    if(options) {
        try{
            migrationFiles = MigrationFileProvider.getMigrationFiles(config.migrationsDirectory, options);
         } catch(error) {
            return callback(error);
         }
    }
    return callback(null, migrationFiles);    
}


/**
 * Migrate up
 * @param config
 * @param endIdentifier
 * @param callback(error)
 */
MigrationProcessor.migrateUp = function(config, endIdentifier, logger, migrationStatusHandler, callback) {
    MigrationProcessor.migrate(config, MigrationDirection.UP, endIdentifier, logger, migrationStatusHandler, callback);
};

/**
 * Migrate down
 * @param config
 * @param endIdentifier
 * @param callback(error)
 */
MigrationProcessor.migrateDown = function(config, endIdentifier, logger, migrationStatusHandler, callback) {
    MigrationProcessor.migrate(config, MigrationDirection.DOWN, endIdentifier, logger, migrationStatusHandler, callback);
};


/**
 * Migrate
 * @param config
 * @param direction
 * @param endIdentifier
 * @param logger
 * @param StatusHandler - Class derived from MigrationStatusHandlerBase to do custom status storage
 * @param callback(error)
 */
MigrationProcessor.migrate = function(config, direction, endIdentifier, logger, StatusHandler, callback) {
    var self = this;
    
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

    var statusHandler = null;
    
    //If no custom migrations status handler is defined then load a standard handler based
    //on the selected type in the configuration
    if(StatusHandler === null) {
        var statusType = config['type'].toLowerCase();
        var StatusHandler = require('./data/migration-types/' + statusType + '/migration-status-handler-' + statusType + '.js'); 
    } 
    
    //Create status handler
    try{
        statusHandler = new StatusHandler(config); 
    } catch(error) {
        return callback(error);
    }

    if(statusHandler instanceof MigrationStatusHandlerBase) {
        async.waterfall([
            //Get the current migration status
            function(callback) {
                statusHandler.retrieveStatus(function(error, migrationStatus) {
                    return callback(error, migrationStatus);  
                 })
            },
            //Get the migration files that need to be applied
            function(migrationStatus, callback) {
                _getMigrationFiles(config, direction, migrationStatus, endIdentifier, function(error, migrationFiles) {
                    return callback(error, migrationFiles);
                })
            },
            //Migrate the files
            function(migrationFiles, callback) {
                if(migrationFiles != null && migrationFiles.length > 0) {
                   _migrateFiles(config, direction, migrationFiles, logger, statusHandler, function(error) {
                        return callback(error)                    
                    })
                } else {
                    logger.info('No migrations avaliable');
                    return callback(null);
                }           
            }
        ], function(error) {
            return callback(error);
        })
    } else {
        return callback(Errors.invalidArgument('statusHandler', 'MigrationStatusHandlerBase'));
    }
}

module.exports = {
    MigrationProcessor: MigrationProcessor,
    MigrationDirection: MigrationDirection,
    MigrationType: MigrationType
};