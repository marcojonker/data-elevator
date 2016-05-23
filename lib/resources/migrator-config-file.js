var environment = process.env.NODE_ENV ? process.env.NODE_ENV : "development";

var config = {
    environment : environment,
    statusFilePath: "",
    type: "FILE"    
}

switch(environment) {
    case "development":
        config.statusFilePath = null;
        break;
    case "production":
        config.statusFilePath = null;
        break;
}

module.exports = config;