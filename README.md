# DATA ELEVATOR? #

The data elevator is an easy to use and very flexible utility for migrating data sources. The whole project and terminology is based on a real elevator. Every floor is a migration and the current level the current active migration.

### Why is it easy to use? ###

It is easy to used because the default out of the box configuration will be up and running migrations storing the current migrations levels in file or MongoDb within minutes.

### Why is it very flexible? ###

It is flexible because the data elevator allows many simple customizations like:

* Floor templates gives total control over the generated floors.
* Custom level controllers provide easy to store current migration level in any kind of data source. 
* Custom loggers provide the option to use any kind of logger need. 
* onInitialize provide the possibility to initialize any kind of custom component needed during the migration process

### Features ###

* Custom floor template for generated floor files
* Custom location of configuration file
* Custom location of floor files
* Out of the box storage of migration status in 'file' or 'mongodb'
* Custom storage of the current migrations status of your environment by implementing a custom LevelController
* Custom logger
* Display current migration status

# INSTALL #

* Add the data-elevator to packages.json
* Install the module
```
#!shell

npm install
```

# QUICKSTART #
*
Note: It is best to run commands from the root directory of you project because the project handles directories relative to the location the process was started from.*

* Construct a new data elevator for the project.

```
#!shell
node ./node-modules/data-elevator/elevator.js construct

```

* Add a new floor.

```
#!shell
node ./data-elevator/elevator.js add --name="add phone number to users"

```

* Enter you migration code in the generated floor file located in './data-elevator/floors/'.
* Move the elevator up to migrate your data.

```
#!shell

node ./data-elevator/elevator.js up

```

# COMMANDS #

Parameters explained:

```
#!shell

--<parameter_name> (<alias>, <r=required, o=optional>) <description>     

```
### construct ###

Construct a new data elevator in you project. In principle this command is only performed once per project.

```
#!shell
    Command: 'node ./node-modules/data-elevator/elevator.js construct'
    
    Parameters:
        --working-dir= (-w, o) Data elevator working dir (default=./data-elevator)
        --verbose      (-v, o) Verbose mode

    Examples:
        node ./node-modules/data-elevator/elevator.js construct
        node ./node-modules/data-elevator/elevator.js construct  -c="./my-data-elevator"

```

### add ###

A new floor file will be created in which data migrations can be implemented. It is recommended to use the '--name' parameters for easier identification of the purpose of a floor.

```
#!shell

    Command:   'node ./data-elevator/elevator.js add'
    
    Parameters:
        --name         (-n, o) Custom name of the floor
        --working-dir= (-w, o) Data elevator working dir (default=./data-elevator)
        --config-dir=  (-c, o) Data elevator config dir (default=./data-elevator)
        --verbose      (-v, o) Verbose mode

    Examples:
        node ./data-elevator/elevator.js add
        node ./data-elevator/elevator.js add -n="migrating users" -c="./config"

```

### up ###

Elevator will move up and perform the migrations for each floor passed by.

```
#!shell

    Command:    'node ./data-elevator/elevator.js up'
    
    Parameters:
        --floor       (-f, o) Floor to move to, if undefined elevator moves to the top   
        --working-dir (-w, o) Data elevator working dir (default=./data-elevator)
        --config-dir  (-c, o) Data elevator config dir (default=./data-elevator)
        --verbose     (-v, o) Verbose mode

    Examples:
        node ./data-elevator/elevator.js up
        node ./data-elevator/elevator.js up -f=5 -c="./config"

```

### down ###

Elevator will move down and perform the migrations for each floor passed by.

```
#!shell

    Command:    'node ./data-elevator/elevator.js down'

    Parameters:
        --floor       (-f, r) Floor to move to
        --working-dir (-w, o) Data elevator working dir (default=./data-elevator)
        --config-dir  (-c, o) Data elevator config dir (default=./data-elevator)
        --verbose     (-v, o) Verbose mode


    Examples:
        node ./data-elevator/elevator.js down -f=2
        node ./data-elevator/elevator.js down -f=5 -c="./config"

```

