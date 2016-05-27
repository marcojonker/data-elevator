/**
 * FileUtils
 * File utilities to make handling files easier
**/

'use strict'

var fs = require('fs');
var path = require('path');
var async = require('async');

var Errors = require('../errors/migration-errors.js');

/////////////////// CopyFile //////////////////////

/**
 * Constructor
 * @param source
 * @param destination
 * @param failIfExists
 */
var CopyFile = function(source, destination, failIfExists) {
    this.source = source;
    this.destination = destination;
    this.failIfExists = failIfExists ? failIfExists : false;
};

/////////////////// CreateDirectory //////////////////////

/**
 * Constructor
 * @param directory
 * @param failIfExists
 */
var CreateDirectory = function(directory, failIfExists) {
    this.directory = directory;
    this.failIfExists = failIfExists ? failIfExists : false;
};

/////////////////// FileUtils //////////////////////

/**
 * Constructor
 */
var FileUtils = function() {
};

/**
 * Check if a file exists at a specific path
 * @param path 
 * @return bool
 * @throw Error
 */
FileUtils.fileExists = function(path) {
  var result = false;
  try {
    var stats = fs.lstatSync(path);
    result = stats.isFile();
  }
  catch (error) {  
    if(error.code !== 'ENOENT') {
      throw Errors.systemError('Failed to check file existence: ' + path, error);
    }
  }
  return result;
};


/**
 * Check if a directory exists at a specific path
 * @param path 
 * @return bool
 * @throw Error
 */
FileUtils.directoryExists = function(path) {
  var result = false;
  try {
    var stats = fs.lstatSync(path);
    result = stats.isDirectory();
  }
  catch (error) { 
    if(error.code !== 'ENOENT') {
      throw Errors.systemError('Failed to check directory existence: ' + path, error);
    }
  }
  
  return result;
}

/**
 * Create path directories
 * @param directoryPath
 * @trow Error
 */
FileUtils.createDirectoryPath = function(directoryPath) {
  if(typeof directoryPath == 'string' || directoryPath instanceof String) {
    var directories = directoryPath.split(path.sep);
    var createDirectories = [];
    var currentDirectory = '';
    
    directories.forEach(function(directory) {
      currentDirectory = path.join(currentDirectory, directory)
      createDirectories.push(new CreateDirectory(currentDirectory));
    });

    FileUtils.createDirectories(createDirectories);
  } else {
    throw Errors.invalidArgument('directoryPath', 'string');
  }
}

/**
 * Create an array of directories, this method does not undo previous copies if one copy fails
 * @param array of CreateDirectory objects
 * @trow Error
 */
FileUtils.createDirectories = function(createDirectories) {
  createDirectories.forEach(function(createDirectory) {
    FileUtils.createDirectory(createDirectory);
  }); 
}

/**
 * Create directory
 * @param failIfExists if true then error is returned if the directory already exists
 * @trow Error
 */
FileUtils.createDirectory = function(createDirectory) {
  if(createDirectory instanceof CreateDirectory) {
    var directoryExists = FileUtils.directoryExists(createDirectory.directory);
    
    if(directoryExists === false) {
      try {
          fs.mkdirSync(createDirectory.directory);
      } catch(error) {
          throw Errors.systemError('Failed to create directory: ' + createDirectory.directory, error);
      }
    } else if(createDirectory.failIfExists === true) {
        throw Errors.systemError('Failed to create directory: ' + createDirectory.directory, error);
    }
  } else {
    throw Errors.invalidArgument('createDirectory', 'CreateDirectory');
  }
};

/**
 * Copy an array of files, this method does not undo previous copies if one copy fails
 * @param array of CopyFile objects
 * @throws Error
 */
FileUtils.copyFiles = function(copyFiles) {
  copyFiles.forEach(function(copyFile) {
    FileUtils.copyFile(copyFile);
  });
};

/**
 * Copy a file from source to destination
 * @param copyFile CopyFile object
 * @throw Error
 */
FileUtils.copyFile = function(copyFile) {
  if(copyFile instanceof CopyFile) {
    var fileExists = FileUtils.fileExists(copyFile.destination);
    
    if(fileExists === false) {
        try{
          fs.createReadStream(copyFile.source).pipe(fs.createWriteStream(copyFile.destination));
        } catch(error) {
          throw Errors.systemError('Failed to copy file: ' + copyFile.source, error);
        }
    } else if(copyFile.failIfExists === true) {
      throw Errors.systemError('File already exists: ' + copyFile.destination, error);
    }
  } else {
    return callback(Errors.invalidArgument('copyFile', 'CopyFile'));
  }
}

/**
 * Replace characters that are not allowed in a filename
 * @param fileName
 * @param replaceWithCharacter
 * @return string
 */
FileUtils.replaceIllegalFileNameCharacters = function(fileName, replaceWithCharacter) {
  return fileName.replace(/[|&;$%@"<> _()+,]/g, replaceWithCharacter);
}

module.exports = {
  FileUtils: FileUtils,
  CopyFile: CopyFile,
  CreateDirectory: CreateDirectory
}