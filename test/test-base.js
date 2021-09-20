/**
 * TestBase
 * Base class for tests
 * 
**/
var async = require('async');
var path = require('path');
var FileUtils = require('../lib/utils/file-utils.js').FileUtils;
var ElevatorBase = require('../lib/elevator-engine/elevator-base.js');
var ConsoleLogger = require('../lib/logger/console-logger.js');

class TestBase {
    /**
     * Constructor
     * @param config
     * @param moduleDir
     */
    constructor(moduleDir, LevelController) {
        const configPath = path.join(process.cwd(), '_data-elevator-test-config.js');
        if (FileUtils.fileExists(configPath)) {
            this.config = require(path.join(process.cwd(), '_data-elevator-test-config.js'));
            this.elevator = new ElevatorBase(new ConsoleLogger(true), LevelController, moduleDir);
        } else {
            throw new Error('Test configuration file not found at path: ' + configPath);
        }
    }

    /**
     * Run a test
     * @param index
     * @param command
     * @param callback(error)
     */
    runTest(index, commandTest, callback) {
        console.log("*****************************************************************");
        console.log("*** TEST " + index + ": " + commandTest.title);
        console.log("*****************************************************************");
        this.elevator.runCommand(commandTest.command, function (error) {
            if (error) {
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
    runDefaultCommandTests() {
        const commandTests = [
            { title: "DISPLAY HELP", command: { command: 'help', workingDir: "./_data-elevator-test" } },
            { title: "CONSTRUCT ELEVATOR", command: { command: "construct", workingDir: "./_data-elevator-test" } },
            { title: "ADD FLOOR", command: { command: "add", workingDir: "./_data-elevator-test", verbose: true } },
            { title: "ADD FLOOR", command: { command: "add", workingDir: "./_data-elevator-test", name: "second floor" } },
            { title: "ADD FLOOR", command: { command: "add", workingDir: "./_data-elevator-test" } },
            { title: "ADD FLOOR", command: { command: "add", workingDir: "./_data-elevator-test" } },
            { title: "ADD FLOOR", command: { command: "add", workingDir: "./_data-elevator-test", name: "update invoice data" } },
            { title: "ADD FLOOR", command: { command: "add", workingDir: "./_data-elevator-test" } },
            { title: "ADD FLOOR", command: { command: "add", workingDir: "./_data-elevator-test", name: "add phone number to users" } },
            { title: "ADD FLOOR", command: { command: "add", workingDir: "./_data-elevator-test" } },
            { title: "ADD FLOOR", command: { command: "add", workingDir: "./_data-elevator-test" } },
            { title: "MOVE TO TOP", command: { command: "move", workingDir: "./_data-elevator-test", "floor": "top" } },
            { title: "MOVE TO GROUND", command: { command: "move", workingDir: "./_data-elevator-test", "floor": "ground" } },
            { title: "MOVE DOWN TO 5", command: { command: "move", workingDir: "./_data-elevator-test", "floor": 5 } },
            { title: "MOVE DOWN TO 2", command: { command: "move", workingDir: "./_data-elevator-test", "floor": 2 } },
            { title: "MOVE UP TO 2", command: { command: "move", workingDir: "./_data-elevator-test", "floor": 2 } },
            { title: "MOVE UP TO 6", command: { command: "move", workingDir: "./_data-elevator-test", "floor": 6 } },
            { title: "PRINT STATUS", command: { command: "status", workingDir: "./_data-elevator-test" } },
            { title: "PRINT LIST", command: { command: "list", workingDir: "./_data-elevator-test" } },
            { title: "MOVE TO GROUND", command: { command: "move", workingDir: "./_data-elevator-test", "floor": "ground" } },
            { title: "PRINT STATUS", command: { command: "status", workingDir: "./_data-elevator-test" } },
            { title: "PRINT LIST", command: { command: "list", workingDir: "./_data-elevator-test" } },
            { title: "MOVE TO TOP", command: { command: "move", workingDir: "./_data-elevator-test", "floor": "top" } },
            { title: "PRINT STATUS", command: { command: "status", workingDir: "./_data-elevator-test" } },
            { title: "PRINT LIST", command: { command: "list", workingDir: "./_data-elevator-test" } },
        ];

        this.run(commandTests);
    }

    /**
     * Run commands
     * @param commands
     */
    run(commandTests) {
        let index = 1;

        async.eachSeries(commandTests, (commandTest, callback) => {
            if (this.config) {
                commandTest.command.config = this.config;
            }
            this.runTest(index, commandTest, callback);
            index++;
        }, function (error) {
            console.log("Remove the folder './_data-elevator-test' to run the test again.");
        });
    }
}

module.exports = TestBase;
