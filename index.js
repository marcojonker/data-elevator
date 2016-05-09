'use strict';

var commandLineArgs = require('command-line-args');

var cli = commandLineArgs([
  { name: "command", type: String, multiple: false, defaultOption: true },
  { name: 'debug', type: Boolean },
  { name: 'migrations-dir', type: String, default: './migrator/migrations'},
  { name: 'config-dir', type: String, default: './migrator'},
  { name: 'timestamp', alias:'t', type: String },
  { name: 'version', alias:'v', type: String },
  { name: 'description', alias: 'd', type: String }
]);

var options = cli.parse();
var commandHandler = null;
var command = options.command ? options.command : "help";
var CommandHandler = require('./lib/migrator-' + command + '.js');

if(CommandHandler) {
    var commandHandler = new CommandHandler(options);

    if(commandHandler !== null) {
        commandHandler.run(function(error) {
            if(error) {
                console.log(error.message);
            }
        });
    }
} else  {
    console.log('Command not found: ' + command);
}
