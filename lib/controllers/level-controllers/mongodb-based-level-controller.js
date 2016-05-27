/**
 * MigrationStatusHandlerMongoDb
 * Handle migrations status located in mongodb database
**/

'use strict'

var util = require('util');
var MongoClient = require('mongodb').MongoClient;

var Errors = require('../../errors/errors.js');
var BaseLevelController = require('./base-level-controller.js');

/**
 * Constructor
 */
var MongoDbBasedLevelController = function(config) {
    this.database = null;
    
    MongoDbBasedLevelController.super_.apply(this, arguments);
    
    if(!config.mongodb.connectionUrl || typeof config.mongodb.connectionUrl !== 'string' && config.mongodb.connectionUrl.length === 0) {
        throw Errors.invalidConfig('MongoDb connectionUrl missing in configuration file');
    }
};

util.inherits(MongoDbBasedLevelController, BaseLevelController);

/**
 * Get open database connection
 * @param callback(error, database)
 */
MongoDbBasedLevelController.prototype.getConnection = function(callback) {
    
    if(!this.database) {
        MongoClient.connect(this.config.mongodb.connectionUrl, this.config.mongodb.connectionOptions, function(error, database) {
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
MongoDbBasedLevelController.prototype.getCollection = function(callback) {
    var self = this;
    self.getConnection(function(error, database) {
        if(!error) {
            var collection = database.collection(self.config.mongodb.collectionName);
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
MongoDbBasedLevelController.prototype.saveCurrentLevel = function(level, callback) {
    this.getCollection(function(error, database, collection) {
        if(!error) {
            collection.findOne(null, function(error, databaseLevel) {
                if(error) {
                    return callback(Errors.systemError('Failed to get level from MongoDb database.', error));
                } else if(!databaseLevel) {
                    collection.insert(level, null, function(error, result) {
                        if(error) {
                            return callback(Errors.systemError('Failed to store level in MongoDb database.', error));
                        } else {
                            return callback(null);
                        }
                    });
                } else {
                    databaseLevel.timestamp = level.timestamp;
                    databaseLevel.identifier = level.identifier;
                    databaseLevel.direction = level.direction;
                    
                    collection.save(databaseLevel, null, function(error, result) {
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
MongoDbBasedLevelController.prototype.retrieveCurrentLevel = function(callback) {
    this.getCollection(function(error, database, collection) {
        if(!error) {
            collection.findOne(null, function(error, level) {
                if(error) {
                    return callback(Errors.systemError('Failed to get floor from MongoDb database.', error), null);
                } else {
                    return callback(null, level);
                }
            });
        } else {
            return callback(error, null);            
        }
    });
};

module.exports = MongoDbBasedLevelController;