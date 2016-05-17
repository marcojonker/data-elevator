
var path = require('path');

/**
 * Constructor
 * @param options
 */
var MigratorCmdBase = function(options) {
    this.debugMode = false;
    this.configuration = null;
    this.options = options;
}

/**
 * Validate the options
 * @param options
 * @param callback
 */
MigratorCmdBase.prototype.onValidateOptions = function(options, callback) {
    throw new Error('onValidateOptions not implemented');
}

MigratorCmdBase.prototype.onRun = function(options, callback) {
    throw new Error('onRun not implemented');
}

MigratorCmdBase.prototype.validateOptions = function(options, callback) {
    //Basic argument validation
    
    this.onValidateOptions(options, callback);
}

MigratorCmdBase.prototype.getConfiguration = function(options) {
    if(!this.configuration) {
        var configDirectory = options['config-dir'] ? options['config-dir'] : "./data-migrator";
        this.configuration = require(path.join(process.cwd(), configDirectory, "config.js"));    
        this.configuration.migratorDirectory = this.configuration.migratorDirectory ? this.configuration.migratorDirectory : "./data-migrator";
        var migrationsDirectory = path.join(this.configuration.migratorDirectory, "migrations");
        var migrationTemplateFile = path.join(this.configuration.migratorDirectory, 'migration-template.js'); 
        
        this.configuration.migrationsDirectory = path.join(this.configuration.migratorDirectory, "migrations");
        this.configuration.migrationTemplateFile = path.join(this.configuration.migratorDirectory, 'migration-template.js'); 
    }
    
    return this.configuration;
}

MigratorCmdBase.prototype.run = function(callback) {
    var self = this;
    self.debugMode = self.options.debug ? self.options.debug : false;
    
    self.validateOptions(self.options, function(error) {
       if(!error) {
           self.onRun(self.options, function(error) {
               return callback(error);
           });
       } else {
           return callback(error);
       }
    });
}

module.exports = MigratorCmdBase;