/**
 * ElevatorCmdAdd
 * Command for creating a new floor
**/

'use strict'

var util = require('util');
var ElevatorCmdBase = require('./elevator-cmd-base.js');
var FloorController = require('../controllers/floor-controllers/floor-controller.js').FloorController;
var FileUtils = require('../utils/file-utils.js').FileUtils;
var CopyFile = require('../utils/file-utils.js').CopyFile;

/**
 * Constructor
 * @param commandLineOptions - Command line options
 * @param logger - Instance of BaseLogger
 * @param LevelController - Class derived from BaseLevelController used for storing the current level
 */
var ElevatorCmdAdd = function(options, logger, LevelController) {
    ElevatorCmdAdd.super_.apply(this, arguments);
};

util.inherits(ElevatorCmdAdd, ElevatorCmdBase);

/**
 * Validate command line options options for command
 * @param options
 * @param callback(error)
 */
ElevatorCmdAdd.prototype.onValidateOptions = function(options, callback) {
    return callback(null);
}

/**
 * Run the command
 * @param options
 * @param callback(error)
 */
ElevatorCmdAdd.prototype.onRun = function(options, callback) {
    var name = options['name'] ? options['name'] : null;
    
    this.logger.info('>> Adding a new floor.');
        
    try{
        var config = this.getConfiguration(options);
        
        //Create migrations path and add file
        FileUtils.createDirectoryPath(config.floorsDir);
        
        //Get the next floor file
        var floor = FloorController.getNextFloor(config.floorsDir, name);
        
        //Copy the template file to the new migration file
        FileUtils.copyFile(new CopyFile(config.floorTemplateFilePath, floor.filePath, true));
        this.logger.info('>> New floor added: ' + floor.filePath);

        return callback(null);
    } catch(error) {
        this.logger.error('>> Failed to add floor.',  error);
        return callback(error);
    }
}

module.exports = ElevatorCmdAdd;