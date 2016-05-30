var environment = process.env.NODE_ENV ? process.env.NODE_ENV : "developent";

var config = {
    levelControllerType: "MONGODB", //Use FILE for file level controller config
    mongoDbLevelControllerConfig : {
       collectionName: "_data_elevator",
       connectionOptions: null,
       connectionUrl: null
    },
    fileLevelControllerConfig: {
        fileName: "current_level.json"
    }
}

switch(environment) {
    case "development":
        break;
}

module.exports = config;