/**
 * MigrationStatusHandlerMongoDb
 * Handle migrations status located in mongodb database
**/

'use strict'

var util = require('util');
var MongoClient = require('mongodb').MongoClient;

var Errors = require('../../errors/migration-errors.js');
var BaseFloorController = require('./base-floor-controller.js');

/**
 * Constructor
 */
var MongoDbBasedFloorController = function(config) {
    this.database = null;
    
    MongoDbBasedFloorController.super_.apply(this, arguments);
    
    if(!config.connectionUrl || typeof config.connectionUrl !== 'string' && config.connectionUrl.length === 0) {
        throw Errors.invalidConfig('MongoDb connectionUrl missing in configuration file');
    }
};

util.inherits(MongoDbBasedFloorController, BaseFloorController);

/**
 * Get open database connection
 * @param callback(error, database)
 */
MongoDbBasedFloorController.prototype.getConnection = function(callback) {
    
    if(!this.database) {
        MongoClient.connect(this.config.connectionUrl, this.config.connectionOptions, function(error, database) {
            if(error) {
               return callback(Errors.systemError('MongoDb connection error', error), null); 
            } else {
                return callback(null, database);
            }
        });
    } else {
        return callback(null, this.database);
    }
}

/**
 * Get open database connection
 * @param callback(error, database, collection)
 */
MongoDbBasedFloorController.prototype.getCollection = function(callback) {
    var self = this;
    self.getConnection(function(error, database) {
        if(!error) {
            var collection = database.collection(self.config.collectionName);
            return callback(null, database, collection);
        } else {
            return callback(error, null, null);
        }
    });
}

/**
 * Save the migration status
 * @param identifier
 * @param direction
 * @param callback(error)
 */
MongoDbBasedFloorController.prototype.saveCurrentFloor = function(floor, callback) {
    this.getCollection(function(error, database, collection) {
        if(!error) {
            collection.findOne(null, function(error, dbFloor) {
                if(error) {
                    return callback(Errors.systemError('Failed to get floor from MongoDb database.', error));
                } else if(!floor) {
                    collection.insert(floor, null, function(error, result) {
                        if(error) {
                            return callback(Errors.systemError('Failed to store floor in MongoDb database.', error));
                        } else {
                            return callback(null);
                        }
                    });
                } else {
                    dbFloor.timestamp = floor.timestamp;
                    dbFloor.identifier = floor.identifier;
                    dbFloor.direction = floor.direction;
                    
                    collection.save(dbFloor, null, function(error, result) {
                        if(error) {
                            return callback(Errors.systemError('Failed to update floor in MongoDb database.', error));
                        } else {
                            return callback(null);
                        }
                    });
                }
            });        
        } else {
            return callback(error);            
        }
    });
};

/**
 * Retrieve the migration status
 * @param callback(error, migrationStatus)
 */
MongoDbBasedFloorController.prototype.retrieveCurrentFloor = function(callback) {
    this.getCollection(function(error, database, collection) {
        if(!error) {
            collection.findOne(null, function(error, floor) {
                if(error) {
                    return callback(Errors.systemError('Failed to get floor from MongoDb database.', error), null);
                } else {
                    return callback(null, floor);
                }
            });
        } else {
            return callback(error, null);            
        }
    });
};

module.exports = MongoDbBasedFloorController;