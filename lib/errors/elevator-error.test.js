const ElevatorError = require('./elevator-error')

test('instantiate should create object', () => {
  const error = new ElevatorError('test', new Error('base-error-test'))
  expect(error.message).toBe('test')
  expect(error.baseError.message).toBe('base-error-test')
})

test('verbose log should create verbose message', () => {
  const message = ElevatorError.toLogString({ message: 'test', baseError: { message: 'baseTest', stack: 'baseStack' } }, true)
  expect(message.includes('test')).toBe(true)
  expect(message.includes('stack')).toBe(false)
  expect(message.includes('baseTest')).toBe(false)
  expect(message.includes('baseStack')).toBe(true)
})

test('verbose log should create verbose message', () => {
  const message = ElevatorError.toLogString({ message: 'test', stack: 'stack', baseError: { message: 'baseTest', stack: 'baseStack' } }, true)
  expect(message.includes('test')).toBe(false)
  expect(message.includes('stack')).toBe(true)
  expect(message.includes('baseTest')).toBe(false)
  expect(message.includes('baseStack')).toBe(true)
})

test('non verbose log should create message', () => {
  const message = ElevatorError.toLogString({ message: 'test', baseError: { message: 'baseTest', stack: 'baseStack' } }, false)
  expect(message.includes('test')).toBe(true)
  expect(message.includes('baseTest')).toBe(true)
  expect(message.includes('baseStack')).toBe(false)
})
