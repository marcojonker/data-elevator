/**
 * MigrationStatusProviderMongoDb
 * Handle migrations status located in mongodb database
**/

'use strict'

var util = require('util');
var MongoClient = require('mongodb').MongoClient;

var Errors = require('../../../errors/migration-errors.js');
var MigrationStatusProviderBase = require('../../migration-status-provider-base.js');
var MigrationStatus = require('../../models/migration-status.js');

/**
 * Constructor
 */
var MigrationStatusProviderMongoDb = function(config) {
    this.database = null;
    
    MigrationStatusProviderMongoDb.super_.apply(this, arguments);
    
    if(!config.connectionUrl || typeof config.connectionUrl !== 'string' && config.connectionUrl.length === 0) {
        throw Errors.invalidConfig('MongoDb connectionUrl missing in configuration file');
    }
};

util.inherits(MigrationStatusProviderMongoDb, MigrationStatusProviderBase);

/**
 * Get open database connection
 * @param callback(error, database)
 */
MigrationStatusProviderMongoDb.prototype.getConnection = function(callback) {
    if(!this.database) {
        MongoClient.connect(this.config.connectionUrl, function(error, database) {
            if(error) {
               return callback(MigrationErrors.systemError('MongoDb connection error', error), null); 
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
MigrationStatusProviderMongoDb.prototype.getMigrationsCollection = function(callback) {
    var self = this;
    self.getConnection(function(error, database) {
        if(!error) {
            var collection = database.collection(self.config.collectionName);
            return callback(null, database, collection);
        } else {
            return callback(MigrationErrors.systemError("Failed to get migration collection '"  + self.config.collectionName + "' from MongoDb database.", error), null, null);
        }
    });
}

/**
 * Save the migration status
 * @param identifier
 * @param direction
 * @param callback(error)
 */
MigrationStatusProviderMongoDb.prototype.saveStatus = function(identifier, direction, callback) {
    //Set current migration timestamp
    var migrationStatus = new MigrationStatus();
    migrationStatus.timestamp = Date.now();
    migrationStatus.identifier = identifier;
    migrationStatus.direction = direction;

    this.getMigrationsCollection(function(error, database, collection) {
        if(!error) {
            collection.findOne(null, function(error, dbMigrationStatus) {
                if(error) {
                    return callback(MigrationErrors.systemError('Failed to get migration status from MongoDb database.', error));
                } else if(!dbMigrationStatus) {
                    collection.insert(migrationStatus, null, function(error, result) {
                        if(error) {
                            return callback(MigrationErrors.systemError('Failed to store migration status in MongoDb database.', error));
                        } else {
                            return callback(null);
                        }
                    });
                } else {
                    dbMigrationStatus.timestamp = migrationStatus.timestamp;
                    dbMigrationStatus.identifier = migrationStatus.identifier;
                    dbMigrationStatus.direction = migrationStatus.direction;
                    
                    collection.save(dbMigrationStatus, null, function(error, result) {
                        if(error) {
                            return callback(MigrationErrors.systemError('Failed to update migration status in MongoDb database.', error));
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
MigrationStatusProviderMongoDb.prototype.retrieveStatus = function(callback) {
    this.getMigrationsCollection(function(error, database, collection) {
        if(!error) {
            collection.findOne(null, function(error, migrationStatus) {
                if(error) {
                    return callback(MigrationErrors.systemError('Failed to get migration status from MongoDb database.', error), null);
                } else {
                    return callback(null, migrationStatus);
                }
            });
        } else {
            return callback(error, null);            
        }
    });
};

module.exports = MigrationStatusProviderMongoDb;