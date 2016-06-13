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
    var lookup = {
        values: [],
        keyValues: {}
    };
    
    cmdArguments.forEach(function(cmdArgument) {
        var keyValue = cmdArgument.split('=');
        //Flag of key value type
        if(typeof keyValue[0] === 'string' && keyValue[0].charAt(0) === '-') {
            var value = keyValue.length === 2 ? _removeQuotes(keyValue[1]) : true;
            var keyName = keyValue[0];
            lookup.keyValues[keyName] = value;
        //Value type
        } else {
            lookup.values.push(_removeQuotes(cmdArgument));
        }
    })
    
    return lookup;
}

var _parseDataType = function(value, dataType) {
    var parsedValue = null;

    if(value) {
        switch(dataType) {
            case CommandLineArgumentDataTypes.BOOLEAN:
                parsedValue = Boolean(value);
                break;
            case CommandLineArgumentDataTypes.NUMBER: 
                parsedValue = Number(value);
                if(isNaN(parsedValue)) {
                    parsedValue = null;
                }
                break;
            case CommandLineArgumentDataTypes.STRING: 
                parsedValue = String(value);
                break;
            default: {
                throw new Error("Unknown data type '" + dataType + "'.");
            }
        }
        
        if(parsedValue === null) {
            throw new Error("Could not parse value '" + value + "' to data type '" + dataType + ".");
        }
    }


    return parsedValue;
}

/**************************************************************************
 * Defines
 **************************************************************************/

