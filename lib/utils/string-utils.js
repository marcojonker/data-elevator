/**
 * StringUtils
 * Utilities for manipulating strings
 * 
**/

'use strict'

/**
 * Constructor
 */
var StringUtils = function() {
};

/**
 * Remove quotes from a string of text
 * @param text
 */
StringUtils.removeQuotes = function(text) {
    return text.replace(/['"]+/g, '');
};

module.exports = StringUtils;