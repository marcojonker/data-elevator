/**
 * ElevatorBase
 * Base class for the elevator
**/

'use strict'

var path = require('path');
var async = require('async');
var commandLineArgs = require('command-line-args');
var Errors = require('../errors/elevator-errors.js');
var BaseLogger = require('../logger/base-logger.js');
var ConsoleLogger = require('../logger/console-logger.js');
var BaseLevelController = require('../level-controllers/base-level-controller.js');

/**
 * Constructor
 * @param logger
 * @param LevelController
 * @param moduleDir - Only used for the construct command
 */
var ElevatorBase = function(logger, LevelController, moduleDir) {
    if(logger === null) {
        this.logger = new ConsoleLogger(false);
    } else if(logger instanceof BaseLogger) {
        this.logger = logger;
    } else {
        throw Errors.invalidParameter('logger', 'BaseLogger');
    }
    
    this.moduleDir = moduleDir;
    this.LevelController = LevelController;
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

/**
 * Run a command
 * @param commnad
 * @param options
 * @param callback(error)
 */
ElevatorBase.prototype.runCommand = function(command, options, callback) {
    var self = this;
    var CommandHandler = require('../commands/elevator-cmd-' + command + '.js');
    var commandHandler = null;
    
    if(options['verbose'] && options['verbose'] === true) {
        this.logger.verboseMode = true;
    } 

    //Add module dir when construct command is executed so the command knows which configuration to copy
    options['module-dir'] = this.moduleDir;
    
    if(CommandHandler) {
        var commandHandler = new CommandHandler(options, this.logger, this.LevelController);

        if(commandHandler !== null) {
            
            if(command === 'up' || command === 'down' ) {
                //If command is up or down the run the custom initialize functon 
                //which allows users to initalize custom stuff like database connections etc
                async.waterfall([
                    function(callback) {
                        self.onInitialize(callback);
                    },
                    function(callback) {
                        commandHandler.run(callback);
                    },
                    function(callback) {
                        self.onUnInitialize(callback);
                    }
                ], callback);
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
    var workingDir = path.dirname(process.argv[1]);
    var cli = commandLineArgs([
        { name: "command", type: String, multiple: false, defaultOption: true },
        { name: 'working-dir', alias: 'e',  type: String},
        { name: 'config-dir', alias: 'c', type: String},
        { name: 'floor',alias: 'f', type: Number },
        { name: 'verbose',alias: 'v', type: Boolean, default: false},
        { name: 'name', alias: 'n', type: String}
    ]);

    var options = cli.parse();
    
    options.command = options.command ? options.command : "help";
    
    if(!options['working-dir']) {
        options['working-dir'] = (options.command !== "construct") ? path.dirname(process.argv[1]) : "./data-elevator";
    }
    
    this.runCommand(options.command, options, callback);
}

module.exports = ElevatorBase;