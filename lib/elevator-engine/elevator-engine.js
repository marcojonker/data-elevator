/**
 * ElevatorEngine
 * The core engine of the elevator 
**/

'use strict'

var async = require('async');
var path = require('path');
var Errors = require('../errors/elevator-errors.js');
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

/**
 * Constructor
 */
var ElevatorEngine = function() {
}

/**
 * Create migration options from migration status and directions
 * @param level - current level
 * @param direction - direction
 * @param identifier - target level identifier
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
 * Get floors for selected destination
 * @param config
 * @param direction
 * @param level
 * @param endIdentifier
 * @param callback(error, floors)
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
 * Migrate an array of migration files
 * @param config
 * @param direction
 * @param floors
 * @param logger
 * @param levelController - Object derived from BaseLevelController to do custom level storage
 * @param callback(error)
 */
var _moveElevator = function(config, direction, floors, logger, levelController, callback) {
    var self = this;
    
    //Itterate migrations files
    async.eachSeries(floors, function(floor, callback) {
        var parameters = new FloorWorkerParameters(config, logger, floor);
        var floorWorker = require(floor.filePath);
        var directionMethod = (direction === ElevatorDirection.UP) ? 'onUp' : 'onDown';
       
        var message = '>>>> Moving ' + direction + ' to floor ' + floor.identifier;
        if(floor.name && floor.name.length > 0) {
            message += ' - ' + floor.name;
        }
       
        logger.info(message + '.');
        
        //Checkf if function is available in migration file
        if(floorWorker[directionMethod]) {
            async.waterfall([
                function(callback) {
                    floorWorker[directionMethod](parameters, function(error) {
                        if(error) {
                            logger.error('>>>> Stuck at floor ' + floor.identifier + '.');
                        } else {
                            logger.info('>>>> Reached floor ' + floor.identifier + '.');
                        }
                        return callback(error);
                    });                
                },
                function(callback) {
                    levelController.saveCurrentLevel(Level.create(floor.identifier, direction), function(error) {
                        if(error) {
                            logger.error('>>>> Stuck at floor ' + floor.identifier + '. Failed to store the current level.');
                        }
                        return callback(error);                    
                    });
                }
            ], function(error) {
                return callback(error);                    
            })
        } else {
            return callback(Errors.generalError('>>>> Invalid floor ' + floor.filePath));
        }
    }, function(error) {
        return callback(error);
    })
}

/**
 * Move elevator up
 * @param config
 * @param endIdentifier
 * @param callback(error)
 */
ElevatorEngine.moveUp = function(config, endIdentifier, logger, LevelController, callback) {
    ElevatorEngine.move(config, ElevatorDirection.UP, endIdentifier, logger, LevelController, callback);
};

/**
 * Move elevator down
 * @param config
 * @param endIdentifier
 * @param callback(error)
 */
ElevatorEngine.moveDown = function(config, endIdentifier, logger, LevelController, callback) {
    ElevatorEngine.move(config, ElevatorDirection.DOWN, endIdentifier, logger, LevelController, callback);
};


/**
 * Move elevator
 * @param config
 * @param direction
 * @param endIdentifier
 * @param logger
 * @param LevelController - Class derived from BaseLevelController to do custom storage for current level
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

    if(!LevelController) {
        return callback(Errors.generalError("Invalid argument 'LevelController' should be a class derived from 'BaseLevelController'"));
    }

    var levelController = new LevelController(config);

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
                    logger.info('>> Already on the right floor');
                    return callback(null);
                }           
            }
        ], function(error) {
            return callback(error);
        })
    } else {
        return callback(Errors.generalError("Invalid argument 'LevelController' should be a class derived from 'BaseLevelController'"));
    }
}

/**
 * Print the status of the elevator to the logger
 * @param config
 * @param logger
 * @param LevelController
 * @param callback(error)
 */
ElevatorEngine.printStatus = function(config, logger, LevelController, callback) {
    if(!LevelController) {
        return callback(Errors.generalError("Invalid argument 'LevelController' should be a class derived from 'BaseLevelController'"));
    }

    var levelController = new LevelController(config);
    
    levelController.retrieveCurrentLevel(function(error, level) {
        if(error) {
            logger.error('Failed to load elevator info.', error);
        } else if(level) {
            var date = new Date(level.timestamp);
            logger.info('Last moved ' + level.direction + ' to floor ' + level.identifier + ' on ' + date.toLocaleString() + ".");
        } else {
            logger.info('Elevator has not yet moved.');
        }
        return callback(error);
    })
}


module.exports = {
    ElevatorEngine: ElevatorEngine,
    ElevatorDirection: ElevatorDirection
};