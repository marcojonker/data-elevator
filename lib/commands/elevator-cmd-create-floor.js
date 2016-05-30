/**
 * ElevatorCmdCreate
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
var ElevatorCmdCreate = function(options, logger, LevelController) {
    ElevatorCmdCreate.super_.apply(this, arguments);
};

util.inherits(ElevatorCmdCreate, ElevatorCmdBase);

/**
 * Validate command line options options for command
 * @param options
 * @param callback(error)
 */
ElevatorCmdCreate.prototype.onValidateOptions = function(options, callback) {
    return callback(null);
}

/**
 * Run the command
 * @param options
 * @param callback(error)
 */
ElevatorCmdCreate.prototype.onRun = function(options, callback) {
    var name = options['name'] ? options['name'] : null;
    
    this.logger.info('>> Constructing a new floor');
        
    try{
        var config = this.getConfiguration(options);
        
        //Create migrations path and add file
        FileUtils.createDirectoryPath(config.floorsDir);
        
        //Get the next floor file
        var floor = FloorController.getNextFloor(config.floorsDir, name);
        
        //Copy the template file to the new migration file
        FileUtils.copyFile(new CopyFile(config.floorTemplateFile, floor.filePath, true));
        this.logger.info('>> New floor constructed at: ' + floor.filePath);

        return callback(null);
    } catch(error) {
        this.logger.info('>> Failed to construct floor: ' + error.message);
        return callback(error);
    }
}

module.exports = ElevatorCmdCreate;
