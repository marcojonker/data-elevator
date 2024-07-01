/**
 * ElevatorCmdStatus
 * Print the status of the elevator
 *
**/
const ElevatorCmdBase = require('./elevator-cmd-base.js')
const Errors = require('../errors/elevator-errors.js')
const ElevatorEngine = require('../elevator-engine/elevator-engine.js').ElevatorEngine

class ElevatorCmdStatus extends ElevatorCmdBase {
  /**
   * Validate command line options options for command
   * @param options
   * @param callback(error)
   */
  onValidateOptions (options, callback) {
    if (options.workingDir && typeof options.workingDir === 'string') {
      return callback(null)
    } else {
      const error = Errors.invalidCmdArgument('workingDir', 'string')
      this.logger.error(error)
      return callback(error)
    }
  }

  /**
   * Run the command
   * @param options
   * @param callback(error)
   */
  onRun (options, callback) {
    try {
      ElevatorEngine.printStatus(this.getConfiguration(options), this.logger, this.LevelController, function (error) {
        return callback(error)
      })
    } catch (error) {
      this.logger.error('>> Failed to print status.', error)
      return callback(error)
    }
  }
}

module.exports = ElevatorCmdStatus
