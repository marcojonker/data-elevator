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

# USAGE #

Parameters explained

```
#!shell

--<parameter_name> (<alias>, <r=required, o=optional>) <description>     

```
### Construct ###

Construct a new data elevator in you project. In principle this command is only performed once per project

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

### Add ###

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

### Up ###

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

### Down ###

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