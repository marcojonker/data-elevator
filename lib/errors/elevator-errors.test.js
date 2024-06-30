const ElevatorErrors = require('./elevator-errors')

test('Should create correct message', () => {
  expect(ElevatorErrors.invalidClass('Test', 'Test1', new Error('test')).message).toBe('\'Test\' should be an instance of \'Test1\'')
  expect(ElevatorErrors.invalidArgument('Test', 'test', new Error('test')).message).toBe('Argument \'Test\' should be of type \'test\'')
  expect(ElevatorErrors.invalidArguments('Test', 'Test1', new Error('test')).message).toBe('Arguments \'Test\' are invalid. Test1')
  expect(ElevatorErrors.invalidArgumentEnum('Test', 'Test1', new Error('test')).message).toBe('Argument \'Test\' should be a value of enum \'Test1\'')
  expect(ElevatorErrors.invalidCmdArgument('Test', 'Test1', new Error('test')).message).toBe('Invalid or unknown command-line argument \'Test\', should be a value of type \'Test1\'')
  expect(ElevatorErrors.invalidCommand('Test', 'Test1').message).toBe('Invalid or unknown command \'Test\'')
  expect(ElevatorErrors.invalidCmdArgumentEnum('Test', 'Test1', new Error('test')).message).toBe('Invalid or unknown command-line argument \'Test\', should be a value of enum \'Test1\'')
  expect(ElevatorErrors.invalidConfig('Test', 'Test1', new Error('test')).message).toBe('Test')
  expect(ElevatorErrors.methodNotImplemented('test', 'Test1', new Error('test')).message).toBe('Method \'test\' not implemented for class \'Test1\'')
  expect(ElevatorErrors.generalError('Test', 'Test').message).toBe('Test')
})
