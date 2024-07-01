jest.mock('../logger/base-logger')
jest.mock('../utils/file-utils')

const path = require('path')
const FileUtils = require('../utils/file-utils').FileUtils
const ElevatorCmdConstruct = require('./elevator-cmd-construct')
const BaseLogger = require('../logger/base-logger')

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  FileUtils.mockClear()
  BaseLogger.mockClear()
})

test('onValidateOptions should return an error in callback when working dir is not test', (done) => {
  const command = new ElevatorCmdConstruct({}, new BaseLogger())
  const options = {}

  command.onValidateOptions(options, (error) => {
    expect(error).not.toBe(null)
    expect(command.logger.error).toHaveBeenCalled()
    done()
  })
})

test('onValidateOptions should return an error in callback when workingdir is not a string', (done) => {
  const command = new ElevatorCmdConstruct({}, new BaseLogger())
  const options = { workingdir: 1 }

  command.onValidateOptions(options, (error) => {
    expect(error).not.toBe(null)
    expect(command.logger.error).toHaveBeenCalled()
    done()
  })
})

test('onValidateOptions should return null in callback when workingdir is set', (done) => {
  const command = new ElevatorCmdConstruct()
  const options = { workingDir: 'dir' }

  command.onValidateOptions(options, (error) => {
    expect(error).toBe(null)
    done()
  })
})

test('onRun should copy resource files to module directory', (done) => {
  const command = new ElevatorCmdConstruct({}, new BaseLogger())
  const options = { workingDir: 'working_directory', config: {}, moduleDir: 'module_directory' }
  const resourcePath = path.join(__dirname, '../resources')

  command.onRun(options, (error) => {
    expect(FileUtils.createDirectoryPath).toHaveBeenCalled()
    expect(FileUtils.copyFiles).toHaveBeenCalled()
    expect(FileUtils.copyRecusive).toHaveBeenCalled()
    expect(FileUtils.copyRecusive.mock.calls[0][0]).toBe('module_directory/lib/resources')
    expect(FileUtils.copyRecusive.mock.calls[0][1]).toBe('working_directory')
    expect(FileUtils.copyRecusive.mock.calls[1][0]).toBe(resourcePath)
    expect(FileUtils.copyRecusive.mock.calls[1][1]).toBe('working_directory')
    expect(error).toBeNull()
    done()
  })
})

test('onRun should return error when expection is thrown', (done) => {
  const command = new ElevatorCmdConstruct({}, new BaseLogger())
  const options = { workingDir: 'working_directory', config: {}, moduleDir: 'module_directory' }

  FileUtils.createDirectoryPath.mockImplementation(() => {
    throw new Error('error message')
  })

  command.onRun(options, (error) => {
    expect(FileUtils.createDirectoryPath).toHaveBeenCalled()
    expect(error).not.toBeNull()
    expect(error.message).toBe('error message')
    expect(command.logger.error).toHaveBeenCalled()
    done()
  })
})
