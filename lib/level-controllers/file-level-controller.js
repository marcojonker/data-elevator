/**
 * FileLevelController
 * Store and retrieve current level from file
**/

'use strict'

var util = require('util');
var fs = require('fs')
var BaseLevelController = require('./base-level-controller.js');
var Errors = require('../errors/elevator-errors.js');
var Level = require('./level.js');
var FileUtils = require('../utils/file-utils').FileUtils;
var CreateDirectory = require('../utils/file-utils').CreateDirectory;

/**
 * Get level directory
 * @param config
 * @result string
 * @throws Error
 */
var _getLevelDir = function(config) {
    var directory = null;

    if(config.workingDir) {
       directory = path.join(config.workingDir, 'level'); 
    } else {
        throw Errors.invalidConfig('Invalid configuration. Working directory not defined.');
    }
    
    return directory;
} 

/**
 * Get level file path
 * @param config
 * @result string
 * @throws Error
 */
var _getLevelFilePath = function(config) {
    var filePath = null;
    
    if(config.levelControllerConfig && config.levelControllerConfig.fileName) {
        filePath = path.join(_getLevelDir(config.workingDir, config.levelControllerConfig.fileName));        
    } else {
        throw Errors.invalidConfig('Invalid configuration. Level controller file name not defined.');
    }
    return filePath;
} 

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
    var filePath = null;
    var fileDir = null;
    
    try {
        filePath = _getLevelFilePath(config);
        fileDir = _getLevelDir(config);
    } catch(error) {
        return callback(error);
    }
    
    try {
        FileUtils.createDirectory(new CreateDirectory(fileDir, false));
        fs.writeFileSync(filePath, JSON.stringify(level));
        return callback(null);
    } catch(error) {
        return callback(Errors.generalError("Failed to write level file '" + filePath + "'", error));
    }
};



/**
 * Retrieve the current level
 * @param callback(error, level)
 */
FileLevelController.prototype.retrieveCurrentLevel = function(callback) {
    var level = null;
    var filePath = null;
    
    try {
        filePath = _getLevelFilePath(config);
    } catch(error) {
        return callback(error);
    }
        
    try {
        if(FileUtils.fileExists(filePath)) {
            var json = fs.readFileSync(filePath, "utf8");
            level = Level.fromJson(json);
        }
        
        return callback(null, level);
    } catch(error) {
        return callback(Errors.generalError('Failed to read level file ' . filePath, error));
    }
};

module.exports = FileLevelController;