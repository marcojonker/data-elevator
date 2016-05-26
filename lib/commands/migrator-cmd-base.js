// MigratorCmdBase
// Base migrator command class
/////////////////////////////////////////////////////

var path = require('path');

var FileUtils = require('../utils/file-utils.js');
var Errors = require('../errors/migration-errors.js');

/**
 * Constructor
 * @param options
 */
var MigratorCmdBase = function(commandLineOptions, logger) {
    this.config = null;
    this.options = commandLineOptions;
    this.logger = logger;
}

/**
 * Validate the options
 * @param options
 * @param callback
 */
MigratorCmdBase.prototype.onValidateOptions = function(options, callback) {
    MigrationErrors.methodNotImplemented('onValidateOptions', 'MigratorCmdBase');
}

/**
 * Run the command
 * @param options
 * @param callback
 */
MigratorCmdBase.prototype.onRun = function(options, callback) {
    throw Errors.methodNotImplemented('onRun', 'MigratorCmdBase'); 
}

/**
 * Basic validation of commandline options
 * @param options
 * @param callback
 */
MigratorCmdBase.prototype.validateOptions = function(options, callback) {
    //Basic argument validation
    
    this.onValidateOptions(options, callback);
}

/**
 * Get the configuration
 * @param options
 * @return config
 * @throws Error
 */
MigratorCmdBase.prototype.getConfiguration = function(options) {
    if(!this.config) {
        var configDirectory = options['config-dir'] ? options['config-dir'] : "./data-migrator";
        var configPath = path.join(process.cwd(), configDirectory, "config.js");
 
        if(FileUtils.fileExists(configPath) {
            this.config = require(configPath);    
            this.config.migratorDirectory = this.config.migratorDirectory ? this.config.migratorDirectory : "./data-migrator";
            
            if(FileUtils.directoryExists(this.config.migratorDirectory) === true) {
                this.config.migrationsDirectory = path.join(this.config.migratorDirectory, "migrations");
                this.config.migrationTemplateFile = path.join(this.config.migratorDirectory, 'migration-template.js'); 
            } else {
                throw Errors.invalidConfig('Migrator directory not found at path: ' + this.config.migratorDirectory);
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
 * @return configuration
 */
MigratorCmdBase.prototype.run = function(callback) {
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

module.exports = MigratorCmdBase;