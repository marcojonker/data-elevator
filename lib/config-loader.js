'use strict';

//Load the configuration by filename

var ConfigLoader = function(path) {
    
}

/**
 * Type of configuration. 
 * File stores the current status of the migration in a filename
 * MongoDb stores the current status of the migration in a mongo database
 */
ConfigLoader.MIGRATOR_TYPE = {
    FILE : "FILE",
    MONGODB: "MONGODB"
}

ConfigLoader.Load = function(path, environment) {
    return {
        "templateFile" : "",
        "type": "MONGODB",
        "connectionString" : ""
        
    }
}

module.exports = ConfigLoader;