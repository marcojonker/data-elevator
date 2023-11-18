jest.mock('../logger/base-logger')
jest.mock('../elevator-engine/elevator-engine')

const ElevatorCmdList = require('./elevator-cmd-list')
const BaseLogger = require('../logger/base-logger')
const { ElevatorEngine } = require('../elevator-engine/elevator-engine')

beforeEach(() => {
  BaseLogger.mockClear()
  ElevatorEngine.mockClear()
})

test('onValidateOptions should return null', (done) => {
  const command = new ElevatorCmdList({}, new BaseLogger())
  const options = {}

  command.onValidateOptions(options, (error) => {
    expect(error).toBe(null)
    done()
  })
})

test('onRun should call printList of elevator engine', (done) => {
  const command = new ElevatorCmdList({}, new BaseLogger())
  const options = { workingDir: 'dir', config: {} }

  const getConfigurationSpy = jest.spyOn(command, 'getConfiguration').mockImplementation(() => {
    return { floorsDir: './floors', floorTemplateFilePath: './template.json' }
  })

  ElevatorEngine.printList.mockImplementation((config, logger, levelController, callback) => {
    return callback(null)
  })

  command.onRun(options, (error) => {
    expect(getConfigurationSpy).toHaveBeenCalled()
    expect(ElevatorEngine.printList).toHaveBeenCalled()
    expect(error).toBeNull()

    getConfigurationSpy.mockRestore()
    done()
  })
})

test('onRun should return error when expection is thrown', (done) => {
  const command = new ElevatorCmdList({}, new BaseLogger())
  const options = { workingDir: 'dir', config: {} }

  const getConfigurationSpy = jest.spyOn(command, 'getConfiguration').mockImplementation(() => {
    throw new Error('error message')
  })

  command.onRun(options, (error) => {
    expect(getConfigurationSpy).toHaveBeenCalled()
    expect(error).not.toBeNull()
    expect(error.message).toBe('error message')
    expect(command.logger.error).toHaveBeenCalled()
    getConfigurationSpy.mockRestore()
    done()
  })
})
