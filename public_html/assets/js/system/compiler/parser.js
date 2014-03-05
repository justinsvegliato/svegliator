function Parser() {};

Parser.parse = function(tokens) {
    Parser.tokens = tokens;
    SymbolTable.clear();
    Parser.scopeLevel = -1;
    
    if (!Parser.parseProgram()) {
        LogDisplay.logParserErrorResult("Expecting a block statement but received", Parser.peekAtNextToken());
        return false;
    }
    return true;
};

Parser.parseProgram = function() {
    if (Parser.parseBlock()) {
        var endOfFileSymbol = Parser.getNextToken();
        if (Parser.isTokenOfKind(endOfFileSymbol, Token.Kind.END_OF_FILE, true)) {
            return true;
        }                
        9
        return false;
    }
    return false;
};

Parser.parseBlock = function() {
    var openingBrace = Parser.peekAtNextToken();
    if (Parser.isTokenOfKind(openingBrace, Token.Kind.OPEN_BRACE, true)) {
        // CLEAN: Some scope shit
        Parser.scopeLevel++;
        SymbolTable.addScope();
        LogDisplay.logParserParsingResult(Parser.getNextToken(), "Block", "{ StatementList }");
        if (Parser.parseStatementList()) {
            var closingBrace = Parser.getNextToken();
            if (Parser.isTokenOfKind(closingBrace, Token.Kind.CLOSE_BRACE, true)) {
                // CLEAN: Some more scope shit
                Parser.scopeLevel--;
                return true;
            }
            LogDisplay.logParserErrorResult("Expecting closing brace but receved", closingBrace);
            return false;
        } 
        LogDisplay.logParserErrorResult("Expecting a statement list but receved", Parser.peekAtNextToken());
        return false;
    }
    return false; 
};

Parser.parseStatementList = function() {  
    var kinds = [Token.Kind.PRINT, Token.Kind.IDENTIFIER, 
                Token.Kind.VARIABLE_TYPE, Token.Kind.WHILE,
                Token.Kind.IF, Token.Kind.OPEN_BRACE];
    var nextToken = Parser.peekAtNextToken();
    if (Parser.isTokenOfKind(nextToken, kinds, false)) {
        if (Parser.parseStatement()) {
            if (Parser.parseStatementList()) {
                return true;
            }
            LogDisplay.logParserErrorResult("Expecting a print statement, an identifier, a variable type, a while statement, an if statement, or a block statement but receved", Parser.peekAtNextToken());
            return false;
        }
        LogDisplay.logParserErrorResult("Expecting a print statement, an identifier, a variable type, a while statement, an if statement, or a block statement but receved", Parser.peekAtNextToken());
        return false;
    }

    if (Parser.isTokenOfKind(nextToken, Token.Kind.CLOSE_BRACE, true)) {
        return true;
    }    
    
    return false;
};

Parser.parseStatement = function() {
    if (Parser.parsePrintStatement()) {
        return true;
    } else if (Parser.parseAssignmentStatement()) {    
        return true;    
    } else if (Parser.parseVariableDeclaration()) {
        return true;
    } else if (Parser.parseWhileStatement()) {
        return true;
    } else if (Parser.parseIfStatement()) {
        return true;
    } else if (Parser.parseBlock()) {
        return true;
    } 
    return false;
};

Parser.parseAssignmentStatement = function() {
    if (Parser.isTokenOfKind(Parser.peekAtNextToken(), Token.Kind.IDENTIFIER, true)) {
        LogDisplay.logParserParsingResult(Parser.peekAtNextToken(), "AssignmentStatement", "Id = Expr");
        if (Parser.parseIdentifier()) {
            var assignmentOperator = Parser.getNextToken();
            if (Parser.isTokenOfKind(assignmentOperator, Token.Kind.ASSIGNMENT_OPERATOR, true)) {
                if (Parser.parseExpression()) {
                    return true;
                }
                LogDisplay.logParserErrorResult("Expecting expression but received", Parser.peekAtNextToken());
                return false;
            }
            LogDisplay.logParserErrorResult("Expecting assignment operator but received", assignmentOperator);
            return false;
        }
        LogDisplay.logParserErrorResult("Expecting identifier but received", Parser.peekAtNextToken());
        return false;
    }
    return false;
};

