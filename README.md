# Data elevator? #

The data elevator is a utility for migrating data sources. The code is build based on a real elevator in which each 'floor' can contain specific data migrations. The current status of the elevator can be stored in a 'plain file' or 'mongodb' out of the box, but custom storage can easily be implemented by building a custom LevelController. 

# Features #

* Custom template for generated floor files
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

# Configuration #


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




# Floor template #

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



# Custom stuff #

# Custom logger #

# Custom level controller #