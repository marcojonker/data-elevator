The data elevator is a utility for migrating data sources. The code is build based on a real elevator in which each 'floor' can contain specific data migrations. The current status of the elevator can be stored in a 'plain file' or 'mongodb' out of the box, but custom storage can easily be implemented by building a custom LevelController. 

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

* Create a new data elevator in you project
```
#!shell

node ./nodemodules/data-elevator/elevator.js construct
```

# USAGE #

### Add a floor ###

A new floor file will be created in which data migrations can be implemented.

```
#!shell

    Command:   'node ./data-elevator add'
    
    Parameters:
        --name         (-n, o) Custom name for the migration   
        --working-dir= (-w, o) Data elevator working dir (default=./data-elevator)
        --config-dir=  (-c, o) Data elevator config dir (default=./data-elevator)
        --verbose      (-v, o) Verbose mode

```

Additional parameters:



### Move up ###

Elevator will move up and perform the migrations of each floor it passes by.

```
#!shell

node ./data-elevator/elevator.js up
```





This README would normally document whatever steps are necessary to get your application up and running.

### Quick start ###

* Quick summary
* Version
* [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)

### Commands ###

### Configuration ###

### Source explained ###

elevator engine
floor controller
level controller