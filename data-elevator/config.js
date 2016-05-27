var environment = process.env.NODE_ENV ? process.env.NODE_ENV : "developent";

var config = {
    environment : environment,
    connectionUrl: "",
    levelControllerType: "MONGODB", //Use FILE for file based config
    mongodb : {
        collectionName: "_floors",
        connectionOptions: null,
        connectionUrl: null
    },
    file: {
        statusFilePath: null    
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