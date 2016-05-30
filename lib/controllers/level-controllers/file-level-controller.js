/**
 * FileLevelController
 * Store and retrieve current level from file
**/

'use strict'

var util = require('util');
var fs = require('fs')
var BaseLevelController = require('./base-level-controller.js');
var Errors = require('../../errors/elevator-errors.js');
var Level = require('./level.js');
var FileUtils = require('../../utils/file-utils').FileUtils;
var CreateDirectory = require('../../utils/file-utils').CreateDirectory;

/**
 * Constructor
 * @param config
 */
var FileLevelController = function(config) {
    FileLevelController.super_.apply(this, arguments);
};

util.inherits(FileLevelController, BaseLevelController);

/**
 * Save the current level
 * @param level
 * @param callback(error)
 */
FileLevelController.prototype.saveCurrentLevel = function(level, callback) {
    var config = this.config.fileLevelControllerConfig;
    
    try {
        FileUtils.createDirectory(new CreateDirectory(config.levelDir, false));
        fs.writeFileSync(config.levelFilePath, JSON.stringify(level));
        return callback(null);
    } catch(error) {
        return callback(Errors.generalError("Failed to write level file '" + config.levelFilePath + "'", error));
    }
};

/**
 * Retrieve the current level
 * @param callback(error, level)
 */
FileLevelController.prototype.retrieveCurrentLevel = function(callback) {
    var config = this.config.fileLevelControllerConfig;
    var level = null;
    try {
        if(FileUtils.fileExists(config.levelFilePath)) {
            var json = fs.readFileSync(config.levelFilePath, "utf8");
            level = Level.fromJson(json);
        }
        
        return callback(null, level);
    } catch(error) {
        return callback(Errors.generalError('Failed to read level file ' . config.levelFilePath, error));
    }
};

module.exports = FileLevelController;