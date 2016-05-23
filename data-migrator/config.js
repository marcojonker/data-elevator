var environment = process.env.NODE_ENV ? process.env.NODE_ENV : "development";

var config = {
    environment : environment,
    collectionName: "_migrations",
    type: "MONGODB"
}

switch(environment) {
    case "development":
        config.connectionUrl = 'mongodb://192.168.99.100:27017/test';
        break;
    case "production":
        config.connectionUrl = null;
        break;
}

module.exports = config;