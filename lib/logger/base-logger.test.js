const BaseLogger = require('./base-logger')
const ElevatorError = require('../errors/elevator-error')

test('verbose log should throw method not implemented', () => {
  const logger = new BaseLogger()
  expect(logger.verbose).toThrow(ElevatorError)
})

test('info log should throw method not implemented', () => {
  const logger = new BaseLogger()
  expect(logger.info).toThrow(ElevatorError)
})

test('warning log should throw method not implemented', () => {
  const logger = new BaseLogger()
  expect(logger.warning).toThrow(ElevatorError)
})

test('error log should throw method not implemented', () => {
  const logger = new BaseLogger()
  expect(logger.error).toThrow(ElevatorError)
})

test('format message of type INFO', () => {
  const logger = new BaseLogger()
  expect(logger.formatMessage(BaseLogger.TYPE.INFO, 'test')).toBe('test')
})

test('format message of type ERROR', () => {
  const logger = new BaseLogger()
  expect(logger.formatMessage(BaseLogger.TYPE.ERROR, 'test')).toBe('ERR: test')
})

test('format message with error', () => {
  const logger = new BaseLogger()
  const message = logger.formatMessage(BaseLogger.TYPE.ERROR, 'test', { message: 'test-error', stack: 'line1' })
  expect(message.includes('test-error')).toBe(true)
  expect(message.includes('line1')).toBe(false)
})

test('format message with error', () => {
  const logger = new BaseLogger()
  logger.verboseMode = true
  const message = logger.formatMessage(BaseLogger.TYPE.ERROR, 'test', { message: 'test-error', stack: 'line1', baseError: { message: 'baseError' } })

  expect(message.includes('test-error')).toBe(true)
  expect(message.includes('line1')).toBe(true)
  expect(message.includes('baseError')).toBe(true)
})
