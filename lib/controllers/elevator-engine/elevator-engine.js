/**
 * MigrationProcessor
 * Handle the migrations 
**/

'use strict'

var async = require('async');
var path = require('path');

var Errors = require('../../errors/errors.js');
var FloorSelectionOptions = require('../floor-controllers/floor-controller.js').FloorSelectionOptions;
var FloorController = require('../floor-controllers/floor-controller.js').FloorController;
var FloorWorkerParameters = require('./floor-worker-parameters.js');
var BaseLevelController = require('../level-controllers/base-level-controller.js');
var Level = require('../level-controllers/level.js');


//Direction Enum
var ElevatorDirection = {
    UP: "UP",
    DOWN: "DOWN"
}

//Migration type Enum
var LevelControllerType = {
    MONGODB: "MONGODB",
    FILE: "FILE"   
};

/**
 * Constructor
 */
var ElevatorEngine = function() {
}

/**
 * Create migration options from migration status and directions
 * @param migrationStatus
 * @param direction
 * @param toIdentifier
 * @result MigrationFileSelectionOptions or null if optiosn were invalid
 */
var _createFloorSelectOptions = function(level, direction, identifier) {
    var result = null;
    var fromIdentifier = null;
    var toIdentifier = identifier;
    
    if(level) {
        fromIdentifier = level.identifier;
        
        //The last handled migration has been stored as a status. If the direction is the same as the previous direction
        //then the migrations stored in the database has already been performed
        if(level.direction === ElevatorDirection.UP && direction === ElevatorDirection.UP) {
            fromIdentifier++;
        } else if(level.direction === ElevatorDirection.DOWN && direction === ElevatorDirection.DOWN) {
            fromIdentifier--;
        }
    } else {
        //Migrating down not possible when not migrated before
        if(direction === ElevatorDirection.DOWN) {
            toIdentifier = null;
        }
    }
    
    var options = null;
    try {
        options = FloorSelectionOptions.createFromIdentifiers(fromIdentifier, toIdentifier, (direction === ElevatorDirection.UP));
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
var _moveElevator = function(config, direction, floors, logger, levelController, callback) {
    var self = this;
    
    //Itterate migrations files
    async.eachSeries(floors, function(floor, callback) {
        var floorPath = path.join(process.cwd(), floor.filePath);
        var parameters = new FloorWorkerParameters(config, logger, floor);
        var floorWorker = require(floorPath);
        var directionMethod = (direction === ElevatorDirection.UP) ? 'onUp' : 'onDown';
        
        logger.info('>> Migrating ' + direction + ': ' + floor.identifier + ' ' + floor.name);
        
        //Checkf if function is available in migration file
        if(floorWorker[directionMethod]) {
            async.waterfall([
                function(callback) {
                    floorWorker[directionMethod](parameters, function(error) {
                        if(error) {
                            logger.info('>> Migration FAILED: ' + floor.identifier + ' ' + floor.name);
                        } else {
                            logger.info('>> Migration SUCCESEEDED: ' + floor.identifier + ' ' + floor.name);
                        }
                        return callback(error);
                    });                
                },
                function(callback) {
                    levelController.saveCurrentLevel(Level.create(floor.identifier, direction), function(error) {
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
            return callback(Errors.systemError('Invalid migrationfile: ' + floor.filePath));
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
var _getFloors = function(config, direction, level, endIdentifier, callback) {
    var floors = [];
    var options = _createFloorSelectOptions(level, direction, endIdentifier);
             
    if(options) {
        try{
            floors = FloorController.getFloors(config.floorsDir, options);
         } catch(error) {
            return callback(error);
         }
    }
    return callback(null, floors);    
}


/**
 * Migrate up
 * @param config
 * @param endIdentifier
 * @param callback(error)
 */
ElevatorEngine.moveUp = function(config, endIdentifier, logger, LevelController, callback) {
    ElevatorEngine.move(config, ElevatorDirection.UP, endIdentifier, logger, LevelController, callback);
};

/**
 * Migrate down
 * @param config
 * @param endIdentifier
 * @param callback(error)
 */
ElevatorEngine.moveDown = function(config, endIdentifier, logger, LevelController, callback) {
    ElevatorEngine.move(config, ElevatorDirection.DOWN, endIdentifier, logger, LevelController, callback);
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
ElevatorEngine.move = function(config, direction, endIdentifier, logger, LevelController, callback) {
    var self = this;
    
    //Validate arguments
    if(!config) {
        return callback(Errors.invalidArgument('config', 'Object'));
    }
    
    if(!direction || (direction != ElevatorDirection.UP && direction != ElevatorDirection.DOWN)) {
        return callback(Errors.invalidArgumentEnum('direction', 'ElevatorDirection'));
    }

    if(direction === ElevatorDirection.DOWN && !endIdentifier) {
        return callback(Errors.invalidArgument('config', 'integer'));
    }

    var levelController = null;
    var levelControllerType = config['levelControllerType'].toLowerCase();
    
    //If no custom migrations status handler is defined then load a standard handler based
    //on the selected type in the configuration
    if(!LevelController) {
        LevelController = require('../level-controllers/' + levelControllerType + '-based-level-controller.js'); 
    } 
    
    //Create status handler
    try{
        levelController = new LevelController(config); 
    } catch(error) {
        return callback(error);
    }

    if(levelController instanceof BaseLevelController) {
        async.waterfall([
            //Get the current migration status
            function(callback) {
                levelController.retrieveCurrentLevel(function(error, level) {
                    return callback(error, level);  
                 })
            },
            //Get the migration files that need to be applied
            function(level, callback) {
                _getFloors(config, direction, level, endIdentifier, function(error, floors) {
                    return callback(error, floors);
                })
            },
            //Migrate the files
            function(floors, callback) {
                if(floors != null && floors.length > 0) {
                   _moveElevator(config, direction, floors, logger, levelController, function(error) {
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
        return callback(Errors.invalidArgument('levelController', 'LevelController'));
    }
}

module.exports = {
    ElevatorEngine: ElevatorEngine,
    ElevatorDirection: ElevatorDirection,
    LevelControllerType: LevelControllerType
};