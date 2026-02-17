/**
 * ElevatorCmdMove
 * Command for moving the elevator down
 *
**/
const ElevatorCmdBase = require('./elevator-cmd-base.js')
const Errors = require('../errors/elevator-errors.js')
const ElevatorEngine = require('../elevator-engine/elevator-engine.js').ElevatorEngine

class ElevatorCmdMove extends ElevatorCmdBase {
  /**
   * Validate command line options options for command
   * @param options
   * @param callback(error)
   */
  onValidateOptions (options, callback) {
    if (options.workingDir && typeof options.workingDir === 'string') {
      if (options.floor) {
        return callback(null)
      } else {
        const floorError = Errors.invalidCmdArgument('floor', 'number')
        this.logger.error(floorError)
        return callback(floorError)
      }
    } else {
      const workingDirError = Errors.invalidCmdArgument('workingDir', 'string')
      this.logger.error(workingDirError)
      return callback(workingDirError)
    }
  }

  /**
   * Run the command
   * @param options
   * @param callback(error)
   */
  onRun (options, callback) {
    const count = options.count ? options.count : 1
    ElevatorEngine.move(this.getConfiguration(options), options.floor, count, this.logger, this.LevelController, (error) => {
      if (error) {
        this.logger.error('>> Elevator could not reach the destination.', error)
      } else {
        if (options.floor === 'top') {
          this.logger.info('>> Top floor reached')
        } else if (options.floor === 'ground') {
          this.logger.info('>> Ground floor reached')
        } else if (options.floor === 'up') {
          this.logger.info('>> Elevator went ' + count + ' floors up')
        } else if (options.floor === 'down') {
          this.logger.info('>> Elevator went ' + count + ' floors down')
        } else {
          this.logger.info('>> Flossor ' + options.floor + ' reached')
        }
      }
      return callback(error)
    })
  }
}

module.exports = ElevatorCmdMove
