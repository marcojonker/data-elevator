const ElevatorCmdBase = require('./elevator-cmd-base')
const ElevatorError = require('../errors/elevator-error')

test('onValidateOptions should throw exception', () => {
  const elevatorCmdBase = new ElevatorCmdBase()
  expect(elevatorCmdBase.onValidateOptions).toThrow(ElevatorError)
})

test('onRun should throw exception', () => {
  const elevatorCmdBase = new ElevatorCmdBase()
  expect(elevatorCmdBase.onRun).toThrow(ElevatorError)
})
