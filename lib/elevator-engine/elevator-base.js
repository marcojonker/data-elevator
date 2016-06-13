/**
 * ElevatorBase
 * Base class for the elevator
**/

'use strict'

var path = require('path');
var async = require('async');
var Errors = require('../errors/elevator-errors.js');
var BaseLogger = require('../logger/base-logger.js');
var ConsoleLogger = require('../logger/console-logger.js');
var BaseLevelController = require('../level-controllers/base-level-controller.js');
var CommandLineParser = require('../utils/command-line-utils').CommandLineParser;
var CommandLine = require('../utils/command-line-utils').CommandLine;
var CommandLineArgument = require('../utils/command-line-utils').CommandLineArgument;

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
    
    this.commandLineParser = null;
    this.moduleDir = moduleDir;
    this.LevelController = LevelController;
};

/**
 * Create the command line parser
 * @return CommandLineParser object
 */
ElevatorBase.prototype.getCommandLineParser = function() {
    if(!this.commandLineParser) {
        var defaultWorkingDir = path.resolve("./data-elevator");
        var defaultArguments = [
            CommandLineArgument.stringKeyValueArgument('configDir', false, '--config-dir', '-c', null),
            CommandLineArgument.stringKeyValueArgument('workingDir', false, '--working-dir', '-w',  defaultWorkingDir),
            CommandLineArgument.flagArgument('verbose', '--verbose', '-v')
        ];
        
        var commandLines = [
            new CommandLine([
                    CommandLineArgument.stringValueArgument('command', true, ['list', 'status', 'construct', 'help', '?']),
                ], defaultArguments),
            new CommandLine([
                    CommandLineArgument.stringValueArgument('command', true, ['add']),
                    CommandLineArgument.stringKeyValueArgument('name', false, '--name', '-n'),
                ], defaultArguments),
            new CommandLine([
                    CommandLineArgument.stringValueArgument('command', true, ['move']),
                    CommandLineArgument.numberValueArgument('floor', true),
                ], defaultArguments),
            new CommandLine([
                    CommandLineArgument.stringValueArgument('command', true, ['move']),
                    CommandLineArgument.stringValueArgument('floor', true, ['ground', 'top']),
                ], defaultArguments)
        ];
        
        this.commandLineParser = new CommandLineParser(commandLines);
    }
    
    return this.commandLineParser;
}

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
 * @param options
 * @param callback(error)
 */
ElevatorBase.prototype.runCommand = function(command, callback) {
    var self = this;
    
    this.logger.verboseMode = command.verbose ? command.verbose: false;

    var commandHandler = null;
    var CommandHandler = require('../commands/elevator-cmd-' + command.command + '.js');
    
    if(CommandHandler) {
        commandHandler = new CommandHandler(command, this.logger, this.LevelController);
    }
    
    if(commandHandler !== null) {
        //Add module dir when construct command is executed so the command knows which configuration to copy
        command['moduleDir'] = this.moduleDir;
        
        if(command.command === 'move') {
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
        var error = Errors.invalidCommand(command.command);
        this.logger.error(error.message);
        return callback(error);
    }
} 

/**
 * run
 * @param callback(error)
 */
ElevatorBase.prototype.run = function(callback) {
    var command = this.getCommandLineParser().parse();
    if(command) {
        this.runCommand(command, callback);
    } else {
        var error = Errors.invalidCommand('Command not found or invalid argument, check the documentation.');
        this.logger.error(error.message);
        return callback(error);
    }
}

module.exports = ElevatorBase;