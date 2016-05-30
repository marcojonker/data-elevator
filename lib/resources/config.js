var environment = process.env.NODE_ENV ? process.env.NODE_ENV : "developent";

var config = {
    environment : environment,
    connectionUrl: "",
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
        config.mongodb.connectionUrl = "mongodb://192.168.99.100:27017/test?connectTimeoutMS=2000";
        break;
    case "production":
        break;
}

module.exports = config;