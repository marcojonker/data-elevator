var environment = process.env.NODE_ENV ? process.env.NODE_ENV : "developent";

var config = {
    environment : environment,
    connectionUrl: "",
    collectionName: "_migrations",
    type: "MONGODB"
}

switch(environment) {
    case "developent":
        config.connectionUrl = "localhost";
        break;
    case "production":
        config.connectionUrl = "localhost";
        break;
}

module.exports = config;