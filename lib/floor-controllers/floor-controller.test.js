jest.mock('fs')

const fs = require('fs')
const FloorController = require('./floor-controller').FloorController

test('getFloors should return list of floors', () => {
  fs.readdirSync.mockImplementation(() => ['1_test1.js', '2_test2.js', '3_test3.js'])

  const floors = FloorController.getFloors('directory', {})

  expect(floors.length).toBe(3)
  expect(floors[0].filePath).toBe('directory/1_test1.js')
  expect(floors[1].identifier).toBe(2)
  expect(floors[2].name).toBe('test3')
})
