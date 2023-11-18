jest.mock('../logger/base-logger')

const BaseLogger = require('../logger/base-logger')
const FloorWorkerParameters = require('./floor-worker-parameters')
const Floor = require('../floor-controllers/floor')

beforeEach(() => BaseLogger.mockRestore())

test('instantiate with valid paramters should succeed', () => {
  const floorWorkerParameters = new FloorWorkerParameters({}, new BaseLogger(), new Floor())

  expect(floorWorkerParameters).not.toBeNull()
})
