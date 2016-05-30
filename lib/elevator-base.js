/**
 * ElevatorBase
 * Base class for the elevator
**/

'use strict'

var commandLineArgs = require('command-line-args');
var Errors = require('./errors/elevator-errors.js');
var BaseLogger = require('./logger/base-logger.js');
var ConsoleLogger = require('./logger/console-logger.js');
var BaseLevelController = require('./controllers/level-controllers/base-level-controller.js');


/**
 * Constructor
 * @param logger
 * @param LevelController
 */
var ElevatorBase = function(logger, LevelController) {
    if(logger === null) {
        this.logger = new ConsoleLogger(false);
    } else if(logger instanceof BaseLogger) {
        this.logger = logger;
    } else {
        throw Errors.invalidParameter('logger', 'BaseLogger');
    }
    
    //TODO werkt deze typeof?
    if(LevelController === null || LevelController instanceof BaseLevelController) {
        this.LevelController = LevelController;
    }
};

/**
 * Initialize components before any migration will be applied
 * @param callback(error)
 */
ElevatorBase.prototype.onInitialize = function(callback) {
    return callback(null);
};

/**
 * Uninitiailze components after all migrations have been applied
 * @param callback(error)
 */
ElevatorBase.prototype.onUnInitialize = function(callback) {
    return callback(null);
};
ElevatorBase.prototype.test = function() {
    console.log('test');
}
/**
 * Run a command
 * @param commnad
 * @param options
 * @param callback(error)
 */
ElevatorBase.prototype.runCommand = function(command, options, callback) {
    var CommandHandler = require('./commands/elevator-cmd-' + command + '.js');
    var commandHandler = null;

    if(options['verbose'] && options['verbose'] === true) {
        this.logger.verboseMode = true;
    } 

    if(CommandHandler) {
        var commandHandler = new CommandHandler(options, this.logger, this.LevelController);

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
            return callback(Errors.invalidCommand(command));
        }
    } else {
       return callback(Errors.invalidCommand(command));
    }
} 

/**
 * run
 * @param callback(error)
 */
ElevatorBase.prototype.run = function(callback) {
    var self = this;
    var cli = commandLineArgs([
        { name: "command", type: String, multiple: false, defaultOption: true },
        { name: 'working-dir', alias: 'e',  type: String, default: './data-elevator'},
        { name: 'config-dir', alias: 'c', type: String, default: './data-elevator'},
        { name: 'floor',alias: 'f', type: Number },
        { name: 'verbose',alias: 'v', type: Boolean, default: false},
        { name: 'name', alias: 'n', type: String}
    ]);

    var options = cli.parse();
    var command = options.command ? options.command : "help";
    this.runCommnad(command, options, callback);
}

module.exports = ElevatorBase;