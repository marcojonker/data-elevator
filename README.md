# DATA ELEVATOR #

The data elevator is an easy to use and very flexible utility for migrating data sources. Every floor is a migration and the current level the current active migration.

# QUICKSTART #

1 Install
```
npm install data-elevator
```
2 Construct a new data elevator for the project.
```
node ./node-modules/data-elevator construct
```
3 Add a new migration.
```
node ./data-elevator/elevator add --name="add phone number to users"
```
4 Enter you migration code in the generated floor file located in './data-elevator/floors/'.

5 Move the elevator to migrate data.
```
node ./data-elevator/elevator move top
node ./data-elevator/elevator move ground
node ./data-elevator/elevator move 2
```

# CONFIGURATION #

* **levelControllerConfig.fileName:** Name of the file to store the current elevator level in

```
var config = {
    levelControllerConfig: {
        fileName: "current_level.json"
    }
}
```

# FEATURES #

* **Floor templates**: Base template for all migration floors.
* **Custom level controllers**: Easily implement custom storage of the current migration level in any kind of data source like MongoDb, Postgres or a custom webservice.
* **Custom loggers**: Implement your own logger. 
* **onInitialize**:  Initialize any kind of custom component needed during the migrations process on beforehand.

# EXTENSIONS #

Some custom level controller implementations are already available in NPM:

