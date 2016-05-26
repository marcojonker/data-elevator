/**
 * FileUtils
 * File utilities to make handling files easier
**/

'use strict'

var fs = require('fs');
var path = require('path');
var async = require('async');

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
 * Create path directories
 * @param directoryPath
 * @param callback(error)
 */
FileUtils.createDirectoryPath = function(directoryPath, callback) {
  if(typeof directoryPath == 'string' || directoryPath instanceof String) {
    var directories = directoryPath.split(path.sep);
    var createDirectories = [];
    var currentDirectory = '';
    
    directories.forEach(function(directory) {
      currentDirectory = path.join(currentDirectory, directory)
      createDirectories.push(new CreateDirectory(currentDirectory));
    });

    FileUtils.createDirectories(createDirectories, function(error) {
      return callback(error);
    }); 
  } else {
    return callback(MigrationErrors.invalidArgument('directoryPath', 'string');
  }
}

/**
 * Create an array of directories, this method does not undo previous copies if one copy fails
 * @param array of CreateDirectory objects
 * @param callback(error)
 */
FileUtils.createDirectories = function(createDirectories, callback) {
  async.forEach(createDirectories, function(createDirectory, callback) {
    FileUtils.createDirectory(createDirectory, callback);
  }, 
  function(error) {
    return callback(error);
  });
}

/**
 * Create directory
 * @param failIfExists if true then error is returned if the directory already exists
 */
FileUtils.createDirectory = function(createDirectory, callback) {
  if(createDirectory instanceof CreateDirectory) {
    fs.stat(createDirectory.directory, function(error, stats) {
      if (error && error.code === 'ENOENT') {
        fs.mkdir(createDirectory.directory, function(error) {
          if(!error) {
            return callback(null);
          } else {
            return callback(MigrationErrors.systemError('Failed to create directory: ' + createDirectory.directory, error));
          }
        });
      } else {
          if(createDirectory.failIfExists === true) {
              return callback(MigrationErrors.systemError('Directory already exists: ' + createDirectory.directory);
          } else {
              return callback(null);
          }
      }
    });
  } else {
    return callback(MigrationErrors.invalidArgument('createDirectory', 'CreateDirectory');
  }
};

/**
 * Copy an array of files, this method does not undo previous copies if one copy fails
 * @param array of CopyFile objects
 * @param callback(error)
 */
FileUtils.copyFiles = function(copyFiles, callback) {
  async.forEach(copyFiles, function(copyFile, callback) {
    FileUtils.copyFile(copyFile, callback);
  }, function(error){
    return callback(error);
  });
}

/**
 * Check if a file exists at a specific path
 * @param path 
 * @param callback(bool)
 */
FileUtils.fileExists = function(path) {
  var result = false;
  try {
    stats = fs.lstatSync(path);
    result = stats.isFile();
  }
  catch (error) { }
  return result;
}


/**
 * Check if a directory exists at a specific path
 * @param path 
 * @param callback(bool)
 */
FileUtils.directoryExists = function(path) {
  var result = false;
  try {
    stats = fs.lstatSync(path);
    result = stats.isDirectory();
  }
  catch (error) { }
  
  return result;
}

/**
 * Copy a file from source to destination
 * @param copyFile CopyFile object
 * @param callback(error)
 */
FileUtils.copyFile = function(copyFile, callback) {
  if(copyFile instanceof CopyFile) {
    fs.stat(copyFile.destination, function(error, stats) {
      if (copyFile.failIfExists === false || (error && error.code === 'ENOENT')) {
        try{
          fs.createReadStream(copyFile.source).pipe(fs.createWriteStream(copyFile.destination));
          return callback(null);
        } catch(error) {
          return callback(MigrationErrors.systemError('Failed to copy file: ' + copyFile.source, error));
        }
      } else {
        return callback(MigrationErrors.systemError('File already exists: ' + copyFile.destination, error));
      }
    });
  } else {
    return callback(MigrationErrors.invalidArgument('copyFile', 'CopyFile');
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