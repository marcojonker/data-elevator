// ElevatorCmdBase
// Base elevator command class
/// //////////////////////////////////////////////////

const path = require('path')
const FileUtils = require('../utils/file-utils.js').FileUtils
const Errors = require('../errors/elevator-errors.js')

class ElevatorCmdBase {
  /**
   * Constructor
   * @param options - Command line options
   * @param logger - Instance of BaseLogger
   * @param LevelController - Class derived from BaseLevelController used for storing the current level
   */
  constructor (options, logger, LevelController) {
    this.config = null
    this.options = options
    this.logger = logger
    this.LevelController = LevelController
  }

  /**
   * Validate command line options options for command
   * @param options
   * @param callback(error)
   */
  onValidateOptions (options, callback) {
    throw Errors.methodNotImplemented('onValidateOptions', 'ElevatorCmdBase')
  }

  /**
   * Run the command
   * @param options
   * @param callback(error)
   */
  onRun (options, callback) {
    throw Errors.methodNotImplemented('onRun', 'ElevatorCmdBase')
  }

  /**
   * Basic validation of commandline options
   * @param options
   * @param callback
   */
  validateOptions (options, callback) {
    if (options.command && typeof options.command === 'string') {
      this.onValidateOptions(options, callback)
    } else {
      const error = Errors.invalidCmdArgument('command', 'string')
      this.logger.error(error)
      return callback(error)
    }
  }

  /**
   * Get the configuration
   * @param options
   * @return config
   * @throws Error
   */
  getConfiguration (options) {
    if (!this.config) {
      if (options.workingDir) {
        const workingDir = path.resolve(options.workingDir)

        // Load config from command
        if (options.config) {
          this.config = options.config
        } else {
          let configDir = workingDir

          if (options.configDir) {
            configDir = path.resolve(options.configDir)
          }
          const configPath = path.join(configDir, 'config.js')

          if (FileUtils.fileExists(configPath) === true) {
            this.config = require(configPath)
          } else {
            throw Errors.invalidConfig('Configuration not found at path: ' + configPath)
          }
        }

        if (this.config) {
          this.config.workingDir = workingDir

          if (FileUtils.directoryExists(this.config.workingDir) === true) {
            this.config.floorsDir = path.join(this.config.workingDir, 'floors')
            this.config.floorTemplateFilePath = path.join(this.config.workingDir, 'floor-template.js')
          } else {
            throw Errors.invalidConfig('Working directory not found: ' + this.config.workingDir)
          }
        } else {
          throw Errors.invalidConfig('Configuration not found.')
        }
      } else {
        throw Errors.invalidConfig('Working directory not defined')
      }
    }
    return this.config
  }

  /**
   * Run the command
   * @param options
   * @param callback(error)
   */
  run (callback) {
    // Validate command line options
    this.validateOptions(this.options, (error) => {
      if (!error) {
        // Run the command
        this.onRun(this.options, (error) => {
          return callback(error)
        })
      } else {
        return callback(error)
      }
    })
  }
}

module.exports = ElevatorCmdBase
