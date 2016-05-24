/**
 * MigrationStatus
 * Model for migration status
**/

'use strict'

/**
 * Constructor
 */
var MigrationStatus = function() {
    this.timestamp = null;
    this.identifier = null;
    this.direction = null;
};

module.exports = MigrationStatus;