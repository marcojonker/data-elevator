/**
 * CommandLineParser
 * Component to help parsing commandlines
**/

'use strict'

/**************************************************************************
 * Private methods
 **************************************************************************/

/**
 * Remove quotes from string
 * @param text - string
 * @result string
 */
var _removeQuotes = function(text) {
    return text.replace(/['"]+/g, '');
}

/**
 * Create lookup table for process arguments
 * @result object
 */
var _createArgumentLookupFromProcessArguments = function() {
    var cmdArguments = process.argv.slice(2)
    var lookup = {};
    
    cmdArguments.forEach(function(cmdArgument) {
        var keyValue = cmdArgument.split('=');
        
        if(keyValue.length == 1 ) {
            lookup[keyValue[0]] = true;
        } else if(keyValue.length == 2) {
            lookup[keyValue[0]] = _removeQuotes(keyValue[1]);
        }
    })
    
    return lookup;
}

/**************************************************************************
 * Defines
 **************************************************************************/

var CommandLineArgumentTypes = {
    KEYVALUE: 'KEYVALUE',
    COMMAND: 'COMMAND'
    
}

var CommandLineArgumentDataTypes = {
    BOOLEAN: 'BOOLEAN',
    NUMBER: 'NUMBER',
    STRING: 'STRING'
}

/**************************************************************************
 * CommandLineArgument class
 **************************************************************************/
 
/**
 * CommandLineArgument Constructor
 * @param propertyName - string
 * @param required - boolean
 * @param argumentName - string
 * @param alias - string
 * @param dataType - CommandLineArgumentDataTypes
 * @param type - CommandLineArgumentTypes
 * @param defaultValue
 */
var CommandLineArgument = function(propertyName, required, argumentName, alias, dataType, type, defaultValue)  {
     if(!propertyName) {
        throw new Error("'propertyName' parameter not defined");
    }
    
    if(required === undefined || required === null) {
        throw new Error("'required' parameter not defined");
    }
    
    if(!argumentName) {
        throw new Error("'argumentName' parameter not defined");
    }    

    this.propertyName = propertyName;
    this.required = Boolean(required);
    this.argumentName = argumentName;
    this.alias = (alias !== undefined) ? alias : null;
    this.dataType = dataType ? dataType : CommandLineArgumentDataTypes.STRING;
    this.type = type ? type : CommandLineArgumentTypes.KEYVALUE;
    this.defaultValue = (defaultValue !== undefined) ? defaultValue : null;;
}

/**
 * Create string argument 
 * Examples:
 * --dir="/var/www/test"
 * -d="/var/www/test"
 *
 * @param propertyName - string
 * @param required - boolean
 * @param argumentName - string
 * @param alias - string
 * @param defaultValue - string
 */
CommandLineArgument.stringArgument = function(propertyName, required, argumentName, alias, defaultValue) {
    return new CommandLineArgument(
                        propertyName, 
                        required, 
                        argumentName, 
                        alias, 
                        CommandLineArgumentDataTypes.STRING, 
                        CommandLineArgumentTypes.KEYVALUE, 
                        defaultValue);
}

/**
 * Create boolean argument 
 * Examples:
 * --force
 * -f
 *
 * @param propertyName - string
 * @param required - boolean
 * @param argumentName - string
 * @param alias - string
 * @param defaultValue - string
 */
CommandLineArgument.booleanArgument = function(propertyName, required, argumentName, alias, defaultValue) {
    return new CommandLineArgument(
                        propertyName, 
                        required, 
                        argumentName, 
                        alias, 
                        CommandLineArgumentDataTypes.BOOLEAN, 
                        CommandLineArgumentTypes.KEYVALUE, 
                        defaultValue);
}

/**
 * Create number argument 
 * Examples:
 * --level=1
 * -l=1
 *
 * @param propertyName - string
 * @param required - boolean
 * @param argumentName - string
 * @param alias - string
 * @param defaultValue - string
 */
CommandLineArgument.numberArgument = function(propertyName, required, argumentName, alias, defaultValue) {
    return new CommandLineArgument(
                        propertyName, 
                        required, 
                        argumentName, 
                        alias, 
                        CommandLineArgumentDataTypes.NUMBER, 
                        CommandLineArgumentTypes.KEYVALUE, 
                        defaultValue);
}


/**
 * Create command 
 * Examples:
 * init
 *
 * @param propertyName - string
 * @param required - boolean
 * @param argumentName - string
 * @param alias - string
 */
CommandLineArgument.commandArgument = function(propertyName, required, argumentName, alias) {
    return new CommandLineArgument(
                        propertyName, 
                        required, 
                        argumentName, 
                        alias, 
                        CommandLineArgumentDataTypes.STRING, 
                        CommandLineArgumentTypes.COMMAND, 
                        null);
} 

/**************************************************************************
 * CommandLine class
 **************************************************************************/

/**
 * CommandLine constructor
 * @param commandLineArguments - array
 * @param defaultArgument - array or null
 * @thows Error
 */
var CommandLine = function(commandLineArguments, defaultArguments) {
    this.commandLineArguments = [];
    if(Array.isArray(commandLineArguments)) {
        this.commandLineArguments = commandLineArguments;
    } else {
        throw new Error("Invalid argument 'commandLineArguments', value should be of type 'array'");
    }
    
    //Append the default arguments
    if(Array.isArray(defaultArguments)) {
        this.commandLineArguments = this.commandLineArguments.concat(defaultArguments);
    } 
}

/**
 * Validate the datatype of the properties of a command
 * @param command
 * @return boolean
 * @throws Error
 */
CommandLine.prototype.validateCommand = function(command) {
    
    if(!command) {
        throw new Error("Invalid argument 'command', value should be of type 'object'");
    }
    var value = null;
    var validatedCommand = JSON.parse(JSON.stringify(command));
    
    //Validate the data type values for each argument
    this.commandLineArguments.forEach(function(commandLineArgument) {
        var value = command[commandLineArgument.propertyName];
        
        //Validate type
        if(value !== null) {
            switch(commandLineArgument.dataType) {
                case CommandLineArgumentDataTypes.BOOLEAN:
                    value = Boolean(value);
                    break;
                case CommandLineArgumentDataTypes.NUMBER: 
                    value = Number(value);
                    if(isNaN(value)) {
                        value = null;
                    }
                    break;
                case CommandLineArgumentDataTypes.STRING: 
                    value = String(value);
                    break;
                default: {
                    result = false;
                    throw new Error("Invalid CommandLine definition");
                }
            }
            
            if(value !== null) {
                validatedCommand[commandLineArgument.propertyName] = value;
            } else {
                throw new Error("Invalid argument type for property " + commandLineArgument.propertyName);
            }
        } 
    });
    
    return validatedCommand;
}

/**
 * Create command from argument lookup
 * @param argument lookup
 * @result command
 * @throws Error
 */
CommandLine.prototype.commandFromLookup = function(argumentLookup) {
    var command = {};
    var result = null;
    var found = true;
    
    //Check all the arguments
    for(var i = 0; i < this.commandLineArguments.length; i++) {
        
        var commandLineArgument =  this.commandLineArguments[i];
        var value = argumentLookup[commandLineArgument.argumentName];
        
        //If value was not found then try the alias if avaliable
        if(value === undefined && commandLineArgument.alias && argumentLookup[commandLineArgument.alias]) {
            value = argumentLookup[commandLineArgument.alias];
        }
        
        //If the argument was required and not found then the command is not valid
        if(commandLineArgument.required == true && (value === undefined || value === null)) {
            found = false;
            break;
        //Handle command argument
        } else if(commandLineArgument.type === CommandLineArgumentTypes.COMMAND){
            command[commandLineArgument.propertyName] = commandLineArgument.argumentName;
        //Handle key value argument
        } else {
            value = (value !== undefined) ? value : null;
            command[commandLineArgument.propertyName] = value ? value : commandLineArgument.defaultValue; 
        }
    }
        
    return (found === true) ? this.validateCommand(command) : null;
} 

/**************************************************************************
 * CommandLineParser class
 **************************************************************************/

/**
 * CommandLineParser constructor
 */
var CommandLineParser = function(commandLines) {
    if(Array.isArray(commandLines)) {
        this.commandLines = commandLines;
    } else {
        throw new Error("Invalid argument 'commandLines', value should be of type 'array'");
    }
};

/**
 * Parse commandline
 */
CommandLineParser.prototype.parse = function() {
    var lookup = _createArgumentLookupFromProcessArguments();
    var command = null;
    
    for(var i = 0; i < this.commandLines.length; i++) {
        var command = this.commandLines[i].commandFromLookup(lookup);
        if(command !== null) {
            break;
        }
    }
    
    return command;
};

/**************************************************************************
 * CommandLineParser class
 **************************************************************************/

module.exports = {
    CommandLineParser : CommandLineParser,
    CommandLine : CommandLine,
    CommandLineArgument: CommandLineArgument,
    CommandLineArgumentDataTypes: CommandLineArgumentDataTypes,
    CommandLineArgumentTypes: CommandLineArgumentTypes,
}
     