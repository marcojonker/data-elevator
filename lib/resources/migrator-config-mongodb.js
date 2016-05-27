var environment = process.env.NODE_ENV ? process.env.NODE_ENV : "developent";

var config = {
    environment : environment,
    connectionUrl: "",
    collectionName: "_migrations",
    type: "MONGODB",
    connectionOptions: null
}

switch(environment) {
    case "development":
        connectionUrl = "mongodb://192.168.99.100:27017/test?connectTimeoutMS=2000";
        break;
    case "production":
        config.connectionUrl = "localhost";
        break;
}

module.exports = config;