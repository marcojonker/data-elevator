/**
 * MongoDbLevelController
 * Store and retrieve current level from mongodb
**/

'use strict'

var util = require('util');
var MongoClient = require('mongodb').MongoClient;
var Errors = require('../../errors/elevator-errors.js');
var BaseLevelController = require('./base-level-controller.js');

/**
 * Constructor
 * @param config
 */
var MongoDbLevelController = function(config) {
    this.database = null;
    
    MongoDbLevelController.super_.apply(this, arguments);
    
    if(!config.mongoDbLevelControllerConfig.connectionUrl || typeof config.mongoDbLevelControllerConfig.connectionUrl !== 'string' && config.mongoDbLevelControllerConfig.connectionUrl.length === 0) {
        throw Errors.invalidConfig('MongoDb connectionUrl missing in configuration file');
    }
};

util.inherits(MongoDbLevelController, BaseLevelController);

/**
 * Get open database connection
 * @param callback(error, database)
 */
MongoDbLevelController.prototype.getConnection = function(callback) {
    
    if(!this.database) {
        MongoClient.connect(this.config.mongoDbLevelControllerConfig.connectionUrl, this.config.mongoDbLevelControllerConfig.connectionOptions, function(error, database) {
            if(error) {
               return callback(Errors.generalError('MongoDb connection error', error), null); 
            } else {
                return callback(null, database);
            }
        });
    } else {
        return callback(null, this.database);
    }
}

/**
 * Get thet database collection to store or retrieve the current level information from
 * @param callback(error, database, collection)
 */
MongoDbLevelController.prototype.getCollection = function(callback) {
    var self = this;
    self.getConnection(function(error, database) {
        if(!error) {
            var collection = database.collection(self.config.mongoDbLevelControllerConfig.collectionName);
            return callback(null, database, collection);
        } else {
            return callback(error, null, null);
        }
    });
}

/**
 * Save level
 * @param level
 * @param callback(error)
 */
MongoDbLevelController.prototype.saveCurrentLevel = function(level, callback) {
    this.getCollection(function(error, database, collection) {
        if(!error) {
            collection.findOne(null, function(error, databaseLevel) {
                if(error) {
                    return callback(Errors.generalError('Failed to get level from MongoDb database.', error));
                } else if(!databaseLevel) {
                    collection.insert(level, null, function(error, result) {
                        if(error) {
                            return callback(Errors.generalError('Failed to store level in MongoDb database.', error));
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
                            return callback(Errors.generalError('Failed to update the level in MongoDb database.', error));
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
 * Retrieve the current level
 * @param callback(error, level)
 */
MongoDbLevelController.prototype.retrieveCurrentLevel = function(callback) {
    this.getCollection(function(error, database, collection) {
        if(!error) {
            collection.findOne(null, function(error, level) {
                if(error) {
                    return callback(Errors.generalError('Failed to get the level from MongoDb database.', error), null);
                } else {
                    return callback(null, level);
                }
            });
        } else {
            return callback(error, null);            
        }
    });
};

module.exports = MongoDbLevelController;