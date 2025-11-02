const ConsoleLogger = require('./console-logger')

test('verbose log should log on the info commandline', () => {
  const logger = new ConsoleLogger()
  const consoleMock = jest.spyOn(console, 'info').mockImplementation(() => {})
  logger.verboseMode = true
  logger.verbose('test')
  expect(consoleMock).toHaveBeenCalledWith('VRB: test')
  consoleMock.mockReset()
})

test('verbose log should not log on the info commandline when verboseMode is false', () => {
  const logger = new ConsoleLogger()
  const consoleMock = jest.spyOn(console, 'info').mockImplementation(() => {})
  logger.verboseMode = false
  logger.verbose('test')
  expect(consoleMock).toHaveBeenCalledTimes(0)
  consoleMock.mockReset()
})

test('info log should log on the info commandline', () => {
  const logger = new ConsoleLogger()
  const consoleMock = jest.spyOn(console, 'info').mockImplementation(() => {})
  logger.info('test')
  expect(consoleMock).toHaveBeenCalledWith('test')
  consoleMock.mockReset()
})

test('warning should log on the warning commandline', () => {
  const logger = new ConsoleLogger()
  const consoleMock = jest.spyOn(console, 'warn').mockImplementation(() => {})
  logger.warning('test')
  expect(consoleMock).toHaveBeenCalledWith('WRN: test')
  consoleMock.mockReset()
})

test('error log should log on the error commandline', () => {
  const logger = new ConsoleLogger()
  const consoleMock = jest.spyOn(console, 'error').mockImplementation(() => {})
  logger.error('test')
  expect(consoleMock).toHaveBeenCalledWith('ERR: test')
  consoleMock.mockReset()
})
