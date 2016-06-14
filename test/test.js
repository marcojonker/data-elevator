/**
 * Test function for data elevator
**/

'use strict'

var TestBase = require('./test-base');
var path = require('path');
var FileLevelController = require('../lib/level-controllers/file-level-controller.js');

var test = new TestBase(path.normalize(path.join(__dirname, '../')), FileLevelController);
test.runDefaultCommands();
