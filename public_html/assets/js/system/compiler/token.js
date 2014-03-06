/** 
 * A class that contains all information regarding tokens
 */

// Creates a new token by taking in it's kind, line number, and value
function Token(kind, lineNumber, value) {
    this.kind = kind;
    this.lineNumber = lineNumber;
    this.value = value;  
    
    // Checks if this token is of the specified type
    this.is = function(kind) {
        return this.kind === kind;
    };
};

// Function similar to a factory - in essence it just creates tokens
Token.create = function(kind, lineNumber, value) {
    return new Token(kind, lineNumber, value);
};

// An enumerated field that keeps track of the name, pattern, and token constructor for
// each kind
Token.Kind = {                
    IDENTIFIER: {
        name: "identifier",
        pattern: /^[a-zA-Z]$/,
        token: function(lineNumber, value) {
            return Token.create(Token.Kind.IDENTIFIER, lineNumber, value);
        }
    },
    OPEN_BRACE: {
        name: "open brace",
        pattern: /^{$/,
        token: function(lineNumber, value) {
            return Token.create(Token.Kind.OPEN_BRACE, lineNumber, value);
        }
    },
    CLOSE_BRACE: {
        name: "close brace",
        pattern: /^}$/,
        token: function(lineNumber, value) {
            return Token.create(Token.Kind.CLOSE_BRACE, lineNumber, value);
        }
    },
    OPEN_PARENTHESIS: {
        name: "open parenthesis",
        pattern: /^\($/,
        token: function(lineNumber, value) {
            return Token.create(Token.Kind.OPEN_PARENTHESIS, lineNumber, value);
        }
    },
    CLOSE_PARENTHESIS: {
        name: "close parenthesis",
        pattern: /^\)$/,
        token: function(lineNumber, value) {
            return Token.create(Token.Kind.CLOSE_PARENTHESIS, lineNumber, value);
        }
    },
    END_OF_FILE: {
        name: "end of file symbol",
        pattern: /^\$$/,
        token: function(lineNumber, value) {
            return Token.create(Token.Kind.END_OF_FILE, lineNumber, value);
        }
    },
    VARIABLE_TYPE: {
        name: "variable type",
        pattern: /^(int|string|boolean)$/,
        token: function(lineNumber, value) {
            return Token.create(Token.Kind.VARIABLE_TYPE, lineNumber, value);
        }
    },
    EQUALITY_OPERATOR: {
        name: "equality operator",
        pattern: /^==$/,
        token: function(lineNumber, value) {
            return Token.create(Token.Kind.EQUALITY_OPERATOR, lineNumber, value);
        }
    },
    INEQUALITY_OPERATOR: {
        name: "inequality operator",
        pattern: /^!=$/,
        token: function(lineNumber, value) {
            return Token.create(Token.Kind.INEQUALITY_OPERATOR, lineNumber, value);
        }
    },
    ADDITION_OPERATOR: {
        name: "addition operator",
        pattern: /^\+$/,
        token: function(lineNumber, value) {
            return Token.create(Token.Kind.ADDITION_OPERATOR, lineNumber, value);
        }
    },
    ASSIGNMENT_OPERATOR: {
        name: "assignment operator",
        pattern: /^=$/,
        token: function(lineNumber, value) {
            return Token.create(Token.Kind.ASSIGNMENT_OPERATOR, lineNumber, value);
        }
    },
    WHILE: {
        name: "while",
        pattern: /^while$/,
        token: function(lineNumber, value) {
            return Token.create(Token.Kind.WHILE, lineNumber, value);
        }
    },
    IF: {
        name: "if",
        pattern: /^if$/,
        token: function(lineNumber, value) {
            return Token.create(Token.Kind.IF, lineNumber, value);
        }
    },
    BOOLEAN: {
        name: "boolean value",
        pattern: /^(true|false)$/,
        token: function(lineNumber, value) {
            return Token.create(Token.Kind.BOOLEAN, lineNumber, value);
        }
    },
    DIGIT: {
        name: "digit",
        pattern: /^\d$/,
        token: function(lineNumber, value) {
            return Token.create(Token.Kind.DIGIT, lineNumber, value);
        }
    },
    PRINT: {
        name: "print",
        pattern: /^print$/,
        token: function(lineNumber, value) {
            return Token.create(Token.Kind.PRINT, lineNumber, value);
        }
    },
    QUOTE: {
        name: "quote",
        pattern: /^"$/,
        token: function(lineNumber, value) {
            return Token.create(Token.Kind.QUOTE, lineNumber, value);
        }
    },
    STRING: {
        name: "string",
        pattern: /^".*"$/,
        token: function(lineNumber, value) {
            return Token.create(Token.Kind.STRING, lineNumber, value);
        }
    }
};