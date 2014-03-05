function Scanner() {};

// I gotta give credit where credit is due - this regex is almost 
// directly pulled from Chris's code because he's the man.
Scanner.DELIMITER_PATTERN = /([a-z]+)|(\d+)|("[^"]*")|(==)|(!=)|(\S)/g;

Scanner.scan = function(input) {
    var tokens = [];
    var lines = input.trim().split("\n");
    
    lexer:
    for (var lineNumber = 1; lineNumber <= lines.length; lineNumber++) {
        var line = lines[lineNumber - 1].trim();
        if (line) {
            var candidateLexemes = line.match(Scanner.DELIMITER_PATTERN);
            for (var i = 0; i < candidateLexemes.length; i++) {
                var candidateLexeme = candidateLexemes[i];
                var token = Scanner.findToken(candidateLexeme, lineNumber);
                if (token) {
                    if (token.kind === Token.Kind.END_OF_FILE) {
                        Scanner.addToken(token, tokens);
                        if ((lineNumber < lines.length) || (i < candidateLexemes.length - 1)) {
                            LogDisplay.logScannerWarningResult("Unexpected end of file character", lineNumber, candidateLexeme);
                        }
                        break lexer;
                    } else if (token.kind === Token.Kind.QUOTE) {
                        LogDisplay.logScannerErrorResult("Found unexpected quote", lineNumber, candidateLexeme);
                        break lexer;
                    } else if (token.kind === Token.Kind.STRING) {
                        var openQuoteToken = Scanner.findToken(token.value.charAt(0), lineNumber);
                        var closeQuoteToken = Scanner.findToken(token.value.charAt(token.value.length - 1), lineNumber);                        
                        token.value = token.value.slice(1, token.value.length - 1);                                                
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
    
    if (LogDisplay.scannerErrorResults.length <= 0) {
        var lastToken = tokens[tokens.length - 1];
        if (!lastToken.is(Token.Kind.END_OF_FILE)) {
            var token = Token.create(Token.Kind.END_OF_FILE, lastToken.lineNumber, "$");
            tokens.push(token);
            LogDisplay.logScannerWarningResult("Missing end of file symbol - added symbol", token.lineNumber, "$");
        }
    }

    return tokens;
};

Scanner.findToken = function(lexeme, lineNumber) {
    for (var key in Token.Kind) {
        var kind = Token.Kind[key];
        if (lexeme.match(kind.pattern)) {
            return kind.token(lineNumber, lexeme);
        }
    }
    return false;
};

Scanner.addToken = function(token, tokens) {
    tokens.push(token);
    LogDisplay.logScannerInfoResult(token);
};