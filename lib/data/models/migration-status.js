/**
 * MigrationStatus
 * Model for migration status
**/

'use strict'

/**
 * Constructor
 */
var MigrationStatus = function() {
    this.lastMigrationDate = null;
    this.lastMigrationIdentifier = null;
};

module.exports = MigrationStatus;