Parser.parseWhileStatement = function() {
    if (Parser.isTokenOfKind(Parser.peekAtNextToken(), Token.Kind.WHILE, true)) {
        LogDisplay.logParserParsingResult(Parser.getNextToken(), "WhileStatement", "while BooleanExpr Block");
        if (Parser.parseBooleanExpression()) {
            if (Parser.parseBlock()) {
                return true;
            }
            LogDisplay.logParserErrorResult("Expecting block but received", Parser.peekAtNextToken());
            return false;            
        }        
        LogDisplay.logParserErrorResult("Expecting expression but received", Parser.peekAtNextToken());
        return false;
    }
    return false;
};

Parser.parseIfStatement = function() {
    if (Parser.isTokenOfKind(Parser.peekAtNextToken(), Token.Kind.IF, true)) {
        LogDisplay.logParserParsingResult(Parser.getNextToken(), "IfStatement", "if BooleanExpr Block");
        if (Parser.parseBooleanExpression()) {
            if (Parser.parseBlock()) {
                return true;
            }
            LogDisplay.logParserErrorResult("Expecting block but received", Parser.peekAtNextToken());
            return false;
        }        
        LogDisplay.logParserErrorResult("Expecting expression but received", Parser.peekAtNextToken());
        return false;
    }
    return false;
};

Parser.parseVariableDeclaration = function() {
    if (Parser.isTokenOfKind(Parser.peekAtNextToken(), Token.Kind.VARIABLE_TYPE, true)) {
        var variableDeclaration = Parser.getNextToken();
        LogDisplay.logParserParsingResult(variableDeclaration, "VarDecl", "type Id");
        var id = Parser.peekAtNextToken();
        if (Parser.parseIdentifier()) {
            if (!SymbolTable.addSymbol(variableDeclaration.value, id.value, Parser.scopeLevel, variableDeclaration.lineNumber)) {
                LogDisplay.logParserErrorResult("Variable has already been declared", id);
            }
            return true;
        }
        LogDisplay.logParserErrorResult("Expecting identifier but received", id);
        return false;
    }
    return false;
};

Parser.parsePrintStatement = function() {
    if (Parser.isTokenOfKind(Parser.peekAtNextToken(), Token.Kind.PRINT, true)) { 
        LogDisplay.logParserParsingResult(Parser.getNextToken(), "PrintStatement", "print ( Expr )");
        var openingParenthesis = Parser.getNextToken();
        if (Parser.isTokenOfKind(openingParenthesis, Token.Kind.OPEN_PARENTHESIS, true)) {
            if (Parser.parseExpression()) {
                var closingParenthesis = Parser.getNextToken();
                if (Parser.isTokenOfKind(closingParenthesis, Token.Kind.CLOSE_PARENTHESIS, true)) {
                    return true;
                }
                LogDisplay.logParserErrorResult("Expecting closing parenthesis but received", closingParenthesis);
                return false;
            }
            LogDisplay.logParserErrorResult("Expecting block but received", Parser.peekAtNextToken());
            return false;
        }    
        LogDisplay.logParserErrorResult("Expecting opening parenthesis but received", openingParenthesis);
        return false;
    }
    return false;
};

Parser.parseExpression = function() {
    if (Parser.parseIntegerExpression()) {
        return true;
    } else if (Parser.parseIdentifier()) {   
        return true;
    } else if (Parser.parseStringExpression()) {
        return true;
    } else if (Parser.parseBooleanExpression()) {
        return true;
    } 
    return false;
};

Parser.parseIdentifier = function() {
    if (Parser.isTokenOfKind(Parser.peekAtNextToken(), Token.Kind.IDENTIFIER, true)) {
        LogDisplay.logParserParsingResult(Parser.getNextToken(), "Id", "char");
        return true;
    }
    return false;
};

