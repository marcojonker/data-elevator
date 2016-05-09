'use strict';

var commandLineArgs = require('command-line-args');

var cli = commandLineArgs([
  { name: 'help', alias:'?', type: Boolean },
  { name: 'create', type: Boolean },
  { name: 'init', type: Boolean },
  { name: 'up', type: Boolean },
  { name: 'down', type: Boolean },
  { name: 'debug', type: Boolean },
  { name: 'migrations-dir', type: String, default: './migrator/migrations'},
  { name: 'config-dir', type: String, default: './migrator'},
  { name: 'timestamp', alias:'t', type: String },
  { name: 'version', alias:'v', type: String },
  { name: 'description', alias: 'd', type: String }
]);

var options = cli.parse();
var commandHandler = null;
var command = "help";

//Print help information
if(options.help === false) {  
    if(options.init === true) {
        command = "init";  
    } else if(options.create === true) {
        command = "create";  
    } else if(options.up === true) {
        command = "up";  
    } else if(options.down === true) {
        command = "down";  
    } 
}

var CommandHandler = require('migrator-' + command + '.js');
var commandHandler = new CommandHandler(options);
if(commandHandler !== null) {
    commandHandler.run(options);
}




console.log(options);

