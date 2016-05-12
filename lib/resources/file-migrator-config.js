var environment = process.env.NODE_ENV ? process.env.NODE_ENV : "Development";

var config = {
    environment : environment,
    statusFilePath: ""
}

switch(environment) {
    case "Development":
        config.statusFilePath = null;
        break;
    case "Production":
        config.statusFilePath = null;
        break;
}

module.exports = config;