Parser.parseStringExpression = function() {
    if (Parser.isTokenOfKind(Parser.peekAtNextToken(), Token.Kind.QUOTE, true)) {
        LogDisplay.logParserParsingResult(Parser.getNextToken(), "StringExpr", '" CharList "');
        var string = Parser.getNextToken();
        if (Parser.isTokenOfKind(string, Token.Kind.STRING, true)) {
            var quote = Parser.getNextToken();
            if (Parser.isTokenOfKind(quote, Token.Kind.QUOTE, true)) {
                return true;
            }   
            LogDisplay.logParserErrorResult("Expecting closing quote but received", quote);
            return false;
        }
        LogDisplay.logParserErrorResult("Expecting closing quote but received", string);
        return false;
    }
    return false;

};

Parser.parseBooleanExpression = function () {    
    if (Parser.isTokenOfKind(Parser.peekAtNextToken(), Token.Kind.BOOLEAN, true)) {
        LogDisplay.logParserParsingResult(Parser.getNextToken(), "BooleanExpr", "boolval");
        return true;
    }
    
    var openingParenthesis = Parser.peekAtNextToken();
    if (Parser.isTokenOfKind(openingParenthesis, Token.Kind.OPEN_PARENTHESIS, true)) {
        LogDisplay.logParserParsingResult(Parser.getNextToken(), "BooleanExpr", "( Expr boolop Expr )");
        if (Parser.parseExpression()) {
            var booleanOperator = Parser.getNextToken();
            if (Parser.isTokenOfKind(booleanOperator, Token.Kind.EQUALITY_OPERATOR, true) || Parser.isTokenOfKind(booleanOperator, Token.Kind.INEQUALITY_OPERATOR, true)) {
                if (Parser.parseExpression()) {
                    var closingParenthesis = Parser.getNextToken();
                    if (Parser.isTokenOfKind(closingParenthesis, Token.Kind.CLOSE_PARENTHESIS, true)) {
                        return true;
                    }
                    LogDisplay.logParserErrorResult("Expecting closing parenthesis but received", closingParenthesis);
                    return false;
                }
                LogDisplay.logParserErrorResult("Expecting expression but received", Parser.peekAtNextToken());
                return false;
            }       
            LogDisplay.logParserErrorResult("Expecting boolean operator but received", booleanOperator);
            return false;
        }
        LogDisplay.logParserErrorResult("Expecting expression but received", Parser.peekAtNextToken());
        return false;
    }
    return false;
};

Parser.parseIntegerExpression = function() {
    if (Parser.isTokenOfKind(Parser.peekAtNextToken(), Token.Kind.DIGIT, true)) {
        LogDisplay.logParserParsingResult(Parser.getNextToken(), "Integer", "shit");
        if (Parser.isTokenOfKind(Parser.peekAtNextToken(), Token.Kind.ADDITION_OPERATOR, true)) {
            Parser.getNextToken();
            if (Parser.parseExpression()) {
                return true;
            }     
            LogDisplay.logParserErrorResult("Expecting expression but received", Parser.peekAtNextToken());
            return false;
        } 
        return true;
    }    
    return false;
};

Parser.isTokenOfKind = function(nextToken, kinds, isVerbose) {
    if (!(kinds instanceof Array)) {
        kinds = [kinds];
    }   
    
    if (nextToken) {
        for (var i = 0; i < kinds.length; i++) {            
            var kind = kinds[i];
            if (isVerbose) {
                LogDisplay.logParserSearchingResult(nextToken, kind);
            }
            if (nextToken.is(kind)) {
                if (isVerbose) {
                    LogDisplay.logParserFoundResult(nextToken);
                }
                return true;
            }
        }
    }  
    return false;
};

Parser.getNextToken = function() {
    if (Parser.tokens.length <= 0) {
        return false;
    }
    
    var nextToken = Parser.tokens[0];
    Parser.tokens = Parser.tokens.slice(1);
    return nextToken;
};

Parser.peekAtNextToken = function() {
    if (Parser.tokens.length <= 0) {
        return false;
    }
    return Parser.tokens[0];
};