function Parser() {};

Parser.parse = function(tokens) {
    Parser.tokens = tokens;
    Parser.parseProgram();
};

Parser.parseProgram = function() {
    Parser.parseBlock();
    
    var endOfFileCandidate = Parser.getNextToken();
    if (Parser.isTokenOfKind(endOfFileCandidate, Token.Kind.END_OF_FILE, true)) {
        
    }

    return;
};

Parser.parseBlock = function() {
    var openBraceCandidate = Parser.getNextToken();
    if (Parser.isTokenOfKind(openBraceCandidate, Token.Kind.OPEN_BRACE, true)) {
        LogDisplay.logParserParsingResult(openBraceCandidate, "Block", "{ StatementList }");
        Parser.parseStatementList();
    } else {
        
    }
    
    var closeBraceCandidate = Parser.getNextToken();
    if (Parser.isTokenOfKind(closeBraceCandidate, Token.Kind.CLOSE_BRACE, true)) {      
    } else {
        // TODO
    }
        
    return;
};

Parser.parseStatementList = function() {  
    var token = Parser.peekAtNextToken();
    var kinds = [Token.Kind.PRINT, Token.Kind.IDENTIFIER, 
                Token.Kind.VARIABLE_TYPE, Token.Kind.WHILE,
                Token.Kind.IF, Token.Kind.OPEN_BRACE];
    if (Parser.isTokenOfKind(token, kinds, false)) {
        Parser.parseStatement();
        Parser.parseStatementList();
    }    
    return;
};

Parser.parseStatement = function() {
    var nextToken = Parser.peekAtNextToken();
    if (Parser.parsePrintStatement()) {        
        // FINISHED
    } else if (Parser.isTokenOfKind(nextToken, Token.Kind.IDENTIFIER, true)) {
        Parser.parseAssignmentStatement();
    } else if (Parser.isTokenOfKind(nextToken, Token.Kind.VARIABLE_TYPE, true)) {
        Parser.parseVariableDeclaration();
    } else if (Parser.isTokenOfKind(nextToken, Token.Kind.WHILE, true)) {
        Parser.parseWhileStatement();
    } else if (Parser.isTokenOfKind(nextToken, Token.Kind.IF, true)) {
        Parser.parseIfStatement();
    } else if (Parser.isTokenOfKind(nextToken, Token.Kind.OPEN_BRACE, true)) {
        Parser.parseBlock();
    } else {
        
    }
//    if (Parser.isTokenOfKind(nextToken, Token.Kind.PRINT, true)) {        
//        Parser.parsePrintStatement();
//    } else if (Parser.isTokenOfKind(nextToken, Token.Kind.IDENTIFIER, true)) {
//        Parser.parseAssignmentStatement();
//    } else if (Parser.isTokenOfKind(nextToken, Token.Kind.VARIABLE_TYPE, true)) {
//        Parser.parseVariableDeclaration();
//    } else if (Parser.isTokenOfKind(nextToken, Token.Kind.WHILE, true)) {
//        Parser.parseWhileStatement();
//    } else if (Parser.isTokenOfKind(nextToken, Token.Kind.IF, true)) {
//        Parser.parseIfStatement();
//    } else if (Parser.isTokenOfKind(nextToken, Token.Kind.OPEN_BRACE, true)) {
//        Parser.parseBlock();
//    } else {
//        
//    }
    return;
};

Parser.parseAssignmentStatement = function() {
    LogDisplay.logParserParsingResult(nextToken, "AssignmentStatement", "Id = Expr");
    Parser.parseIdentifier();
    var assignmentOperatorCandidate = Parser.getNextToken();
    if (Parser.isTokenOfKind(assignmentOperatorCandidate, Token.Kind.ASSIGNMENT_OPERATOR, true)) {
        Parser.parseExpression();
    }
    return;
};

Parser.parseWhileStatement = function() {
    var whileCandidate = Parser.getNextToken();
    if (Parser.isTokenOfKind(whileCandidate, Token.Kind.WHILE, false)) {
        LogDisplay.logParserParsingResult(nextToken, "WhileStatement", "while BooleanExpr Block");
        Parser.parseBooleanExpression();    
        Parser.parseBlock();
    }
    return;
};

Parser.parseIfStatement = function() {
    LogDisplay.logParserParsingResult(nextToken, "IfStatement", "if BooleanExpr Block");
    var ifCandidate = Parser.getNextToken();
    if (Parser.isTokenOfKind(ifCandidate, Token.Kind.IF, false)) {
        Parser.parseBooleanExpression();
        Parser.parseBlock();
    }
    return;
};

