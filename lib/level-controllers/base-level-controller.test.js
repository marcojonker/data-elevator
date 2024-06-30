const BaseLevelController = require('./base-level-controller')
const ElevatorError = require('../errors/elevator-error')

test('save current level should throw exception', () => {
  const baseLevelController = new BaseLevelController()
  expect(baseLevelController.saveCurrentLevel).toThrow(ElevatorError)
})

test('retrieve current level should throw exception', () => {
  const baseLevelController = new BaseLevelController()
  expect(baseLevelController.retrieveCurrentLevel).toThrow(ElevatorError)
})
