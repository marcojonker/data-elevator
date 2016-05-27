/**
 * MigratorCmdInit
 * Initialize new migrator
 * 
**/

'use strict'

var util = require('util');
var path = require('path');

var ElevatorCmdBase = require('./elevator-cmd-base.js');
var Errors = require('../errors/errors.js');
var FileUtils = require('../utils/file-utils.js').FileUtils;
var CopyFile = require('../utils/file-utils.js').CopyFile;
var CreateDirectory = require('../utils/file-utils.js').CreateDirectory;
var StringUtils = require('../utils/string-utils.js');

/**
 * Constructor
 * @param options
 * @param logger
 * @param StatusHandler - Class derived from MigrationStatusHandlerBase used for custom status handlers
 */
var ElevatorCmdInit = function(options, logger, FloorController) {
    ElevatorCmdInit.super_.apply(this, arguments);
};

util.inherits(ElevatorCmdInit, ElevatorCmdBase);

/**
 * validate options for migrator function
 * @param options
 * @param callback
 */
ElevatorCmdInit.prototype.onValidateOptions = function(options, callback) {
    return callback(null);
}

/**
 * run migrator function
 * @param options
 * @param callback
 */
ElevatorCmdInit.prototype.onRun = function(options, callback) {
    var workingDir = options['working-dir'] ? options['working-dir'] : './data-elevator';
    
    this.logger.info('>> Installing a new data elevator');

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
        this.logger.info(">> Elevator has been installed, it is time to go up and down. Use 'create-floor' to add a floor.");
        return callback(null);
    } catch(error) {
        this.logger.info('>> Failed to install the new elevator: ' + error.message);
        return callback(error);
    }
}

module.exports = ElevatorCmdInit;