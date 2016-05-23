/**
 * MigrationStatus
 * Model for migration status
**/

'use strict'

/**
 * Constructor
 */
var MigrationStatus = function() {
    this.lastMigrationTimeStamp = null;
    this.lastMigrationIdentifier = null;
};

module.exports = MigrationStatus;