var environment = process.env.NODE_ENV ? process.env.NODE_ENV : "Development";

var config = {
    environment : environment,
    mongoDbUrl: ""
}

switch(environment) {
    case "Development":
        config.mongoDbUrl = "localhost";
        break;
    case "Production":
        config.mongoDbUrl = "localhost";
        break;
}

module.exports = config;