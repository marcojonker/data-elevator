/**
 * Test function for data elevator
**/

'use strict'

var TestBase = require('./test-base');
var config = require('./test-config');
var path = require('path');

var test = new TestBase(config, path.normalize(path.join(__dirname, '../')));
test.runDefaultCommands();
