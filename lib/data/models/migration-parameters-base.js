/**
 * MigrationParametersBase
 * Parameters passed into each migration
 * 
**/

'use strict'

/**
 * Constructor
 */
var MigrationParametersBase = function(config, migrationStatusProvider, migrationFile) {
    this.config = config;
    this.migrationFile = migrationFile;
};

module.exports = MigrationParametersBase;