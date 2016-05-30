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

/**
 * Pad a character before a string to fill it to a specific size
 * @param text
 * @param width
 * @param character
 */
StringUtils.padCharacter = function(text, width, character) {
  character = character || '0';
  text = text + '';
  return text.length >= width ? text : new Array(width - text.length + 1).join(character) + text;
}

module.exports = StringUtils;