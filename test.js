/**
 * Test function for data elevator
**/

'use strict'

var async = require('async');
var ElevatorBase = require('./lib/elevator-base.js');
var ConsoleLogger = require('./lib/logger/console-logger.js');
var LevelController = require('./lib/controllers/level-controllers/mongodb-level-controller.js');

var elevator = new ElevatorBase(new ConsoleLogger(true), LevelController);

var commandTests = [
    { title: "DISPLAY HELP", command: 'help', options: {} }, 
    { title: "CONSTRUCT ELEVATOR", command: 'construct', options: { "working-dir": "./test-data-elevator" } },
    { title: "ADD FLOOR", command: 'add', options: { "working-dir": "./test-data-elevator" } },
    { title: "ADD FLOOR", command: 'add', options: { "working-dir": "./test-data-elevator", "name": "second floor" } },
    { title: "ADD FLOOR", command: 'add', options: { "working-dir": "./test-data-elevator" } },
    { title: "ADD FLOOR", command: 'add', options: { "working-dir": "./test-data-elevator" } },
    { title: "ADD FLOOR", command: 'add', options: { "working-dir": "./test-data-elevator", "name": "update invoice data"} },
    { title: "ADD FLOOR", command: 'add', options: { "working-dir": "./test-data-elevator" } },
    { title: "ADD FLOOR", command: 'add', options: { "working-dir": "./test-data-elevator", "name": "add phone number to users" } },
    { title: "ADD FLOOR", command: 'add', options: { "working-dir": "./test-data-elevator" } },
    { title: "ADD FLOOR", command: 'add', options: { "working-dir": "./test-data-elevator" } },
    { title: "MOVE UP TO TOP FLOOR", command: 'up', options: { "working-dir": "./test-data-elevator" } },
    { title: "MOVE UP TO TOP FLOOR", command: 'up', options: { "working-dir": "./test-data-elevator" } },
    { title: "MOVE DOWN TO 5", command: 'down', options: { "working-dir": "./test-data-elevator", "floor": 5 } },
    { title: "MOVE DOWN TO 2", command: 'down', options: { "working-dir": "./test-data-elevator", "floor": 2 } },
    { title: "MOVE DOWN TO 2", command: 'down', options: { "working-dir": "./test-data-elevator", "floor": 2 } },
    { title: "MOVE UP TO 2", command: 'up', options: { "working-dir": "./test-data-elevator", "floor": 2 } },
    { title: "MOVE UP TO 6", command: 'up', options: { "working-dir": "./test-data-elevator", "floor": 6 } },
    { title: "Print status", command: 'status', options: { "working-dir": "./test-data-elevator" } },
]

var _runTest = function(index, commandTest, callback) {
    console.log("*****************************************************************");
    console.log("*** TEST " + index + ": " + commandTest.title);
    console.log("*****************************************************************");
    elevator.runCommand(commandTest.command, commandTest.options, function(error) {
        if(error) {
            console.log("RESULT: FAILED\r\n");
        } else {
            console.log("RESULT: SUCCEEDED\r\n");
        }
        return callback(error);
    });
} 

var index = 1;

async.eachSeries(commandTests, function(commandTest, callback) {
    _runTest(index, commandTest, callback);
    index++;
}, function(error) {
    console.log("Remove the folder './test-data-elevator' to run the test again.");
 });
