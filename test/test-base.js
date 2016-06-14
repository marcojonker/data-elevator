/**
 * TestBase
 * Base class for tests
 * 
**/

'use strict'

var async = require('async');
var path = require('path');
var ElevatorBase = require('../lib/elevator-engine/elevator-base.js');
var ConsoleLogger = require('../lib/logger/console-logger.js');
var FileLevelController = require('../lib/level-controllers/file-level-controller.js');

/**
 * Constructor
 * @param config
 * @param moduleDir
 */
var TestBase = function(config, moduleDir) {
    this.config = config;
    this.elevator = new ElevatorBase(new ConsoleLogger(true), FileLevelController, moduleDir);
};

/**
 * Run a test
 * @param index
 * @param command
 * @param callback(error)
 */
TestBase.prototype.runTest = function(index, commandTest, callback) {
    console.log("*****************************************************************");
    console.log("*** TEST " + index + ": " + commandTest.title);
    console.log("*****************************************************************");
    this.elevator.runCommand(commandTest.command, function(error) {
        if(error) {
            console.log("RESULT: FAILED\r\n");
        } else {
            console.log("RESULT: SUCCEEDED\r\n");
        }
        return callback(error);
    });
};

/**
 * Run a default set of commands
 */
TestBase.prototype.runDefaultCommands = function() {
    var commands = [
        { title: "DISPLAY HELP",        command: { command: 'help' } }, 
        { title: "CONSTRUCT ELEVATOR",  command: { command: "construct", workingDir: "./test-data-elevator" } },
        { title: "ADD FLOOR",           command: { command: "add", workingDir: "./test-data-elevator", verbose:true} },
        { title: "ADD FLOOR",           command: { command: "add", workingDir: "./test-data-elevator", name: "second floor" } },
        { title: "ADD FLOOR",           command: { command: "add", workingDir: "./test-data-elevator" } },
        { title: "ADD FLOOR",           command: { command: "add", workingDir: "./test-data-elevator" } },
        { title: "ADD FLOOR",           command: { command: "add", workingDir: "./test-data-elevator", name: "update invoice data"} },
        { title: "ADD FLOOR",           command: { command: "add", workingDir: "./test-data-elevator" } },
        { title: "ADD FLOOR",           command: { command: "add", workingDir: "./test-data-elevator", name: "add phone number to users" } },
        { title: "ADD FLOOR",           command: { command: "add", workingDir: "./test-data-elevator" } },
        { title: "ADD FLOOR",           command: { command: "add", workingDir: "./test-data-elevator" } },
        { title: "MOVE TO TOP",         command: { command: "move", workingDir: "./test-data-elevator", "floor": "top" } },
        { title: "MOVE TO GROUND",      command: { command: "move", workingDir: "./test-data-elevator", "floor": "ground" } },
        { title: "MOVE DOWN TO 5",      command: { command: "move", workingDir: "./test-data-elevator", "floor": 5 } },
        { title: "MOVE DOWN TO 2",      command: { command: "move", workingDir: "./test-data-elevator", "floor": 2 } },
        { title: "MOVE UP TO 2",        command: { command: "move", workingDir: "./test-data-elevator", "floor": 2 } },
        { title: "MOVE UP TO 6",        command: { command: "move", workingDir: "./test-data-elevator", "floor": 6 } },
        { title: "PRINT STATUS",        command: { command: "status", workingDir: "./test-data-elevator" } },
        { title: "PRINT LIST",          command: { command: "list", workingDir: "./test-data-elevator" } },
        { title: "MOVE TO GROUND",      command: { command: "move", workingDir: "./test-data-elevator", "floor": "ground" } },
        { title: "PRINT STATUS",        command: { command: "status", workingDir: "./test-data-elevator" } },
        { title: "PRINT LIST",          command: { command: "list", workingDir: "./test-data-elevator" } },
        { title: "MOVE TO TOP",         command: { command: "move", workingDir: "./test-data-elevator", "floor": "top" } },
        { title: "PRINT STATUS",        command: { command: "status", workingDir: "./test-data-elevator" } },
        { title: "PRINT LIST",          command: { command: "list", workingDir: "./test-data-elevator" } },
    ];

    this.run(commands);   
} 

/**
 * Run commands
 * @param commands
 */
TestBase.prototype.run = function(commands) {
    var index = 1;
    var self = this;
    async.eachSeries(commands, function(command, callback) {
        if(self.config) {
            command.config = self.config;
        }
        self.runTest(index, command, callback);
        index++;
    }, function(error) {
        console.log("Remove the folder './test-data-elevator' to run the test again.");
    });    
};

module.exports = TestBase;

