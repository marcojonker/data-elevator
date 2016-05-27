/**
 * ElevatorCmdCreate
 * Create new migration
 * 
**/

'use strict'

var util = require('util');

var ElevatorCmdBase = require('./elevator-cmd-base.js');
var FloorController = require('../controllers/floor-controllers/floor-controller.js').FloorController;
var FileUtils = require('../utils/file-utils.js').FileUtils;
var CopyFile = require('../utils/file-utils.js').CopyFile;

/**
 * Constructor
 * @param options
 * @param logger
 * @param StatusHandler - Class derived from MigrationStatusHandlerBase used for custom status handlers
 */
var ElevatorCmdCreate = function(options, logger, FloorController) {
    ElevatorCmdCreate.super_.apply(this, arguments);
};

util.inherits(ElevatorCmdCreate, ElevatorCmdBase);

/**
 * validate options for command
 * @param options
 * @param callback
 */
ElevatorCmdCreate.prototype.onValidateOptions = function(options, callback) {
    return callback(null);
}

/**
 * run command
 * @param options
 * @param callback
 */
ElevatorCmdCreate.prototype.onRun = function(options, callback) {
    var name = options['name'] ? options['name'] : null;
    
    this.logger.info('>> Creating a new floor');
        
    try{
        var config = this.getConfiguration(options);
        
        //Create migrations path and add file
        FileUtils.createDirectoryPath(config.floorsDir);
        
        //Get the next floor file
        var floor = FloorController.getNextFloor(config.floorsDir, name);
        
        //Copy the template file to the new migration file
        FileUtils.copyFile(new CopyFile(config.floorTemplateFile, floor.filePath, true));
        this.logger.info('>> New floor created: ' + floor.filePath);

        return callback(null);
    } catch(error) {
        this.logger.info('>> Failed to create floor: ' + error.message);
        return callback(error);
    }
}

module.exports = ElevatorCmdCreate;
