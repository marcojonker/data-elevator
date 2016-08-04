/**
 * BaseLevelController
 * Base class for storing and retrieving the current level on which the elevator is located
**/

'use strict'

var Errors = require('../errors/elevator-errors.js');
var path = require('path');
var fs = require('fs');

/**
 * Constructor
 */
var BaseLevelController = function(config) {
    this.config = config;
};

/**
 * Save the current level
 * @param level
 * @param callback(error)
 */
BaseLevelController.prototype.saveCurrentLevel = function(level, callback) {
    throw Errors.methodNotImplemented('saveCurrentLevel', 'BaseLevelController');
};

/**
 * Retrieve the current level
 * @param callback(error, level)
 */
BaseLevelController.prototype.retrieveCurrentLevel = function(callback) {
    throw Errors.methodNotImplemented('retrieveCurrentLevel', 'BaseLevelController');
};

/**
 * Retrieve the content of the manual, this method can be overriden to display a custom manual
 * @param callback(error, content)
 */
BaseLevelController.prototype.getManual = function(callback) {
    var manualPath = path.join(__dirname, "../manual/manual.txt");
    
    fs.readFile(manualPath, 'utf8', function(error, content) {
        if(!error) {
            return callback(null, content);
        } else {
            return callback(Errors.generalError('Manual could not be read from path: ' + manualPath, error));
        }
    });
};


module.exports = BaseLevelController;
