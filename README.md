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

* Add a new floor
```
#!shell

node ./data-elevator/elevator.js add
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