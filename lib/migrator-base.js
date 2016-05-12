/**
 * MigratorBase
 * Description
 * 
**/

'use strict'

var commandLineArgs = require('command-line-args');

/**
 * Constructor
 */
var MigratorBase = function() {
};

/**
 * Initialize components before any migration will be applied
 */
MigratorBase.prototype.onInitialize = function(callback) {
    return callback(null);
};

/**
 * Uninitiailze components after all migrations have been applied
 */
MigratorBase.prototype.onUnInitialize = function(callback) {
    return callback(null);
};

/**
 * run
 */
MigratorBase.prototype.run = function(callback) {
    var self = this;
    var cli = commandLineArgs([
        { name: "command", type: String, multiple: false, defaultOption: true },
        { name: 'debug', type: Boolean },
        { name: 'type', type: String },
        { name: 'migrations-dir', type: String, default: './data-migrator'},
        { name: 'config-dir', type: String, default: './data-migrator'},
        { name: 'timestamp', alias:'t', type: String },
        { name: 'version', alias:'v', type: String },
        { name: 'title', alias: 'd', type: String }
    ]);

    var options = cli.parse();
    var commandHandler = null;
    var command = options.command ? options.command : "help";
    var CommandHandler = require('./commands/migrator-cmd-' + command + '.js');

    if(CommandHandler) {
        var commandHandler = new CommandHandler(options);

        if(commandHandler !== null) {
            if(command === 'up' || command === 'down' ) {
                self.onInitialize(function(error) {
                    if(!error) {
                        commandHandler.run(function(error) {
                            if(error) {
                                self.onUnInitialize(function(unInitializeError) {
                                    return callback(error);
                                });
                            }
                        });
                    } else {
                        return callback(error);
                    }
                });
            } else {
                commandHandler.run(function(error){
                    return callback(error);
                });
            }
        } else {
            return callback(new Error('Command not found: ' + command));
        }
    } else {
       return callback(new Error('Command not found: ' + command));
    }
}

module.exports = MigratorBase;