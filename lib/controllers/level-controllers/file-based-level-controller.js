/**
 * FileBasedLevelController
 * Store and retrieve current level from file
**/

'use strict'

var util = require('util');
var BaseLevelController = require('./base-level-controller.js');
var Errors = require('../../errors/errors.js');
var Level = require('./level.js');

/**
 * Constructor
 * @param config
 */
var FileBasedLevelController = function(config) {
    FileBasedLevelController.super_.apply(this, arguments);
};

util.inherits(FileBasedLevelController, BaseLevelController);

/**
 * Save the current level
 * @param level
 * @param callback(error)
 */
FileBasedLevelController.prototype.saveCurrentLevel = function(level, callback) {
    //TODO: implement
    return callback(null);
};

/**
 * Retrieve the current level
 * @param callback(error, level)
 */
FileBasedLevelController.prototype.retrieveCurrentLevel = function(callback) {
    //TODO: implement
    return callback(null);
};

module.exports = FileBasedLevelController;