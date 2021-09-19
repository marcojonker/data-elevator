/**
 * ElevatorBase
 * Base class for the elevator
**/

'use strict'

const path = require('path')
const async = require('async')
const Errors = require('../errors/elevator-errors.js')
const BaseLogger = require('../logger/base-logger.js')
const ConsoleLogger = require('../logger/console-logger.js')
const CommandLineParser = require('../utils/command-line-utils').CommandLineParser
const CommandLine = require('../utils/command-line-utils').CommandLine
const CommandLineArgument = require('../utils/command-line-utils').CommandLineArgument

/**
 * Constructor
 * @param logger
 * @param LevelController
 * @param moduleDir - Only used for the construct command
 */
const ElevatorBase = function (logger, LevelController, moduleDir) {
  if (logger === null) {
    this.logger = new ConsoleLogger(false)
  } else if (logger instanceof BaseLogger) {
    this.logger = logger
  } else {
    throw Errors.invalidParameter('logger', 'BaseLogger')
  }

  this.commandLineParser = null
  this.moduleDir = moduleDir
  this.LevelController = LevelController
}

/**
 * Create the command line parser
 * @return CommandLineParser object
 */
ElevatorBase.prototype.getCommandLineParser = function () {
  if (!this.commandLineParser) {
    const defaultWorkingDir = path.resolve('./data-elevator')
    const defaultArguments = [
      CommandLineArgument.stringKeyValueArgument('configDir', false, '--config-dir', '-c', null),
      CommandLineArgument.stringKeyValueArgument('workingDir', false, '--working-dir', '-w', defaultWorkingDir),
      CommandLineArgument.flagArgument('verbose', '--verbose', '-v')
    ]

    const commandLines = [
      new CommandLine([
        CommandLineArgument.stringValueArgument('command', true, ['list', 'status', 'construct', 'help', '?'])
      ], defaultArguments),
      new CommandLine([
        CommandLineArgument.stringValueArgument('command', true, ['add']),
        CommandLineArgument.stringValueArgument('name', false)
      ], defaultArguments),
      new CommandLine([
        CommandLineArgument.stringValueArgument('command', true, ['move']),
        CommandLineArgument.numberValueArgument('floor', true)
      ], defaultArguments),
      new CommandLine([
        CommandLineArgument.stringValueArgument('command', true, ['move']),
        CommandLineArgument.stringValueArgument('floor', true, ['ground', 'top'])
      ], defaultArguments)
    ]

    this.commandLineParser = new CommandLineParser(commandLines)
  }

  return this.commandLineParser
}

/**
 * Initialize components before any migration will be applied
 * @param callback(error)
 */
ElevatorBase.prototype.onInitialize = function (callback) {
  return callback(null)
}

/**
 * Uninitiailze components after all migrations have been applied
 * @param callback(error)
 */
ElevatorBase.prototype.onUnInitialize = function (callback) {
  return callback(null)
}

/**
 * Run a command
 * @param options
 * @param callback(error)
 */
ElevatorBase.prototype.runCommand = function (command, callback) {
  const self = this

  this.logger.verboseMode = command.verbose ? command.verbose : false

  let commandHandler = null
  const CommandHandler = require('../commands/elevator-cmd-' + command.command + '.js')

  if (CommandHandler) {
    commandHandler = new CommandHandler(command, this.logger, this.LevelController)
  }

  if (commandHandler !== null) {
    // Add module dir when construct command is executed so the command knows which configuration to copy
    command.moduleDir = this.moduleDir

    if (command.command === 'move') {
      // If command is up or down the run the custom initialize functon
      // which allows users to initalize custom stuff like database connections etc
      async.waterfall([
        function (callback) {
          self.onInitialize(callback)
        },
        function (callback) {
          commandHandler.run(callback)
        },
        function (callback) {
          self.onUnInitialize(callback)
        }
      ], callback)
    } else {
      commandHandler.run(function (error) {
        return callback(error)
      })
    }
  } else {
    const error = Errors.invalidCommand(command.command)
    this.logger.error(error.message)
    return callback(error)
  }
}

/**
 * run
 * @param callback(error)
 */
ElevatorBase.prototype.run = function (callback) {
  const command = this.getCommandLineParser().parse()
  if (command) {
    this.runCommand(command, callback)
  } else {
    const error = Errors.invalidCommand('Command not found or invalid argument, check the documentation.')
    this.logger.error(error.message)
    return callback(error)
  }
}

module.exports = ElevatorBase