Parser.parseVariableDeclaration = function() {
    LogDisplay.logParserParsingResult(nextToken, "VarDecl", "type Id");
    var variableDeclarationCandidate = Parser.getNextToken();
    if (Parser.isTokenOfKind(variableDeclarationCandidate, Token.Kind.VARIABLE_TYPE, true)) {
        Parser.parseIdentifier();
    }
    return;
};

Parser.parsePrintStatement = function() {
    var nextToken = Parser.getNextToken()
    if (Parser.isTokenOfKind(nextToken, Token.Kind.PRINT, true)) { 
        LogDisplay.logParserParsingResult(nextToken, "PrintStatement", "print ( Expr )");
        if (Parser.isTokenOfKind(Parser.getNextToken(), Token.Kind.OPEN_PARENTHESIS, true)) {
            Parser.parseExpression();
            Parser.isTokenOfKind(Parser.getNextToken(), Token.Kind.CLOSE_PARENTHESIS, true);
        }    
        return true;
    }
    return false;
//    if (Parser.isTokenOfKind(Parser.getNextToken(), Token.Kind.PRINT, true)) {
//        LogDisplay.logParserParsingResult(nextToken, "PrintStatement", "print ( Expr )");
//        if (Parser.isTokenOfKind(Parser.getNextToken(), Token.Kind.OPEN_PARENTHESIS, true)) {
//            Parser.parseExpression();
//            Parser.isTokenOfKind(Parser.getNextToken(), Token.Kind.CLOSE_PARENTHESIS, true);
//        }        
//    }
//    return;
};

Parser.parseExpression = function() {
    var nextToken = Parser.peekAtNextToken();
    if (Parser.isTokenOfKind(nextToken, Token.Kind.DIGIT, false)) {
        LogDisplay.logParserParsingResult(nextToken, "IntExpression");
        Parser.parseIntegerExpression();
    } else if (Parser.isTokenOfKind(nextToken, Token.Kind.QUOTE, false)) {
        LogDisplay.logParserParsingResult(nextToken, "StringExpression");
        Parser.parseStringExpression();
    } else if (Parser.isTokenOfKind(nextToken, Token.Kind.BOOLEAN, false) || Parser.isTokenOfKind(nextToken, Token.Kind.OPEN_PARENTHESIS, false)) {
        LogDisplay.logParserParsingResult(nextToken, "BooleanExpression");
        Parser.parseBooleanExpression();
    } else if (Parser.isTokenOfKind(nextToken, Token.Kind.IDENTIFIER, false)) {
        LogDisplay.logParserParsingResult(nextToken, "Identifier");
        Parser.parseIdentifier();
    }
    return;
};

Parser.parseIdentifier = function() {
    var identifierCandidate = Parser.getNextToken();
    if (Parser.isTokenOfKind(identifierCandidate, Token.Kind.IDENTIFIER, false)) {
    } else {
        // MISSING IDENTIFIER
    }
    return;
};

Parser.parseStringExpression = function() {
    var openingQuoteCandidate = Parser.getNextToken();
    if (Parser.isTokenOfKind(openingQuoteCandidate, Token.Kind.QUOTE, true)) {  
        var stringCandidate = Parser.getNextToken();
        if (Parser.isTokenOfKind(stringCandidate, Token.Kind.STRING, true)) {
            var closingQuoteCandidate = Parser.getNextToken();
            if (Parser.isTokenOfKind(closingQuoteCandidate, Token.Kind.QUOTE, true)) {
                var fullStringExpression = openingQuoteCandidate.value + stringCandidate.value + closingQuoteCandidate.value;
            } else {
                // MISSING CLOSING QUOTE
            }
        } else {
            // TYPE MISMATCH
        }
    } else {
        // MISSING OPENING QUOTE
    }
    return;
};

Parser.parseBooleanExpression = function () {
    var booleanExpressionCandidate = Parser.getNextToken();
    if (Parser.isTokenOfKind(booleanExpressionCandidate, Token.Kind.OPEN_PARENTHESIS, false)) {
        Parser.parseExpression();
        var nextToken = Parser.getNextToken();
        if (Parser.isTokenOfKind(nextToken, Token.Kind.EQUALITY_OPERATOR, true) || Parser.isTokenOfKind(nextToken, Token.Kind.INEQUALITY_OPERATOR, true)) {
            Parser.parseExpression();
            Parser.getNextToken();
        }
    } else if (Parser.isTokenOfKind(booleanExpressionCandidate, Token.Kind.BOOLEAN, false)) {
    } else {
        // TODO
    }
};

Parser.parseIntegerExpression = function() {
    var nextToken = Parser.getNextToken();
    if (Parser.isTokenOfKind(Parser.peekAtNextToken(), Token.Kind.ADDITION_OPERATOR, false)) {
        Parser.getNextToken();
        Parser.parseExpression();       
    } 
    return;
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