module.exports = {
  /**
     * Data transformation that need to be performed when migrating the data up
     * @param floorWorkerParameters - instance of FloorWorkerParameters
     * @param callback(error) - If an error is returned then all the subsequent migration will not be handled
     */
  onUp: function (floorWorkerParameters, callback) {
    return callback(null)
  },
  /**
     * Data transformation that need to be performed when migrating the data down
     * @param floorWorkerParameters - instance of FloorWorkerParameters
     * @param callback(error) - If an error is returned then all the subsequent migration will not be handled
     */
  onDown: function (floorWorkerParameters, callback) {
    return callback(null)
  }
}
