jest.mock('../logger/base-logger')
jest.mock('../elevator-engine/elevator-engine')

const ElevatorCmdStatus = require('./elevator-cmd-status')
const BaseLogger = require('../logger/base-logger')
const ElevatorEngine = require('../elevator-engine/elevator-engine').ElevatorEngine

beforeEach(() => {
  BaseLogger.mockClear()
  ElevatorEngine.mockClear()
})

test('onValidateOptions should return an error in callback when working dir is not test', (done) => {
  const command = new ElevatorCmdStatus({}, new BaseLogger())
  const options = {}

  command.onValidateOptions(options, (error) => {
    expect(error).not.toBe(null)
    expect(command.logger.error).toHaveBeenCalled()
    done()
  })
})

test('onValidateOptions should return an error in callback when workingdir is not a string', (done) => {
  const command = new ElevatorCmdStatus({}, new BaseLogger())
  const options = { workingdir: 1 }

  command.onValidateOptions(options, (error) => {
    expect(error).not.toBe(null)
    expect(command.logger.error).toHaveBeenCalled()
    done()
  })
})

test('onValidateOptions should return null in callback when workingdir is set', (done) => {
  const command = new ElevatorCmdStatus()
  const options = { workingDir: 'dir' }

  command.onValidateOptions(options, (error) => {
    expect(error).toBe(null)
    done()
  })
})

test('onRun should call printStatus of elevator engine', (done) => {
  const command = new ElevatorCmdStatus({}, new BaseLogger())
  const options = {}

  const getConfigurationSpy = jest.spyOn(command, 'getConfiguration').mockImplementation(() => {
    return { floorsDir: './floors', floorTemplateFilePath: './template.json' }
  })

  ElevatorEngine.printStatus.mockImplementation((config, logger, levelController, callback) => {
    return callback(null)
  })

  command.onRun(options, (error) => {
    expect(getConfigurationSpy).toHaveBeenCalled()
    expect(ElevatorEngine.printStatus).toHaveBeenCalled()
    expect(error).toBeNull()

    getConfigurationSpy.mockRestore()
    done()
  })
})

test('onRun should return error when expection is thrown', (done) => {
  const command = new ElevatorCmdStatus({}, new BaseLogger())
  const options = {}

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
