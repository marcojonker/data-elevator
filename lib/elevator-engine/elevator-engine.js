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

/**
 * Constructor
 */
var ElevatorEngine = function () {
}

/**
 * Get floors for selected destination
 * @param config
 * @param level
 * @param floor
 * @param callback(error, floors)
 */
var _getFloors = function (config, level, floor, callback) {
    var floors = [];
    var fromIdentifier = level ? level.identifier : null;
    var options = FloorSelectionOptions.createFromIdentifiers(fromIdentifier, floor);

    try {
        floors = FloorController.getFloors(config.floorsDir, options);
        return callback(null, floors, options);
    } catch (error) {
        return callback(error);
    }
}

/**
 * Migrate an array of migration files
 * @param config
 * @param floors
 * @param ascending
 * @param logger
 * @param levelController - Object derived from BaseLevelController to do custom level storage
 * @param callback(error)
 */
var _moveElevator = function (config, floors, ascending, logger, levelController, callback) {
    var self = this;

    //Itterate migrations files
    async.eachSeries(floors, function (floor, callback) {
        var parameters = new FloorWorkerParameters(config, logger, floor);
        var floorWorker = require(floor.filePath);
        var directionText = (ascending === true) ? 'Up' : 'Down';

        //Checkf if function is available in migration file
        if (floorWorker['on' + directionText]) {
            async.waterfall([
                function (callback) {
                    floorWorker['on' + directionText](parameters, function (error) {
                        if (error) {
                            logger.error('>>>> Stuck at floor ' + floor.getLongName());
                        } else {
                            logger.info('>>>> Migrating ' + directionText.toLowerCase() + ' floor: ' + floor.getLongName());
                        }
                        return callback(error);
                    });
                },
                function (callback) {
                    levelController.saveCurrentLevel(Level.create(floor.identifier), function (error) {
                        if (error) {
                            logger.error('>>>> Stuck at floor ' + floor.identifier + '. Failed to store the current level');
                        }
                        return callback(error);
                    });
                }
            ], function (error) {
                return callback(error);
            })
        } else {
            return callback(Errors.generalError('>>>> Invalid floor ' + floor.filePath));
        }
    }, function (error) {
        return callback(error);
    })
}

/**
 * Move elevator
 * @param config
 * @param floor
 * @param logger
 * @param LevelController - Class derived from BaseLevelController to do custom storage for current level
 * @param callback(error)
 */
ElevatorEngine.move = function (config, floor, logger, LevelController, callback) {
    var self = this;

    //Validate arguments
    if (!config) {
        return callback(Errors.invalidArgument('config', 'Object'));
    }

    if (floor === undefined || floor === null) {
        return callback(Errors.invalidArgument('floor', 'number'));
    }

    if (!LevelController) {
        return callback(Errors.generalError("Invalid argument 'LevelController' should be a class derived from 'BaseLevelController'"));
    }

    var levelController = null;

    try {
        levelController = new LevelController(config);
    } catch (error) {
        return callback(error);
    }

    if (!levelController) {
        return callback(Errors.generalError("Invalid argument 'LevelController' should be a class derived from 'BaseLevelController'"));
    }
    async.waterfall([
        //Get the current migration status
        function (callback) {
            levelController.retrieveCurrentLevel(function (error, level) {
                if (error) {
                    console.log(error);
                }
                return callback(error, level);
            })
        },
        //Get the migration files that need to be applied
        function (level, callback) {
            _getFloors(config, level, floor, function (error, floors, options) {
                if (error) {
                    console.log(error);
                }
                return callback(error, floors, options);
            })
        },
        //Migrate the files
        function (floors, options, callback) {
            if (floors != null && floors.length > 0) {
                _moveElevator(config, floors, options.ascending, logger, levelController, function (error) {
                    if (error) {
                        console.log(error);
                    }
                    return callback(error, floors, options);
                });
            } else {
                return callback(null, null, null);
            }
        },
        //Save the last level if going down, because the last level is not stored yet
        function (floors, options, callback) {
            if (floors && options && options.ascending === false) {
                levelController.saveCurrentLevel(Level.create(options.identifierRange.min), function (error) {
                    if (error) {
                        logger.error('>>>> Stuck at floor ' + options.identifierRange.min + '. Failed to store the current level.');
                    }
                    return callback(error);
                });
            } else {
                return callback(null);
            }
        }
    ], function (error) {
        return callback(error);
    })

}

/**
 * Print the status of the elevator to the logger
 * @param config
 * @param logger
 * @param LevelController
 * @param callback(error)
 */
ElevatorEngine.printStatus = function (config, logger, LevelController, callback) {
    if (!LevelController) {
        return callback(Errors.generalError("Invalid argument 'LevelController' should be a class derived from 'BaseLevelController'"));
    }

    var levelController = new LevelController(config);

    levelController.retrieveCurrentLevel(function (error, level) {
        if (error) {
            logger.error('Failed to load elevator info.', error);
        } else if (level) {
            var date = new Date(level.timestamp);
            logger.info('Currently on floor: ' + level.identifier + '. Last movement: ' + date.toLocaleString() + ".");
        } else {
            logger.info('Elevator has not yet moved.');
        }
        return callback(error);
    })
}

/**
 * Print the status of the elevator to the logger
 * @param config
 * @param logger
 * @param LevelController
 * @param callback(error)
 */
ElevatorEngine.printList = function (config, logger, LevelController, callback) {
    if (!LevelController) {
        return callback(Errors.generalError("Invalid argument 'LevelController' should be a class derived from 'BaseLevelController'"));
    }

    var levelController = new LevelController(config);

    levelController.retrieveCurrentLevel(function (error, level) {
        if (!error) {
            if (!level || level.identifier == 0) {
                logger.info(">> Floor: 0 - Ground floor");
            } else {
                logger.info("   Floor: 0 - Ground floor");
            }

            _getFloors(config, null, null, function (error, floors, options) {
                if (!error) {
                    if (floors) {
                        floors.forEach(function (floor) {
                            if (level && level.identifier == floor.identifier) {
                                logger.info(">> Floor: " + floor.getLongName());
                            } else {
                                logger.info("   Floor: " + floor.getLongName());
                            }
                        });
                        return callback(null);
                    } else {
                        logger.info("No floors available");
                        return callback(null);
                    }
                } else {
                    logger.error('Failed to load floors.', error);
                    return callback(error);
                }
            });
        } else {
            logger.error('Failed to load elevator info.', error);
            return callback(error);
        }
    });
}

module.exports = {
    ElevatorEngine: ElevatorEngine,
};