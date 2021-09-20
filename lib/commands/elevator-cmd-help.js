/**
 * MigratorCmdInit
 * Command for displaying the help file
**/

const ElevatorCmdBase = require('./elevator-cmd-base.js')
const BaseLevelController = require('../level-controllers/base-level-controller')

class ElevatorCmdHelp extends ElevatorCmdBase {
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
    if (this.LevelController.getManual) {
      this.LevelController.getManual(function (error, content) {
        if (!error) {
          console.log(content)
        }
        return callback(error)
      })
    } else {
      BaseLevelController.getManual(function (error, content) {
        if (!error) {
          console.log(content)
        }
        return callback(error)
      })
    }
  }
}
module.exports = ElevatorCmdHelp
