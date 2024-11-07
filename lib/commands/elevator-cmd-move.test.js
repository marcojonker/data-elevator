jest.mock('../logger/base-logger')
jest.mock('../elevator-engine/elevator-engine')

const { ElevatorEngine } = require('../elevator-engine/elevator-engine')
const ElevatorCmdMove = require('./elevator-cmd-move')
const BaseLogger = require('../logger/base-logger')

beforeEach(() => {
  BaseLogger.mockClear()
  ElevatorEngine.mockClear()
})

test('onValidateOptions should return an error in callback when working dir is not test', (done) => {
  const command = new ElevatorCmdMove({}, new BaseLogger())
  const options = {}

  command.onValidateOptions(options, (error) => {
    expect(error).not.toBe(null)
    expect(command.logger.error).toHaveBeenCalled()
    done()
  })
})

test('onValidateOptions should return an error in callback when workingdir is not a string', (done) => {
  const command = new ElevatorCmdMove({}, new BaseLogger())
  const options = { workingdir: 1 }

  command.onValidateOptions(options, (error) => {
    expect(error).not.toBe(null)
    expect(command.logger.error).toHaveBeenCalled()
    done()
  })
})

test('onValidateOptions should return an error in callback when floor is not a number', (done) => {
  const command = new ElevatorCmdMove({}, new BaseLogger())
  const options = { workingdir: './test', floor: 'test' }

  command.onValidateOptions(options, (error) => {
    expect(error).not.toBe(null)
    expect(command.logger.error).toHaveBeenCalled()
    done()
  })
})

test('onValidateOptions should return null in callback when workingdir is set', (done) => {
  const command = new ElevatorCmdMove()
  const options = { workingDir: 'dir', floor: 1 }

  command.onValidateOptions(options, (error) => {
    expect(error).toBe(null)
    done()
  })
})

test('onRun with floor top should move elevator engine to top', (done) => {
  const command = new ElevatorCmdMove({}, new BaseLogger())
  const options = { floor: 'top' }

  const getConfigurationSpy = jest.spyOn(command, 'getConfiguration').mockImplementation(() => {
    return {}
  })

  ElevatorEngine.move.mockImplementation((config, floor, count, logger, levelController, callback) => {
    return callback(null)
  })

  command.onRun(options, (error) => {
    expect(getConfigurationSpy).toHaveBeenCalled()
    expect(ElevatorEngine.move).toHaveBeenCalled()
    expect(command.logger.info.mock.calls[0][0]).toBe('>> Top floor reached')
    expect(error).toBeNull()

    getConfigurationSpy.mockRestore()
    done()
  })
})

test('onRun with floor ground should move elevator engine to ground floor', (done) => {
  const command = new ElevatorCmdMove({}, new BaseLogger())
  const options = { floor: 'ground' }

  const getConfigurationSpy = jest.spyOn(command, 'getConfiguration').mockImplementation(() => {
    return {}
  })

  ElevatorEngine.move.mockImplementation((config, floor, count, logger, levelController, callback) => {
    return callback(null)
  })

  command.onRun(options, (error) => {
    expect(command.logger.info.mock.calls[0][0]).toBe('>> Ground floor reached')
    expect(error).toBeNull()
    getConfigurationSpy.mockRestore()
    done()
  })
})

test('onRun specific floor should move elevator engine to specific floor', (done) => {
  const command = new ElevatorCmdMove({}, new BaseLogger())
  const options = { floor: 1 }

  const getConfigurationSpy = jest.spyOn(command, 'getConfiguration').mockImplementation(() => {
    return {}
  })

  ElevatorEngine.move.mockImplementation((config, floor, count, logger, levelController, callback) => {
    return callback(null)
  })

  command.onRun(options, (error) => {
    expect(command.logger.info.mock.calls[0][0]).toBe('>> Floor 1 reached')
    expect(error).toBeNull()
    getConfigurationSpy.mockRestore()
    done()
  })
})

test('onRun should log error when engine could not move', (done) => {
  const command = new ElevatorCmdMove({}, new BaseLogger())
  const options = { floor: 1 }

  const getConfigurationSpy = jest.spyOn(command, 'getConfiguration').mockImplementation(() => {
    return {}
  })

  ElevatorEngine.move.mockImplementation((config, floor, count, logger, levelController, callback) => {
    return callback(new Error('engine error'))
  })

  command.onRun(options, (error) => {
    expect(command.logger.error.mock.calls[0][0]).toBe('>> Elevator could not reach the destination.')
    expect(error).not.toBeNull()
    getConfigurationSpy.mockRestore()
    done()
  })
})

test('onRun should return error when expection is thrown', (done) => {
  const command = new ElevatorCmdMove({}, new BaseLogger())
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
