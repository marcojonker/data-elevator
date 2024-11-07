const path = require('path')
const fs = require('fs')
const async = require('async')

const config = require('./resources/data-elevator-test-config')
const ElevatorBase = require('../lib/elevator-engine/elevator-base.js')
const ConsoleLogger = require('../lib/logger/console-logger.js')
const FileLevelController = require('../lib/level-controllers/file-level-controller.js')

let elevator = null
let tempTestFilesFolder = null

beforeEach(function () {
  tempTestFilesFolder = path.join(process.cwd(), 'tmp')
  if (fs.existsSync(tempTestFilesFolder)) {
    fs.rmdirSync(tempTestFilesFolder, { recursive: true })
  }

  elevator = new ElevatorBase(new ConsoleLogger(true), FileLevelController, process.cwd())
})

const runTestCommand = function (index, commandTest, callback) {
  console.log('INTEGRATION TEST ' + index + ': ' + commandTest.title)
  elevator.runCommand(commandTest.command, function (error) {
    const currentLevelPath = path.join(tempTestFilesFolder, 'level/current_level.json');
    if(commandTest.expectedFloor) {
      if(fs.existsSync(currentLevelPath)) {
        const jsonString = fs.readFileSync(currentLevelPath, { encoding: 'utf8', flag: 'r' });
        const json = JSON.parse(jsonString);
        expect(json.identifier).toBe(commandTest.expectedFloor);
      } else {
        error = 'Current level not found while expected'
      }
    }

    return callback(error)
  })
}

describe('Integration test', function () {
  it('should not return errors while running a set of commands', (done) => {
    const commandTests = [
      { title: 'DISPLAY HELP', command: { command: 'help', workingDir: './tmp' } },
      { title: 'CONSTRUCT ELEVATOR', command: { command: 'construct', workingDir: './tmp' } },
      { title: 'ADD FLOOR', command: { command: 'add', workingDir: './tmp', verbose: true } },
      { title: 'ADD FLOOR', command: { command: 'add', workingDir: './tmp', name: 'second floor' } },
      { title: 'ADD FLOOR', command: { command: 'add', workingDir: './tmp' } },
      { title: 'ADD FLOOR', command: { command: 'add', workingDir: './tmp' } },
      { title: 'ADD FLOOR', command: { command: 'add', workingDir: './tmp', name: 'update invoice data' } },
      { title: 'ADD FLOOR', command: { command: 'add', workingDir: './tmp' } },
      { title: 'ADD FLOOR', command: { command: 'add', workingDir: './tmp', name: 'add phone number to users' } },
      { title: 'ADD FLOOR', command: { command: 'add', workingDir: './tmp' } },
      { title: 'ADD FLOOR', command: { command: 'add', workingDir: './tmp' } },
      { title: 'MOVE TO TOP', command: { command: 'move', workingDir: './tmp', floor: 'top' }, expectedFloor: '9' },
      { title: 'MOVE TO GROUND', command: { command: 'move', workingDir: './tmp', floor: 'ground' }, expectedFloor: '0' },
      { title: 'MOVE DOWN TO 5', command: { command: 'move', workingDir: './tmp', floor: 5 }, expectedFloor: '5'},
      { title: 'MOVE DOWN TO 2', command: { command: 'move', workingDir: './tmp', floor: 2 }, expectedFloor: '2' },
      { title: 'MOVE UP TO 2', command: { command: 'move', workingDir: './tmp', floor: 2 }, expectedFloor: '2' },
      { title: 'MOVE UP TO 6', command: { command: 'move', workingDir: './tmp', floor: 6 }, expectedFloor: '6' },
      { title: 'MOVE DOWN 3 FLOORS', command: { command: 'move', floor: 'down', workingDir: './tmp', count: 3 }, expectedFloor: '3' },
      { title: 'MOVE UP 2 FLOORS', command: { command: 'move', floor: 'up', workingDir: './tmp', count: 2 }, expectedFloor: '5' },
      { title: 'MOVE DOWN 20 FLOORS', command: { command: 'move', floor: 'down', workingDir: './tmp', count: 20 }, expectedFloor: '0' },
      { title: 'MOVE UP 20 FLOORS', command: { command: 'move', floor: 'up', workingDir: './tmp', count: 20 }, expectedFloor: '9' },
      { title: 'PRINT STATUS', command: { command: 'status', workingDir: './tmp' } },
      { title: 'PRINT LIST', command: { command: 'list', workingDir: './tmp' } },
      { title: 'MOVE TO GROUND', command: { command: 'move', workingDir: './tmp', floor: 'ground'}, expectedFloor: '0' },
      { title: 'PRINT STATUS', command: { command: 'status', workingDir: './tmp' } },
      { title: 'PRINT LIST', command: { command: 'list', workingDir: './tmp' } },
      { title: 'MOVE TO TOP', command: { command: 'move', workingDir: './tmp', floor: 'top' }, expectedFloor: '9' },
      { title: 'PRINT STATUS', command: { command: 'status', workingDir: './tmp' } },
      { title: 'PRINT LIST', command: { command: 'list', workingDir: './tmp' } }
    ]

    let index = 1

    async.eachSeries(commandTests, (commandTest, callback) => {
      if (config) {
        commandTest.command.config = config
      }
      runTestCommand(index, commandTest, (error) => {
        expect(error).toBe(null)
        index++
        return callback(error)
      })
    }, (error) => {
      expect(error).toBe(null)
      done()
    })
  })

  it('should not return errors while running a set of commands', (done) => {
    const commandTests = [
      { title: 'NO WORKINGDIR CONSTRUCT ELEVATOR', command: { command: 'construct', workingDir: null } },
      { title: 'NO WORKINGDIR INVALID ADD FLOOR', command: { command: 'add', workingDir: null, verbose: true } },
      { title: 'NO WORKINGDIR MOVE TO TOP', command: { command: 'move', workingDir: null, floor: 'top' } },
      { title: 'NO WORKINGDIR MOVE TO GROUND', command: { command: 'move', workingDir: null, floor: 'ground' } },
      { title: 'NOT EXISTING MOVE DOWN TO 100', command: { command: 'move', workingDir: './tmp', floor: 100 } },
      { title: 'NOT EXISTING MOVE DOWN TO 100', command: { command: 'move', workingDir: './tmp' } },
      { title: 'NO WORKINGDIR PRINT STATUS', command: { command: 'status', workingDir: null } },
      { title: 'NO WORKINGDIR PRINT LIST', command: { command: 'list', workingDir: null } },
      { title: 'INVALID COMMAND', command: { command: 'invalid', workingDir: null } }
    ]

    let index = 1

    async.eachSeries(commandTests, (commandTest, callback) => {
      if (config) {
        commandTest.command.config = config
      }
      runTestCommand(index, commandTest, (error) => {
        expect(error).toBeTruthy()
        index++
        return callback(null)
      })
    }, () => {
      done()
    })
  })
})
