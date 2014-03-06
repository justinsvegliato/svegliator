/** 
 * The scanner class analyzes each token to ensure that they are valid. In other words,
 * this class checks if each word is part of the language.
 */

function Scanner() {};

// I gotta give credit where credit is due - this regex is almost 
// directly pulled from Chris's code because he's the man.
Scanner.DELIMITER_PATTERN = /([a-z]+)|(\d+)|("[^"]*")|(==)|(!=)|(\S)/g;

// Analyzes the input to ensure that each word is valid
Scanner.scan = function(input) {
    // The list to be populated with tokens
    var tokens = [];
    
    // Splits the input by new lines to get each line
    var lines = input.trim().split("\n");
    
    // Iterates through each line but then splits each line up by valid delimiters
    lexer:
    for (var lineNumber = 1; lineNumber <= lines.length; lineNumber++) {
        // Trims the white space off the current line
        var line = lines[lineNumber - 1].trim();
        
        // Splits the line up by valid delimiters if the line exists
        if (line) {
            // Retrieves all the lexemes that need to be checked
            var candidateLexemes = line.match(Scanner.DELIMITER_PATTERN);
            
            // Iterates through each lexeme to ensure validity
            for (var i = 0; i < candidateLexemes.length; i++) {
                var candidateLexeme = candidateLexemes[i];
                
                // Retrieves a token based on the value of the lexeme
                var token = Scanner.findToken(candidateLexeme, lineNumber);
                
                // Checks if the token is of a specific kind if 
                // it exists otherwise prints an error
                if (token) {
                    // Quits out of lexing if the end of file token is found or if an
                    // unexpected quote is found. If those conditions are not true, the
                    // parser checks if the token is a string. If none of the conditions
                    // are true, then the token is valid and should be added to the list
                    // of valid tokens.
                    if (token.kind === Token.Kind.END_OF_FILE) {
                        // Add token to the valid list of tokens
                        Scanner.addToken(token, tokens);
                        
                        // Print out a warning if the end of file token is found before the end of the file
                        if ((lineNumber < lines.length) || (i < candidateLexemes.length - 1)) {
                            LogDisplay.logScannerWarningResult("Unexpected end of file character", lineNumber, candidateLexeme);
                        }
                        
                        // Jump out of the lexer (you know you love this Alan)
                        break lexer;
                    } else if (token.kind === Token.Kind.QUOTE) {
                        LogDisplay.logScannerErrorResult("Found unexpected quote", lineNumber, candidateLexeme);
                        break lexer;
                    } else if (token.kind === Token.Kind.STRING) {
                        // Gets the open quote, string, and close quote tokens
                        var openQuoteToken = Scanner.findToken(token.value.charAt(0), lineNumber);
                        var closeQuoteToken = Scanner.findToken(token.value.charAt(token.value.length - 1), lineNumber);                        
                        token.value = token.value.slice(1, token.value.length - 1);
                        
                        // Adds the open quote, string, and close quote tokens to the list
                        // of valid tokens
                        Scanner.addToken(openQuoteToken, tokens);
                        Scanner.addToken(token, tokens);
                        Scanner.addToken(closeQuoteToken, tokens);
                    } else {
                        Scanner.addToken(token, tokens);
                    } 
                } else {
                    LogDisplay.logScannerErrorResult("Invalid token", lineNumber, candidateLexeme);
                }
            }
        }
    }
    
    // Prints a warning and adds the end of file character to the list of tokens if there 
    // were no errors from the scanner and the last token is not an end of file character    
    if (LogDisplay.scannerErrorResults.length <= 0) {
        var lastToken = tokens[tokens.length - 1];
        // Checks if the last token is an end of file symbols
        if (!lastToken.is(Token.Kind.END_OF_FILE)) {
            // Creates the end of file token
            var token = Token.create(Token.Kind.END_OF_FILE, lastToken.lineNumber, "$");
            tokens.push(token);
            LogDisplay.logScannerWarningResult("Missing end of file symbol - added symbol", token.lineNumber, "$");
        }
    }

    // We can finally return the list of valid tokens that the parser will bitch about.
    return tokens;
};

// Finds the token corresponding to the lexeme by iterating through each token kind
Scanner.findToken = function(lexeme, lineNumber) {
    // Iterates through each kind of token
    for (var key in Token.Kind) {
        var kind = Token.Kind[key];
        // Create the token if this lexeme matches the current kind's pattern
        if (lexeme.match(kind.pattern)) {
            return kind.token(lineNumber, lexeme);
        }
    }
    return false;
};

// Adds the specified token to the list of valid tokens
Scanner.addToken = function(token, tokens) {
    tokens.push(token);
    LogDisplay.logScannerInfoResult(token);
};