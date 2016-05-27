/**
 * MigrationStatusHandlerFile
 * Handle migrations status located in mongodb database
**/

'use strict'

var util = require('util');

var Errors = require('../../errors/errors.js');
var BaseFloorController = require('./base-floor-controller.js');
var Floor = require('../floor.js');

/**
 * Constructor
 */
var FileBasedFloorController = function(config) {
    FileBasedFloorController.super_.apply(this, arguments);
};

util.inherits(FileBasedFloorController, BaseFloorController);

/**
 * Save the migration status
 * @param floor
 * @param callback(error)
 */
FileBasedFloorController.prototype.saveCurrentLevel = function(level, callback) {
    //TODO: implement
    return callback(null);
};

/**
 * Retrieve the migration status
 * @param callback(error, migrationStatus)
 */
FileBasedFloorController.prototype.retrieveCurrentLevel = function(callback) {
    //TODO: implement
    return callback(null);
};

module.exports = FileBasedFloorController;