// ElevatorCmdBase
// Base elevator command class
/////////////////////////////////////////////////////

var path = require('path');
var FileUtils = require('../utils/file-utils.js').FileUtils;
var Errors = require('../errors/errors.js');

/**
 * Constructor
 * @param commandLineOptions - Command line options
 * @param logger - Instance of BaseLogger
 * @param LevelController - Class derived from BaseLevelController used for storing the current level
 */
var ElevatorCmdBase = function(commandLineOptions, logger, LevelController) {
    this.config = null;
    this.options = commandLineOptions;
    this.logger = logger;
    this.LevelController = LevelController;
}

/**
 * Validate command line options options for command
 * @param options
 * @param callback(error)
 */
ElevatorCmdBase.prototype.onValidateOptions = function(options, callback) {
    Errors.methodNotImplemented('onValidateOptions', 'ElevatorCmdBase');
}

/**
 * Run the command
 * @param options
 * @param callback(error)
 */
ElevatorCmdBase.prototype.onRun = function(options, callback) {
    throw Errors.methodNotImplemented('onRun', 'ElevatorCmdBase'); 
}

/**
 * Basic validation of commandline options
 * @param options
 * @param callback
 */
ElevatorCmdBase.prototype.validateOptions = function(options, callback) {
    this.onValidateOptions(options, callback);
}

/**
 * Get the configuration
 * @param options
 * @return config
 * @throws Error
 */
ElevatorCmdBase.prototype.getConfiguration = function(options) {
    if(!this.config) {
        var configDirectory = options['config-dir'] ? options['config-dir'] : "./data-elevator";
        var configPath = path.join(process.cwd(), configDirectory, "config.js");
 
        if(FileUtils.fileExists(configPath) === true) {
            this.config = require(configPath);    
            this.config.workingDir = this.config.workingDir ? this.config.workingDir : "./data-elevator";
            
            if(FileUtils.directoryExists(this.config.workingDir) === true) {
                this.config.floorsDir = path.join(this.config.workingDir, "floors");
                this.config.floorTemplateFile = path.join(this.config.workingDir, 'floor-template.js'); 
            } else {
                throw Errors.invalidConfig('Working directory not found: ' + this.config.workingDir);
            }
       } else {
           throw Errors.invalidConfig('Configuration not found at path: ' + configPath);
       }
    }
    return this.config;
}

/**
 * Run the command
 * @param options
 * @param callback(error)
 */
ElevatorCmdBase.prototype.run = function(callback) {
    var self = this;
    
    //Validate command line options
    self.validateOptions(self.options, function(error) {
       if(!error) {
           //Run the command
           self.onRun(self.options, function(error) {
               return callback(error);
           });
       } else {
           return callback(error);
       }
    });
}

module.exports = ElevatorCmdBase;