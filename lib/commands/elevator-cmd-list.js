/**
 * ElevatorCmdList
 * Print list of all floors
 *
**/

const ElevatorCmdBase = require('./elevator-cmd-base.js')
const ElevatorEngine = require('../elevator-engine/elevator-engine.js').ElevatorEngine

class ElevatorCmdList extends ElevatorCmdBase {
  /**
   * Validate command line options options for command
   * @param options
   * @param callback(error)
   */
  onValidateOptions (options, callback) {
    return callback(null)
  }

  /**
   * Run the command
   * @param options
   * @param callback(error)
   */
  onRun (options, callback) {
    ElevatorEngine.printList(this.getConfiguration(options), this.logger, this.LevelController, (error) => {
      return callback(error)
    })
  }
}

module.exports = ElevatorCmdList
