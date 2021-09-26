/**
 * ElevatorBase
 * Base class for the elevator
**/
const path = require('path')
const async = require('async')
const CommandLineDirector = require('command-line-director/lib/command-line-director')
const CommandLine = require('command-line-director/lib/command-line')
const CommandLineArgumentFactory = require('command-line-director/lib/command-line-argument-factory')

const Errors = require('../errors/elevator-errors.js')
const BaseLogger = require('../logger/base-logger.js')
const ConsoleLogger = require('../logger/console-logger.js')

class ElevatorBase {
  /**
   * Constructor
   * @param logger
   * @param LevelController
   * @param moduleDir - Only used for the construct command
   */
  constructor (logger, LevelController, moduleDir) {
    if (logger === null) {
      this.logger = new ConsoleLogger(false)
    } else if (logger instanceof BaseLogger) {
      this.logger = logger
    } else {
      throw Errors.invalidParameter('logger', 'BaseLogger')
    }

    this.argumentFactory = new CommandLineArgumentFactory()
    this.CommandLineDirector = null
    this.moduleDir = moduleDir
    this.LevelController = LevelController
  }

  /**
   * Create the command line parser
   * @return CommandLineDirector object
   */
  getCommandLineDirector () {
    if (!this.CommandLineDirector) {
      const defaultWorkingDir = path.resolve('./data-elevator')
      const defaultArguments = [
        this.argumentFactory.keyValueArgument('configDir', 'Data elevator config dir (./data-elevator)', false, '--config-dir', '-c', null),
        this.argumentFactory.keyValueArgument('workingDir', 'Data elevator working dir (./data-elevator)', false, '--working-dir', '-w', defaultWorkingDir),
        this.argumentFactory.flagArgument('verbose', 'Verbose output', '--verbose', '-v')
      ]

      const commandLines = [
        new CommandLine('help', 'Help', 'Display command line help',
          [this.argumentFactory.valueArgument('command', 'Command', true, ['help', '?'])].concat(defaultArguments)),
        new CommandLine('construct', 'Construct', 'Construct a new data elevator for the current project',
          [this.argumentFactory.valueArgument('command', 'Command', true, ['construct'])].concat(defaultArguments)),
        new CommandLine('add', 'Add', 'Create a new floor (a floor is a layer of migrations)',
          [
            this.argumentFactory.valueArgument('command', 'Command', true, ['add']),
            this.argumentFactory.valueArgument('name', 'Name of the migration', false)
          ].concat(defaultArguments)),
        new CommandLine('move', 'Move', 'Move the elevator to top or ground floor',
          [
            this.argumentFactory.valueArgument('command', 'Command', true, ['move']),
            this.argumentFactory.valueArgument('floor', 'Top or ground floor', true, ['ground', 'top'])
          ].concat(defaultArguments)),
        new CommandLine('move', 'Move', 'Move the elevator to a specific floor',
          [
            this.argumentFactory.valueArgument('command', 'Command', true, ['move']),
            this.argumentFactory.valueArgument('floor', 'Level number to move to', true, null, /^\d+$/)
          ].concat(defaultArguments)),
        new CommandLine('status', 'Status', 'Display current status of the elevator',
          [
            this.argumentFactory.valueArgument('command', 'Command', true, ['status'])
          ].concat(defaultArguments)),
        new CommandLine('list', 'List', 'Display a list of all floors',
          [
            this.argumentFactory.valueArgument('command', 'Command', true, ['list'])
          ].concat(defaultArguments))
      ]

      this.CommandLineDirector = new CommandLineDirector(
        'Data elevator',
        'for migrating data sources up and down',
        commandLines)
    }

    return this.CommandLineDirector
  }

  /**
   * Initialize components before any migration will be applied
   * @param callback(error)
   */
  onInitialize (callback) {
    return callback(null)
  }

  /**
   * Uninitiailze components after all migrations have been applied
   * @param callback(error)
   */
  onUnInitialize (callback) {
    return callback(null)
  }

  /**
   * Run a command
   * @param options
   * @param callback(error)
   */
  runCommand (command, callback) {
    if (command.command === 'help') {
      console.log(this.CommandLineDirector.generateHelp())
      callback(null)
    } else {
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
            (callback) => {
              this.onInitialize(callback)
            },
            (callback) => {
              commandHandler.run(callback)
            },
            (callback) => {
              this.onUnInitialize(callback)
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
  }

  /**
   * run
   * @param callback(error)
   */
  run (callback) {
    const command = this.getCommandLineDirector().parse(true)
    if (command) {
      this.runCommand(command.values, callback)
    } else {
      const error = Errors.invalidCommand('Command not found or invalid argument, check the documentation.')
      this.logger.error(error.message)
      return callback(error)
    }
  }
}

module.exports = ElevatorBase
