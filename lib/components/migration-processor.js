/**
 * MigrationProcessor
 * Handle the migrations 
**/

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

MigrationProcessor.migrateUp = function(config, endIdentifier, callback) {
    MigrationProcessor.migrate(config, MigrationDirection.UP, callback);
};

MigrationProcessor.migrateDown = function(config, endIdentifier, callback) {
    MigrationProcessor.migrate(config, MigrationDirection.DOWN, callback);
};

/**
 * Function
 */
MigrationProcessor.migrate = function(config, direction, endIdentifier) {
    var typeFileIdentifier = config['type'].toLowerCase();
    var StatusDataProvider = require('../data/providers/' + typeFileIdentifier + '-migration-status-provider.js');
    var statusDataProvider = new StatusDataProvider(config); 
       
    statusDataProvider.retrieveStatus(function(error, migrationStatus) {
        //TODO, validate status (cannot go down when empty, cannot go higher the current when going down, etc)
        
        if(error) {
            return callback(error);
        } else {
            var options = new MigrationFileProviderOptions();
            options.startIdentifier = migrationStatus ? migrationStatus.lastMigrationIdentifier : null;
            options.endIdentifier = endIdentifier;
            options.ascending = (direction === MigrationDirection.UP);
            
            //Get the migrations files that need to be migrated
            var migrationFiles = MigrationFileProvider.getMigrationFiles(config.migrationsDirectory, options);
            return callback(null);
        }
    })
}

module.exports = {
    MigrationProcessor: MigrationProcessor,
    MigrationDirection: MigrationDirection,
    MigrationType: MigrationType
};