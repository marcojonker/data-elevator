/**
 * FileUtils
 * File utilities to make handling files easier
**/
const fs = require('fs')
const path = require('path')

const Errors = require('../errors/elevator-errors.js')

/// //////////////// CopyFile //////////////////////

class CopyFile {
  /**
   * Constructor
   * @param source
   * @param destination
   * @param failIfExists
   */

  constructor (source, destination, failIfExists) {
    this.source = source
    this.destination = destination
    this.failIfExists = failIfExists || false
  }
}

/// //////////////// CreateDirectory //////////////////////

class CreateDirectory {
  /**
   * Constructor
   * @param directory
   * @param failIfExists
   */
  constructor (directory, failIfExists) {
    this.directory = directory
    this.failIfExists = failIfExists || false
  }
}
/// //////////////// FileUtils //////////////////////

class FileUtils {
  /**
   * Check if a file exists at a specific path
   * @param path
   * @return bool
   * @throw Error
   */
  static fileExists (path) {
    let result = false
    try {
      const stats = fs.statSync(path)
      result = stats.isFile()
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw Errors.generalError("Failed to check file existence: '" + path + "'", error)
      }
    }
    return result
  }

  /**
   * Check if a directory exists at a specific path
   * @param path
   * @return bool
   * @throw Error
   */
  static directoryExists (path) {
    let result = false
    try {
      const stats = fs.statSync(path)
      result = stats.isDirectory()
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw Errors.generalError("Failed to check directory existence: '" + path + "'", error)
      }
    }

    return result
  }

  /**
   * Create path directories
   * @param directoryPath
   * @trow Error
   */
  static createDirectoryPath (directoryPath) {
    if (typeof directoryPath === 'string' || directoryPath instanceof String) {
      const directories = directoryPath.split(path.sep)
      const createDirectories = []
      let currentDirectory = directoryPath.charAt(0) === path.sep ? path.sep : './'

      directories.forEach(function (directory) {
        currentDirectory = path.join(currentDirectory, directory)
        createDirectories.push(new CreateDirectory(currentDirectory))
      })

      FileUtils.createDirectories(createDirectories)
    } else {
      throw Errors.invalidArgument('directoryPath', 'string')
    }
  }

  /**
   * Create an array of directories, this method does not undo previous copies if one copy fails
   * @param array of CreateDirectory objects
   * @trow Error
   */
  static createDirectories (createDirectories) {
    createDirectories.forEach(function (createDirectory) {
      FileUtils.createDirectory(createDirectory)
    })
  }

  /**
   * Create directory
   * @param failIfExists if true then error is returned if the directory already exists
   * @trow Error
   */
  static createDirectory (createDirectory) {
    if (createDirectory instanceof CreateDirectory) {
      const directoryExists = FileUtils.directoryExists(createDirectory.directory)

      if (directoryExists === false) {
        try {
          fs.mkdirSync(createDirectory.directory)
        } catch (error) {
          throw Errors.generalError("Failed to create directory: '" + createDirectory.directory + "'", error)
        }
      } else if (createDirectory.failIfExists === true) {
        throw Errors.generalError("Directory already exists: '" + createDirectory.directory + "'")
      }
    } else {
      throw Errors.invalidArgument('createDirectory', 'CreateDirectory')
    }
  }

  /**
   * Copy an array of files, this method does not undo previous copies if one copy fails
   * @param array of CopyFile objects
   * @throws Error
   */
  static copyFiles (copyFiles) {
    copyFiles.forEach(function (copyFile) {
      FileUtils.copyFile(copyFile)
    })
  }

  /**
   * Copy a file from source to destination
   * @param copyFile CopyFile object
   * @throw Error
   */
  static copyFile (copyFile) {
    if (copyFile instanceof CopyFile) {
      const fileExists = FileUtils.fileExists(copyFile.destination)

      if (fileExists === false) {
        try {
          const data = fs.readFileSync(copyFile.source, 'utf8')
          fs.writeFileSync(copyFile.destination, data, 'utf8')
        } catch (error) {
          throw Errors.generalError("Failed to copy file: '" + copyFile.source + "'", error)
        }
      } else if (copyFile.failIfExists === true) {
        throw Errors.generalError("File already exists: '" + copyFile.destination + "'")
      }
    } else {
      throw Errors.invalidArgument('copyFile', 'CopyFile')
    }
  }

  /**
   * Replace characters that are not allowed in a filename
   * @param fileName
   * @param replaceWithCharacter
   * @return string
   */
  static replaceIllegalFileNameCharacters (fileName, replaceWithCharacter) {
    return fileName.replace(/[|&;$%@"<> _()+,]/g, replaceWithCharacter)
  }

  /**
   * Copy source directory recursively to destination
   * @param {string} src The path to the thing to copy.
   * @param {string} dest The path to the new copy.
   */
  static copyRecusive (source, destination) {
    const exists = fs.existsSync(source)
    const stats = exists && fs.statSync(source)
    const isDirectory = exists && stats.isDirectory()
    if (exists && isDirectory) {
      FileUtils.createDirectory(new CreateDirectory(destination, false))
      fs.readdirSync(source).forEach(function (sourceItem) {
        FileUtils.copyRecusive(path.join(source, sourceItem), path.join(destination, sourceItem))
      })
    } else {
      FileUtils.copyFile(new CopyFile(source, destination, false))
    }
  }
}

module.exports = {
  FileUtils: FileUtils,
  CopyFile: CopyFile,
  CreateDirectory: CreateDirectory
}
