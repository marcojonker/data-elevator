const ElevatorEngine = require('./elevator-engine').ElevatorEngine

beforeEach(() => {
})

test('instantiate to succeed', () => {
  const elevator = new ElevatorEngine(null)

  expect(elevator).not.toBeNull()
})
