const ConsoleLogger = require('../logger/console-logger')
const ElevatorBase = require('./elevator-base')

beforeEach(() => {
})

test('instantiale with logger null should create console logger', () => {
  const elevator = new ElevatorBase(null)

  expect(elevator.logger instanceof ConsoleLogger).toBe(true)
})

test('retrieving commandlinedirector should configure commandlinedirector', () => {
  const elevator = new ElevatorBase(null)
  const commandLineDirector = elevator.getCommandLineDirector()

  expect(commandLineDirector.commandLines.length).toBe(7)
})