var CommandLineArgumentTypes = {
    KEYVALUE: 'KEYVALUE',
    VALUE: 'VALUE'
    
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
 * @param allowedValues
 * @param regularExpression
 */
var CommandLineArgument = function(propertyName, required, argumentName, alias, dataType, type, defaultValue, allowedValues, regularExpression)  {
     if(!propertyName) {
        throw new Error("'propertyName' parameter not defined.");
    }
    
    if(required === undefined || required === null) {
        throw new Error("'required' parameter not defined.");
    }

    if(type !== CommandLineArgumentTypes.KEYVALUE && type !== CommandLineArgumentTypes.VALUE) {
        throw new Error("'type' parameter invalid.");
    }    


    if(!argumentName && type === CommandLineArgumentTypes.KEYVALUE) {
        throw new Error("'argumentName' parameter not defined.");
    }    

    if(allowedValues && Array.isArray(allowedValues) === false) {
        throw new Error("'allowedValues' parameter should be an array.");
        
    }

    this.propertyName = propertyName;
    this.required = Boolean(required);
    this.argumentName = argumentName;
    this.alias = (alias !== undefined) ? alias : null;
    this.dataType = dataType ? dataType : CommandLineArgumentDataTypes.STRING;
    this.type = type;
    this.defaultValue = defaultValue;
    this.allowedValues = allowedValues ? allowedValues : null;
    this.regularExpression = regularExpression ? regularExpression : null;
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
 * @param allowedValues
 * @param regularExpression
 */
CommandLineArgument.stringKeyValueArgument = function(propertyName, required, argumentName, alias, defaultValue, allowedValues, regularExpression) {
    return new CommandLineArgument(
                        propertyName, 
                        required, 
                        argumentName, 
                        alias, 
                        CommandLineArgumentDataTypes.STRING, 
                        CommandLineArgumentTypes.KEYVALUE, 
                        defaultValue, 
                        allowedValues, 
                        regularExpression);
}

/**
 * Create boolean argument 
 * Examples:
 * --force
 * -f
 *
 * @param propertyName - string
 * @param argumentName - string
 * @param alias - string
 */
CommandLineArgument.flagArgument = function(propertyName, argumentName, alias) {
    return new CommandLineArgument(
                        propertyName, 
                        false, 
                        argumentName, 
                        alias, 
                        CommandLineArgumentDataTypes.BOOLEAN, 
                        CommandLineArgumentTypes.KEYVALUE, 
                        false,
                        null, 
                        null); 
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
 * @param allowedValues
 */
CommandLineArgument.numberKeyValueArgument = function(propertyName, required, argumentName, alias, defaultValue, allowedValues) {
    return new CommandLineArgument(
                        propertyName, 
                        required, 
                        argumentName, 
                        alias, 
                        CommandLineArgumentDataTypes.NUMBER, 
                        CommandLineArgumentTypes.KEYVALUE, 
                        defaultValue, 
                        allowedValues, 
                        null);
}


/**
 * Create command 
 * Examples:
 * init
 *
 * @param propertyName - string
 * @param required - boolean
 * @param allowedValues
 * @param regularExpression
 */
CommandLineArgument.stringValueArgument = function(propertyName, required, allowedValues, regularExpression) {
    return new CommandLineArgument(
                        propertyName, 
                        required, 
                        null, 
                        null, 
                        CommandLineArgumentDataTypes.STRING, 
                        CommandLineArgumentTypes.VALUE, 
                        null, 
                        allowedValues, 
                        regularExpression);
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
 * @param allowedValues
 */
CommandLineArgument.numberValueArgument = function(propertyName, required, allowedValues) {
    return new CommandLineArgument(
                        propertyName, 
                        required, 
                        null, 
                        null, 
                        CommandLineArgumentDataTypes.NUMBER, 
                        CommandLineArgumentTypes.VALUE, 
                        null, 
                        allowedValues,
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
 * Create command from argument lookup
 * @param argument lookup
 * @result command
 * @throws Error
 */
CommandLine.prototype.commandFromLookup = function(argumentLookup) {
    var command = {};
    var values = argumentLookup.values;
    var keyValues = argumentLookup.keyValues;
    var valueIndex = 0;
    var error = null;

    //Check all the arguments
    this.commandLineArguments.forEach(function(arg) {
        if(arg.type === CommandLineArgumentTypes.KEYVALUE) {
            if(keyValues[arg.argumentName] !== undefined) {
                command[arg.propertyName] = keyValues[arg.argumentName];
            } else if (keyValues[arg.alias] !== undefined) {
                command[arg.propertyName] = keyValues[arg.alias];
            }
        } else if(arg.type === CommandLineArgumentTypes.VALUE) {
            if(values.length > valueIndex) {
                command[arg.propertyName] = values[valueIndex];
                valueIndex++;
            }
        } else {
            throw new Error('Invalid command line argument type');
        }

        //Set the default value if avaiable
        if(command[arg.propertyName] === undefined && arg.defaultValue !== undefined) {
            command[arg.propertyName] = arg.defaultValue;
        }

        //Parse data to the correct data type
        if(command[arg.propertyName] !== undefined) {
            command[arg.propertyName] = _parseDataType(command[arg.propertyName], arg.dataType);
        }
    });

    //Check all the arguments
    this.commandLineArguments.forEach(function(arg) {
        //Check if required field exists
        if(arg.required === true && command[arg.propertyName] === undefined) {
            throw new Error("Required field ' " +  arg.argumentName + "' is missing.");
        }

        //Check if value is allowed
        if(arg.allowedValues && (arg.required === true || command[arg.propertyName] !== undefined) ) {
            if(arg.allowedValues.indexOf(command[arg.propertyName]) === -1) {
                throw new Error("Value for field ' " +  arg.argumentName + "' is not allowed.");
            }
        };

        //Check if value meets regex
        if(arg.regularExpression && (arg.required === true || command[arg.propertyName] !== undefined) ) {
            if(!arg.regularExpression.test(command[arg.propertyName])) {
                throw new Error("Value for field field ' " +  arg.argumentName + "' is invalid.");
            }
        }
    });

    return command;
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
        var commandLine = this.commandLines[i];
        try{
            command = commandLine.commandFromLookup(lookup);
            break;
        } catch(error) {
            command = null;
        }
    };
    
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
     