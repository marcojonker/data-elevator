/**
 * Migrator
 * Processor for migrations
 * 
**/

'use strict'

var MigratorBase = require('./lib/migrator-base.js');
var ConsoleLogger = require('./lib/logger/console-logger.js');

var util = require('util');

/**
 * Constructor
 */
var Migrator = function() {
    Migrator.super_.apply(this, arguments);
};

util.inherits(Migrator, MigratorBase);

var migrator = new Migrator(new ConsoleLogger(false));

migrator.run(function(error) {
    if(error) {
        console.log(error.message);
    }
})