* data-elevator-elasticsearch ([npm](https://www.npmjs.com/package/data-elevator-elasticsearch), [bitbucket](https://bitbucket.org/cacadu/data-elevator-elasticsearch/overview)) - store elevator migration levels in elasticsearch
* data-elevator-mongodb ([npm](https://www.npmjs.com/package/data-elevator-mongodb), [bitbucket](https://bitbucket.org/cacadu/data-elevator-mongodb/overview)) - store elevator migration levels in mongodb
* data-elevator-mysql ([npm](https://www.npmjs.com/package/data-elevator-mysql), [bitbucket](https://bitbucket.org/cacadu/data-elevator-mysql/overview)) - store elevator migration levels in mysql
* data-elevator-postgres ([npm](https://www.npmjs.com/package/data-elevator-postgres), [bitbucket](https://bitbucket.org/cacadu/data-elevator-postgres/overview)) - store elevator migration levels in postgres
* data-elevator-sqlite3 ([npm](https://www.npmjs.com/package/data-elevator-sqlite3), [bitbucket](https://bitbucket.org/cacadu/data-elevator-sqlite3/overview)) - store elevator migration levels in sqlite3

# COMMANDS #

Parameters explained:

```
--<parameter_name> (<alias>, <r=required, o=optional>) <description>     
```

### CONSTRUCT ###

Construct a new data elevator in you project. In principle this command is only performed once per project.

```
node ./node-modules/data-elevator construct
```

### ADD ###

A new floor file will be created in which data migrations can be implemented. It is recommended to use the '--name' parameters for easier identification of the purpose of a floor.

```
node ./<working-dir>/elevator add --name=<name>
    
Parameters:
    --name=        (-n=, o) Custom name of the floor

Examples:
    node ./data-elevator/elevator add -n="migrating users"
```

### MOVE ###

Elevator will move and perform the migrations for each floor passed by. Use 'ground' to move to ground floor and 'top' to move to the top floor.

```
node ./<working-dir>/elevator move <floor>
    
Examples:
    node ./data-elevator/elevator move top
    node ./data-elevator/elevator move 5
    node ./data-elevator/elevator move ground
```

### STATUS ###

Display the last action of the elevator.

```
node ./<working-dir>/elevator status
```

### LIST ###

Display a list of all floors.

```
node ./<working-dir>/elevator list
```

### ADDITIONAL PARAMETERS ###

The parameters can be applied to any command

```
Parameters:
    --config-dir=  (-c=, o) Data elevator config dir (default=./data-elevator)
    --working-dir= (-w=, o) Data elevator (def=./data-elevator)
    --verbose      (-v,  o) Verbose mode
```

# FLOOR TEMPLATE #

When a new floor is added the file 'floor-template.js' from the working directory is used as the template. Alterations to floor template are added to new floors. The minimal template contains at least the 'onUp' and 'onDown' function.

```
module.exports = {
    /**
     * Data transformation that need to be performed when migrating the data up
     * @param floorWorkerParameters - instance of FloorWorkerParameters
     * @param callback(error) - If an error is returned then all the subsequent migration will not be handled
     */
    onUp : function(floorWorkerParameters, callback) {
        return callback(null);
    }, 
    /**
     * Data transformation that need to be performed when migrating the data down
     * @param floorWorkerParameters - instance of FloorWorkerParameters
     * @param callback(error) - If an error is returned then all the subsequent migration will not be handled
     */
    onDown : function(floorWorkerParameters, callback) {
        return callback(null);
    }
}
```

### FloorWorkerParameters ###

The FloorWorkerParameters gives access to the current configuration, the logger and the current floor object. 

```
var FloorWorkerParameters = function(config, logger, floor) {
    this.config = config;
    this.floor = floor;
    this.logger = logger;
};
```

# CUSTOM STUFF #

All the custom stuff can be implemented in '<working-dir>/elevator.js'.

```
/**
 * Elevator
 * Data elevator
**/

'use strict'

var util = require('util');
var ElevatorBase = require('data-elevator/lib/elevator-engine/elevator-base');
var ConsoleLogger = require('data-elevator/lib/logger/console-logger');
var FileLevelController = require('data-elevator/lib/level-controllers/file-level-controller');

/**
 * Constructor
 * @param logger
 * @param LevelController
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


var elevator = new Elevator(new ConsoleLogger(false), FileLevelController);

//Run the elevator
elevator.run(function(error) { });
```

### Initializing custom components ###

The method onInitialize an onUnInitialize can be overwritten to initialize custom components that need to be accessed during the migrations but only need to be initialized ones.

### Custom logger ###

The first parameter of the constructor the the Elevator class can take a custom logger. If this parameter is null the ConsoleLogger will be used. A custom logger must be derived from BaseLogger ('data-elevator/lib/logger/base-logger.js') and must implement all methods of the BaseLogger.

### Custom level controller ###

The custom level controller is what makes the data elevator extremely flexible. It provides the opportunity to store the current level of the elevator in any place needed just by plugging in your own level controller. So if there is the need to store the elevator level in a Postgres database of even a custom webservice just build a custom level controller and plug it in.

A custom level controller needs to be derived from BaseLevelController and needs to implement the methods 'saveCurrentLevel' and 'retrieveCurrentLevel'. A simple example of a custom level controller is shown below. *(Note: we left out all the error handling to keep the example short and to the point)*


```
/**
 * MyLevelController
**/

'use strict'

var util = require('util');
var fs = require('fs')
var BaseLevelController = require('data-elevator/lib/level-controllers/base-level-controller');
var Level = require('data-elevator/lib/level-controllers/level');

/**
 * Constructor
 * @param config
 */
var MyLevelController = function(config) {
    MyLevelController.super_.apply(this, arguments);
};

util.inherits(MyLevelController, BaseLevelController);

/**
 * Save the current level
 * @param level
 * @param callback(error)
 */
MyLevelController.prototype.saveCurrentLevel = function(level, callback) {
    fs.writeFileSync(config.levelControllerConfig.levelFilePath, JSON.stringify(level));
    return callback(null);
};

/**
 * Retrieve the current level
 * @param callback(error, level)
 */
MyLevelController.prototype.retrieveCurrentLevel = function(callback) {
    var json = fs.readFileSync(filePath, "utf8");
    return callback(error, Level.fromJson(json));
};

module.exports = MyLevelController;
```

After creating the custom level controller it needs to be plugin in to the elevator constuctor ('<working-dir>/elevator.js'):


```
var util = require('util');
var ElevatorBase = require('data-elevator/lib/elevator-engine/elevator-base');
var ConsoleLogger = require('data-elevator/lib/logger/console-logger');
var MyLevelController = require('<path-to>/my-level-controller.js');

/**
 * Constructor
 */
var Elevator = function(logger, LevelController) {
    Elevator.super_.apply(this, arguments);
};

util.inherits(Elevator, ElevatorBase);

var elevator = new Elevator(new ConsoleLogger(false), MyLevelController);

//Run the elevator
elevator.run(function(error) { });
```

# RUNNING FROM CODE #

The elevator can also run from code.

```
var util = require('util');
var ElevatorBase = require('data-elevator/lib/elevator-engine/elevator-base.js');
var ConsoleLogger = require('data-elevator/lib/logger/console-logger');
var FileLevelController = require('data-elevator/lib/level-controllers/file-level-controller');

/**
 * Constructor
 */
var Elevator = function(logger, LevelController) {
    Elevator.super_.apply(this, arguments);
};

util.inherits(Elevator, ElevatorBase);

var elevator = new Elevator(new ConsoleLogger(false), FileLevelController);

elevator.runCommand({'command': 'help'}, function(error) {});
elevator.runCommand({'command': 'add', 'name': 'update users', 'workingDir': '.\data-elevator'}, function(error) {});
elevator.runCommand({'command': 'move', 'floor':2, 'workingDir': '.\data-elevator'}, , function(error) {});
elevator.runCommand({'command': 'status', 'workingDir': '.\data-elevator'} , function(error) {});
```