const BaseLogger = require('./base-logger.js')

class ConsoleLogger extends BaseLogger {
  /**
   * Verbose message
   * @param message
   */
  verbose (message) {
    if (this.verboseMode === true) {
      console.info(this.formatMessage(BaseLogger.TYPE.VERBOSE, message, null))
    }
  }

  /**
   * Log info
   * @param message
   * @param error
   */
  info (message, error) {
    console.info(this.formatMessage(BaseLogger.TYPE.INFO, message, error))
  }

  /**
   * Log warning
   * @param message
   * @param error
   */
  warning (message, error) {
    console.warn(this.formatMessage(BaseLogger.TYPE.WARNING, message, error))
  }

  /**
   * Log error
   * @param message
   * @param error
   */
  error (message, error) {
    console.error(this.formatMessage(BaseLogger.TYPE.ERROR, message, error))
  }
}
module.exports = ConsoleLogger
