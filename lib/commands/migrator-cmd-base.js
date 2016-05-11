


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

MigratorCmdBase.prototype.getConfiguration = function(callback) {
    //Load configuration
    return callback(null, null);
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