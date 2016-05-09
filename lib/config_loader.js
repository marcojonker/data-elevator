'use strict';

//Load the configuration by filename

var ConfigLoader = function(path) {
    
}

ConfigLoader.Load = function(path, environment) {
    return {
        "templateFile" : "",
        "type": "MONGODB",
        "connectionString" : ""
        
    }
}

module.exports = ConfigLoader;