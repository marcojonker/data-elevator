/**
 * FileUtils
 * File utilities to make handling files easier
**/

'use strict'

var fs = require('fs');

/**
 * Constructor
 */
var FileUtils = function() {
};

/**
 * Create directory
 * @param failIfExists if true then error is returned if the directory already exists
 */
FileUtils.createDirectory = function(directory, failIfExists, callback) {
  fs.stat(directory, function(error, stats) {
    if (error && error.code === 'ENOENT') {
      fs.mkdir(directory, callback);
    } else {
        if(failIfExists === true) {
            return callback(new Error('Directory already exists. Directory: ' + directory));
        } else {
            return callback(null);
        }
    }
  });
};

/**
 * Copy a file from source to destination
 * @param sourceFile
 * @param destinationFile
 * @param failIfExists
 */
FileUtils.copyFile = function(sourceFile, destinationFile, failIfExists, callback) {
  fs.stat(destinationFile, function(error, stats) {
    if (failIfExists === false || (error && error.code === 'ENOENT')) {
      try{
        fs.createReadStream(sourceFile).pipe(fs.createWriteStream(destinationFile));
        return callback(null);
      } catch(error) {
        return callback(error);
      }
    } else {
      return callback(new Error('Destination file already exists. File: ' + destinationFile));
    }
  });
}

module.exports = FileUtils;