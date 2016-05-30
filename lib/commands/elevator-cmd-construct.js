/**
 * ElevatorCmdConstruct
 * Command for initializing a new elevator
**/

'use strict'

var util = require('util');
var path = require('path');
var ElevatorCmdBase = require('./elevator-cmd-base.js');
var Errors = require('../errors/elevator-errors.js');
var FileUtils = require('../utils/file-utils.js').FileUtils;
var CopyFile = require('../utils/file-utils.js').CopyFile;
var CreateDirectory = require('../utils/file-utils.js').CreateDirectory;
var StringUtils = require('../utils/string-utils.js');

/**
 * Constructor
 * @param commandLineOptions - Command line options
 * @param logger - Instance of BaseLogger
 * @param LevelController - Class derived from BaseLevelController used for storing the current level
 */
var ElevatorCmdConstruct = function(options, logger, LevelController) {
    ElevatorCmdConstruct.super_.apply(this, arguments);
};

util.inherits(ElevatorCmdConstruct, ElevatorCmdBase);

/**
 * Validate command line options options for command
 * @param options
 * @param callback(error)
 */
ElevatorCmdConstruct.prototype.onValidateOptions = function(options, callback) {
    return callback(null);
}

/**
 * Run the command
 * @param options
 * @param callback(error)
 */
ElevatorCmdConstruct.prototype.onRun = function(options, callback) {
    var workingDir = options['working-dir'] ? options['working-dir'] : './data-elevator';
    
    this.logger.info('>> Constructing a new data elevator.');

    workingDir = StringUtils.removeQuotes(workingDir);
    
    try{
        //Create directory that will contain the migrations
        FileUtils.createDirectory(new CreateDirectory(workingDir, true));
        
        //Prepare files to copy
        var copyFiles = [
            new CopyFile(
                path.join(__dirname, '../resources', 'floor-template.js'),
                path.join(workingDir, 'floor-template.js'),
                true),
            new CopyFile(
                path.join(__dirname, '../resources', 'config.js'),
                path.join(workingDir, 'config.js'),
                true),
            new CopyFile(
                path.join(__dirname, '../resources', 'elevator.js'),
                path.join(workingDir, 'elevator.js'),
                true)
            ];
        
        //Copy the files
        FileUtils.copyFiles(copyFiles);
        this.logger.info(">> Elevator has been constructed. Use the 'add' command to add a floor.");
        return callback(null);
    } catch(error) {
        this.logger.error('>> Failed to construct the new elevator.', error);
        return callback(error);
    }
}

module.exports = ElevatorCmdConstruct;