### status ###

Display the last action of the elevator.

```
#!shell

    Command:    'node ./data-elevator/elevator.js status'

    Parameters:
        --working-dir (-w, o) Data elevator working dir (default=./data-elevator)
        --config-dir  (-c, o) Data elevator config dir (default=./data-elevator)
        --verbose     (-v, o) Verbose mode

    Examples:
        node ./data-elevator/elevator.js status
        node ./data-elevator/elevator.js status -c="./config"

```

# CONFIGURATION #

* levelControllerType: The level controller is used to store the current state of migration. Two options can be selected. *MONGODB*: Used to store the level current level of the elevator in a MongoDb database. This is useful when the application runs at multiple servers with one data source. And *FILE*: Used to store the current level of the elevator in a plain file.
* mongoDbLevelControllerConfig.collectionName: Name of the collection to store the current elevator level in
* mongoDbLevelControllerConfig.connectionUrl: Connection url for MongoDb
* mongoDbLevelControllerConfig.connectionOptions: Options for connecting to the MongoDb database (options for method 'MongoClient.connect')
* fileLevelControllerConfig.fileName: Name of the file to store the current elevator level in

```
#!javascript

var config = {
    levelControllerType: "MONGODB", //Use FILE for file level controller config
    mongoDbLevelControllerConfig : {
       collectionName: "_data_elevator",
       connectionOptions: null,
       connectionUrl: null
    },
    fileLevelControllerConfig: {
        fileName: "current_level.json"
    }
}

```

# FLOOR TEMPLATE #

When a new floor is added the file 'floor-template.js' from the working directory is used as the template. Alterations to floor template are added to new floors. The minimal template contains at least the 'onUp' and 'onDown' function.

```
#!javascript
module.exports = {
    /**
     * Data transformation that need to be performed when migrating the data up
     * @param migrationParameters - instance of FloorWorkerParameters
     * @param callback(error) - If an error is returned then all the subsequent migration will not be handled
     */
    onUp : function(migrationParameters, callback) {
        return callback(null);
    }, 
    /**
     * Data transformation that need to be performed when migrating the data down
     * @param migrationParameters - instance of FloorWorkerParameters
     * @param callback(error) - If an error is returned then all the subsequent migration will not be handled
     */
    onDown : function(migrationParameters, callback) {
        return callback(null);
    }
}

```

### FloorWorkerParameters ###

The FloorWorkerParameters gives access to the current configuration, the logger and the current floor object. 

```
#!javascript

var FloorWorkerParameters = function(config, logger, floor) {
    this.config = config;
    this.floor = floor;
    this.logger = logger;
};

```



# CUSTOM STUFF #

All the custom can be implemented in '<working-dir>/elevator.js'. 


```
#!javascript

/**
 * Elevator
**/

'use strict'

var util = require('util');
var ElevatorBase = require('data-elevator/elevator-base.js');

/**
 * Constructor
 */
var Elevator = function(logger, LevelController) {
    Elevator.super_.apply(this, arguments);
};

util.inherits(Elevator, ElevatorBase);

/**
 * Initialize custom components after all migrations have been applied
 * @param callback(error)
 */
ElevatorBase.prototype.onInitialize = function(callback) {
    return callback(null);
};

/**
 * Uninitiailze custom components after all migrations have been applied
 * @param callback(error)
 */
ElevatorBase.prototype.onUnInitialize = function(callback) {
    return callback(null);
}

//A custom logger or level controller can be set here if needed
var elevator = new Elevator(null, null);

//Run the elevator
elevator.run(function(error) { });

```

### Initializing custom components ###

The method onInitialize an onUnInitialize can be overwritten to initialize custom components that need to be accessed during the migrations but only need to be initialized ones.

### Custom logger ###

