/** 
 * An auxiliary class that contains utility functions.
 */

// Converts a string to title case
function toTitleCase(str) {
    // Random code I found on stack overflow
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

// Capitalizes the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// This is an extension of the String class to provide string formatting functionality. 
// In order to see how this formatting function is utilized, see taskBar.js. In essence, 
// any bracketed number in a string, i.e., "Hi {0}, how are you?', will be replaced by the
// corresponding parameter sent to the function
String.prototype.format = String.prototype.f = function() {
    var s = this,
            i = arguments.length;
    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

// Adds padding to a word to ensure that it is of the specified size
function pad(word, size, padder) {
    var paddedWord = "" + word;
    while (paddedWord.length < size) {
        paddedWord = padder + paddedWord;
    }
    return paddedWord;
}