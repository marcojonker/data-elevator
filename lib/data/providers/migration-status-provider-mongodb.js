/**
 * MigrationStatusProviderMongoDb
 * Handle migrations status located in mongodb database
**/

'use strict'

var util = require('util');
var MongoClient = require('mongodb').MongoClient;
var MigrationStatusProviderBase = require('./migration-status-provider-base.js');

/**
 * Constructor
 */
var MigrationStatusProviderMongoDb = function(config) {
    this.database = null;
    
    MigrationStatusProviderMongoDb.super_.apply(this, arguments);
    
    if(!config.connectionUrl || typeof config.connectionUrl !== 'string' && config.connectionUrl.length === 0) {
        throw new Error('MongoDb configuration is missing connectionUrl entry');
    }
};

util.inherits(MigrationStatusProviderMongoDb, MigrationStatusProviderBase);

/**
 * Get open database connection
 * @param callback(error, database)
 */
MigrationStatusProviderMongoDb.prototype.getConnection = function(callback) {
    if(!this.database) {
        MongoClient.connect(this.config.connectionUrl, callback);
    } else {
        return callback(null, this.database);
    }
}

/**
 * Get open database connection
 * @param callback(error, database)
 */
MigrationStatusProviderMongoDb.prototype.getMigrationsCollection = function(callback) {
    var self = this;
    self.getConnection(function(error, database) {
        if(!error) {
            var collection = database.collection(self.config.collectionName);
            return callback(null, database, collection);
        } else {
            return callback(error);
        }
    });
}


/**
 * Save the migration status
 * @param migrationStatus
 * @param callback(error)
 */
MigrationStatusProviderMongoDb.prototype.saveStatus = function(migrationStatus, callback) {
    //Set current migration timestamp
    migrationStatus.lastMigrationTimeStamp = Date.now();

    this.getMigrationsCollection(function(error, database, collection) {
        if(!error) {
            collection.findOne(null, function(error, dbMigrationStatus) {
                if(error) {
                    return callback(error);
                } else if(!dbMigrationStatus) {
                    collection.insert(migrationStatus, null, function(error, result) {
                        return callback(error);
                    });
                } else {
                    dbMigrationStatus.lastMigrationTimeStamp = migrationStatus.lastMigrationTimeStamp;
                    dbMigrationStatus.lastMigrationIdentifier = migrationStatus.lastMigrationIdentifier;
                    collection.save(dbMigrationStatus, null, function(err, result) {
                        return callback(error);
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
            collection.findOne(null, callback);
        } else {
            return callback(error);            
        }
    });
};

module.exports = MigrationStatusProviderMongoDb;