/**
 * MigratorBase
 * Description
 * 
**/

'use strict'

var commandLineArgs = require('command-line-args');

var Error = require('./errors/migration-errors.js');
var BaseLogger = require('./logger/base-logger.js');
var ConsoleLogger = require('./logger/console-logger.js');

/**
 * Constructor
 */
var MigratorBase = function(logger) {
    if(logger === null) {
        this.logger = new ConsoleLogger(false);
    } else if(logger instanceof BaseLogger) {
        this.logger = logger;
    } else {
        throw Errors.invalidParameter('logger', 'BaseLogger');
    }
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
        { name: 'type', type: String },
        { name: 'migrations-dir', type: String, default: './data-migrator'},
        { name: 'config-dir', type: String, default: './data-migrator'},
        { name: 'migrate-to', type: Number },
        { name: 'title', alias: 'd', type: String }
    ]);

    var options = cli.parse();
    var commandHandler = null;
    var command = options.command ? options.command : "help";
    var CommandHandler = require('./commands/migrator-cmd-' + command + '.js');

    if(CommandHandler) {
        var commandHandler = new CommandHandler(options, this.logger);

        if(commandHandler !== null) {
            if(command === 'up' || command === 'down' ) {
                //If command is up or down the run the custom initialize functon 
                //which allows users to initalize custom stuff like database connections etc
                self.onInitialize(function(error) {
                    if(!error) {
                        //Run the command
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