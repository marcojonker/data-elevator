jest.mock('../logger/base-logger')
jest.mock('../utils/file-utils')
jest.mock('../floor-controllers/floor-controller')

const FileUtils = require('../utils/file-utils').FileUtils
const CopyFile = require('../utils/file-utils').CopyFile
const ElevatorCmdAdd = require('./elevator-cmd-add')
const BaseLogger = require('../logger/base-logger')
const FloorController = require('../floor-controllers/floor-controller').FloorController

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  FileUtils.mockClear()
  BaseLogger.mockClear()
  FloorController.mockClear()
})

test('onValidateOptions should return an error in callback when working dir is not test', (done) => {
  const command = new ElevatorCmdAdd({}, new BaseLogger())
  const options = {}

  command.onValidateOptions(options, (error) => {
    expect(error).not.toBe(null)
    expect(command.logger.error).toHaveBeenCalled()
    done()
  })
})

test('onValidateOptions should return an error in callback when workingdir is not a string', (done) => {
  const command = new ElevatorCmdAdd({}, new BaseLogger())
  const options = { workingdir: 1 }

  command.onValidateOptions(options, (error) => {
    expect(error).not.toBe(null)
    expect(command.logger.error).toHaveBeenCalled()
    done()
  })
})

test('onValidateOptions should return null in callback when workingdir is set', (done) => {
  const command = new ElevatorCmdAdd()
  const options = { workingDir: 'dir' }

  command.onValidateOptions(options, (error) => {
    expect(error).toBe(null)
    done()
  })
})

test('onRun should create a new floor from the floortemplate', (done) => {
  const command = new ElevatorCmdAdd({}, new BaseLogger())
  const options = { workingDir: 'dir', config: {} }

  FileUtils.directoryExists.mockReturnValue(true)
  FloorController.getNextFloor.mockReturnValue({
    filePath: './floors/1.json'
  })

  const getConfigurationSpy = jest.spyOn(command, 'getConfiguration').mockImplementation(() => {
    return { floorsDir: './floors', floorTemplateFilePath: './template.json' }
  })

  command.onRun(options, (error) => {
    expect(FileUtils.createDirectory).toHaveBeenCalled()
    expect(getConfigurationSpy).toHaveBeenCalled()
    expect(FloorController.getNextFloor).toHaveBeenCalled()
    expect(FileUtils.copyFile).toHaveBeenCalled()
    expect(CopyFile.mock.calls[0][0]).toBe('./template.json')
    expect(CopyFile.mock.calls[0][1]).toBe('./floors/1.json')
    expect(error).toBeNull()

    getConfigurationSpy.mockRestore()
    done()
  })
})

test('onRun should return error when expection is thrown', (done) => {
  const command = new ElevatorCmdAdd({}, new BaseLogger())
  const options = { workingDir: 'dir', config: {} }

  FileUtils.directoryExists.mockImplementation(() => {
    throw new Error('error message')
  })

  command.onRun(options, (error) => {
    expect(FileUtils.createDirectory).toHaveBeenCalled()
    expect(error).not.toBeNull()
    expect(error.message).toBe('error message')
    expect(command.logger.error).toHaveBeenCalled()
    done()
  })
})