The first parameter of the constructor the the Elevator class can take a custom logger. If this parameter is null the ConsoleLogger will be used. A custom logger must be derived from BaseLogger ('data-elevator/lib/logger/base-logger.js') and must implement all methods of the BaseLogger.

### Custom level controller ###

The custom level controller is what makes the data elevator extremely flexible. It provides the opportunity to store the current level of the elevator in any place needed just by plugging in your own level controller. So if only have a Postgres database or a webservice to store your elevator level, just build a custom level controller and plug it in.


A custom level controller needs to be derived from BaseLevelController ('data-elevator/lib/controllers/level-controllers/base-level-controller.js') and needs to implement the methods 'saveCurrentLevel' and 'retrieveCurrentLevel'. A good example for this is the 'FileLevelController' which stores and retrieves the current level from a plain file:


```
#!javascript

/**
 * FileLevelController
 * Store and retrieve current level from file
**/

'use strict'

var util = require('util');
var fs = require('fs')
var BaseLevelController = require('./base-level-controller.js');
var Errors = require('../../errors/elevator-errors.js');
var Level = require('./level.js');
var FileUtils = require('../../utils/file-utils').FileUtils;
var CreateDirectory = require('../../utils/file-utils').CreateDirectory;

/**
 * Constructor
 * @param config
 */
var FileLevelController = function(config) {
    FileLevelController.super_.apply(this, arguments);
};

util.inherits(FileLevelController, BaseLevelController);

/**
 * Save the current level
 * @param level
 * @param callback(error)
 */
FileLevelController.prototype.saveCurrentLevel = function(level, callback) {
    var config = this.config.fileLevelControllerConfig;
    
    try {
        FileUtils.createDirectory(new CreateDirectory(config.levelDir, false));
        fs.writeFileSync(config.levelFilePath, JSON.stringify(level));
        return callback(null);
    } catch(error) {
        return callback(Errors.generalError("Failed to write level file '" + config.levelFilePath + "'", error));
    }
};

/**
 * Retrieve the current level
 * @param callback(error, level)
 */
FileLevelController.prototype.retrieveCurrentLevel = function(callback) {
    var config = this.config.fileLevelControllerConfig;
    var level = null;
    try {
        if(FileUtils.fileExists(config.levelFilePath)) {
            var json = fs.readFileSync(config.levelFilePath, "utf8");
            level = Level.fromJson(json);
        }
        
        return callback(null, level);
    } catch(error) {
        return callback(Errors.generalError('Failed to read level file ' . config.levelFilePath, error));
    }
};

module.exports = FileLevelController;

```

After creating the custom level controller it needs to be plugin in to the elevator in the elevator constuctor in the projects elevator file ('<working-dir>/elevator.js'):


```
#!javascript

var util = require('util');
var ElevatorBase = require('data-elevator/elevator-base.js');
var MyCustomLevelController = require('<path-to>/my-custom-level-controller.js');

/**
 * Constructor
 */
var Elevator = function(logger, LevelController) {
    Elevator.super_.apply(this, arguments);
};

util.inherits(Elevator, ElevatorBase);

var elevator = new Elevator(null, MyCustomLevelController);

//Run the elevator
elevator.run(function(error) { });

```

# RUNNING FROM CODE #

The elevator can also run from code.

```
#!javascript

var util = require('util');
var ElevatorBase = require('data-elevator/elevator-base.js');

/**
 * Constructor
 */
var Elevator = function(logger, LevelController) {
    Elevator.super_.apply(this, arguments);
};

util.inherits(Elevator, ElevatorBase);

var elevator = new Elevator(null, null);

elevator.runCommand('help', {}, function(error) {});
elevator.runCommand('add', {'name': 'update users'}, function(error) {});
elevator.runCommand('up', , {'floor':3}, function(error) {});
elevator.runCommand('down', {'floor':2}, , function(error) {});
elevator.runCommand('status', {} , function(error) {});

```