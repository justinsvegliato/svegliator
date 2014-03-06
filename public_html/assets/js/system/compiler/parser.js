function Parser() {};

Parser.parse = function(tokens) {
    Parser.tokens = tokens;
    Parser.scopeLevel = -1;
    Parser.concreteSyntaxTree = new ConcreteSyntaxTree();
    Parser.symbolTable = new SymbolTable();

    if (!Parser.parseProgram()) {
        LogDisplay.logParserErrorResult("Expecting a block statement but received", Parser.peekAtNextToken());
        return false;
    }
    return Parser.concreteSyntaxTree;
};

Parser.parseProgram = function() {
    var programNode = Parser.concreteSyntaxTree.initializeTree(Nonterminal.Kind.PROGRAM);
    if (Parser.parseBlock(programNode)) {
        var endOfFileSymbol = Parser.getNextToken();
        if (Parser.isTokenOfKind(endOfFileSymbol, Token.Kind.END_OF_FILE, true)) {
            Parser.concreteSyntaxTree.addNode(programNode, endOfFileSymbol);
            return true;
        }
        return false;
    }
    return false;
};

Parser.parseBlock = function(programNode) {
    var openingBrace = Parser.peekAtNextToken();
    if (Parser.isTokenOfKind(openingBrace, Token.Kind.OPEN_BRACE, true)) {
        var blockNode = Parser.concreteSyntaxTree.addNode(programNode, Nonterminal.Kind.BLOCK);
        Parser.concreteSyntaxTree.addNode(blockNode, openingBrace);
        Parser.symbolTable.enterScope();
        LogDisplay.logParserParsingResult(Parser.getNextToken(), "Block", "{ StatementList }");
        if (Parser.parseStatementList(blockNode)) {
            var closingBrace = Parser.getNextToken();
            if (Parser.isTokenOfKind(closingBrace, Token.Kind.CLOSE_BRACE, true)) {
                Parser.concreteSyntaxTree.addNode(blockNode, closingBrace);
                Parser.symbolTable.exitScope();
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

Parser.parseStatementList = function(blockNode) {
    var kinds = [Token.Kind.PRINT, Token.Kind.IDENTIFIER, Token.Kind.VARIABLE_TYPE, Token.Kind.WHILE, Token.Kind.IF, Token.Kind.OPEN_BRACE];
    var nextToken = Parser.peekAtNextToken();
    var statementListNode = Parser.concreteSyntaxTree.addNode(blockNode, Nonterminal.Kind.STATEMENT_LIST);
    if (Parser.isTokenOfKind(nextToken, kinds, false)) {
        if (Parser.parseStatement(statementListNode)) {
            if (Parser.parseStatementList(statementListNode)) {
                return true;
            }
            LogDisplay.logParserErrorResult("Expecting a print statement, an identifier, a variable type, a while statement, an if statement, or a block statement but receved", Parser.peekAtNextToken());
            return false;
        }
        LogDisplay.logParserErrorResult("Expecting a print statement, an identifier, a variable type, a while statement, an if statement, or a block statement but receved", Parser.peekAtNextToken());
        return false;
    }

    if (Parser.isTokenOfKind(nextToken, Token.Kind.CLOSE_BRACE, true)) {
        Parser.concreteSyntaxTree.addNode(statementListNode, Nonterminal.Kind.EPSILON);
        return true;
    }

    return false;
};

Parser.parseStatement = function(statementListNode) {
    var statementNode = Parser.concreteSyntaxTree.addNode(statementListNode, Nonterminal.Kind.STATEMENT);
    if (Parser.parsePrintStatement(statementNode)) {
        return true;
    } else if (Parser.parseAssignmentStatement(statementNode)) {
        return true;
    } else if (Parser.parseVariableDeclaration(statementNode)) {
        return true;
    } else if (Parser.parseWhileStatement(statementNode)) {
        return true;
    } else if (Parser.parseIfStatement(statementNode)) {
        return true;
    } else if (Parser.parseBlock(statementNode)) {
        return true;
    }
    return false;
};

Parser.parseAssignmentStatement = function(statementNode) {
    if (Parser.isTokenOfKind(Parser.peekAtNextToken(), Token.Kind.IDENTIFIER, true)) {
        var assignmentStatementNode = Parser.concreteSyntaxTree.addNode(statementNode, Nonterminal.Kind.ASSIGNMENT_STATEMENT);
        LogDisplay.logParserParsingResult(Parser.peekAtNextToken(), "AssignmentStatement", "Id = Expr");
        if (Parser.parseIdentifier(assignmentStatementNode)) {
            var assignmentOperator = Parser.getNextToken();
            if (Parser.isTokenOfKind(assignmentOperator, Token.Kind.ASSIGNMENT_OPERATOR, true)) {
                Parser.concreteSyntaxTree.addNode(assignmentStatementNode, assignmentOperator);
                if (Parser.parseExpression(assignmentStatementNode)) {
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

Parser.parseWhileStatement = function(statementNode) {
    if (Parser.isTokenOfKind(Parser.peekAtNextToken(), Token.Kind.WHILE, true)) {
        var whileStatementNode = Parser.concreteSyntaxTree.addNode(statementNode, Nonterminal.Kind.WHILE_STATEMENT);
        var whileKeyword = Parser.getNextToken();
        Parser.concreteSyntaxTree.addNode(whileStatementNode, whileKeyword);
        LogDisplay.logParserParsingResult(whileKeyword, "WhileStatement", "while BooleanExpr Block");
        if (Parser.parseBooleanExpression(whileStatementNode)) {
            if (Parser.parseBlock(whileStatementNode)) {
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

Parser.parseIfStatement = function(statementNode) {
    if (Parser.isTokenOfKind(Parser.peekAtNextToken(), Token.Kind.IF, true)) {
        var ifStatementNode = Parser.concreteSyntaxTree.addNode(statementNode, Nonterminal.Kind.IF_STATEMENT);

        var ifKeyword = Parser.getNextToken();
        Parser.concreteSyntaxTree.addNode(ifStatementNode, ifKeyword);
        LogDisplay.logParserParsingResult(ifKeyword, "IfStatement", "if BooleanExpr Block");
        if (Parser.parseBooleanExpression(ifStatementNode)) {
            if (Parser.parseBlock(ifStatementNode)) {
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

Parser.parseVariableDeclaration = function(statementNode) {
    if (Parser.isTokenOfKind(Parser.peekAtNextToken(), Token.Kind.VARIABLE_TYPE, true)) {
        var variableDeclarationNode = Parser.concreteSyntaxTree.addNode(statementNode, Nonterminal.Kind.VAR_DECL);
        var variableDeclaration = Parser.getNextToken();
        Parser.concreteSyntaxTree.addNode(variableDeclarationNode, variableDeclaration);
        LogDisplay.logParserParsingResult(variableDeclaration, "VarDecl", "type Id");
        var id = Parser.peekAtNextToken();
        if (Parser.parseIdentifier(variableDeclarationNode)) {
            var symbol = Parser.symbolTable.addSymbol(variableDeclaration.value, id.value, variableDeclaration.lineNumber);
            if (!symbol) {
                LogDisplay.logParserErrorResult("Variable has already been declared", id);
            } else {
                LogDisplay.logParserAddingSymbolResult(variableDeclaration.lineNumber, symbol);
            }
            return true;
        }
        LogDisplay.logParserErrorResult("Expecting identifier but received", id);
        return false;
    }
    return false;
};

Parser.parsePrintStatement = function(statementNode) {
    if (Parser.isTokenOfKind(Parser.peekAtNextToken(), Token.Kind.PRINT, true)) {
        var printStatementNode = Parser.concreteSyntaxTree.addNode(statementNode, Nonterminal.Kind.PRINT_STATEMENT);
        var printKeyword = Parser.getNextToken();
        Parser.concreteSyntaxTree.addNode(printStatementNode, printKeyword);
        LogDisplay.logParserParsingResult(printKeyword, "PrintStatement", "print ( Expr )");
        var openingParenthesis = Parser.getNextToken();
        if (Parser.isTokenOfKind(openingParenthesis, Token.Kind.OPEN_PARENTHESIS, true)) {
            Parser.concreteSyntaxTree.addNode(printStatementNode, openingParenthesis);
            if (Parser.parseExpression(printStatementNode)) {
                var closingParenthesis = Parser.getNextToken();
                if (Parser.isTokenOfKind(closingParenthesis, Token.Kind.CLOSE_PARENTHESIS, true)) {
                    Parser.concreteSyntaxTree.addNode(printStatementNode, closingParenthesis);
                    return true;
                }
                LogDisplay.logParserErrorResult("Expecting closing parenthesis but received", closingParenthesis);
                return false;
            }
            LogDisplay.logParserErrorResult("Expecting expression but received", Parser.peekAtNextToken());
            return false;
        }
        LogDisplay.logParserErrorResult("Expecting opening parenthesis but received", openingParenthesis);
        return false;
    }
    return false;
};

Parser.parseExpression = function(node) {
    var expressionNode = Parser.concreteSyntaxTree.addNode(node, Nonterminal.Kind.EXPR);
    if (Parser.parseIntegerExpression(expressionNode)) {
        return true;
    } else if (Parser.parseIdentifier(expressionNode)) {
        return true;
    } else if (Parser.parseStringExpression(expressionNode)) {
        return true;
    } else if (Parser.parseBooleanExpression(expressionNode)) {
        return true;
    }
    return false;
};

Parser.parseIdentifier = function(node) {
    if (Parser.isTokenOfKind(Parser.peekAtNextToken(), Token.Kind.IDENTIFIER, true)) {
        var identifierNode = Parser.concreteSyntaxTree.addNode(node, Nonterminal.Kind.ID);
        var identifier = Parser.getNextToken();
        Parser.concreteSyntaxTree.addNode(identifierNode, identifier);
        LogDisplay.logParserParsingResult(identifier, "Id", "char");
        return true;
    }
    return false;
};

Parser.parseStringExpression = function(node) {
    if (Parser.isTokenOfKind(Parser.peekAtNextToken(), Token.Kind.QUOTE, true)) {
        var stringExpressionNode = Parser.concreteSyntaxTree.addNode(node, Nonterminal.Kind.STRING_EXPR);
        var openQuote = Parser.getNextToken();
        Parser.concreteSyntaxTree.addNode(stringExpressionNode, openQuote);
        LogDisplay.logParserParsingResult(openQuote, "StringExpr", '" CharList "');
        var string = Parser.getNextToken();
        if (Parser.isTokenOfKind(string, Token.Kind.STRING, true)) {
            Parser.concreteSyntaxTree.addNode(stringExpressionNode, string);
            var closeQuote = Parser.getNextToken();
            if (Parser.isTokenOfKind(closeQuote, Token.Kind.QUOTE, true)) {
                Parser.concreteSyntaxTree.addNode(stringExpressionNode, closeQuote);
                return true;
            }
            LogDisplay.logParserErrorResult("Expecting closing quote but received", closeQuote);
            return false;
        }
        LogDisplay.logParserErrorResult("Expecting string but received", string);
        return false;
    }
    return false;

};

Parser.parseBooleanExpression = function(node) {
    if (Parser.isTokenOfKind(Parser.peekAtNextToken(), Token.Kind.BOOLEAN, true)) {
        var booleanExpressionNode = Parser.concreteSyntaxTree.addNode(node, Nonterminal.Kind.BOOLEAN_EXPR);
        var booleanValue = Parser.getNextToken();
        Parser.concreteSyntaxTree.addNode(booleanExpressionNode, booleanValue);
        LogDisplay.logParserParsingResult(booleanValue, "BooleanExpr", "boolval");
        return true;
    }

    var openingParenthesis = Parser.peekAtNextToken();
    if (Parser.isTokenOfKind(openingParenthesis, Token.Kind.OPEN_PARENTHESIS, true)) {
        var booleanExpressionNode = Parser.concreteSyntaxTree.addNode(node, Nonterminal.Kind.BOOLEAN_EXPR);
        Parser.concreteSyntaxTree.addNode(booleanExpressionNode, openingParenthesis);
        LogDisplay.logParserParsingResult(Parser.getNextToken(), "BooleanExpr", "( Expr boolop Expr )");
        if (Parser.parseExpression(booleanExpressionNode)) {
            var booleanOperator = Parser.getNextToken();
            if (Parser.isTokenOfKind(booleanOperator, Token.Kind.EQUALITY_OPERATOR, true) || Parser.isTokenOfKind(booleanOperator, Token.Kind.INEQUALITY_OPERATOR, true)) {
                Parser.concreteSyntaxTree.addNode(booleanExpressionNode, booleanOperator);
                if (Parser.parseExpression(booleanExpressionNode)) {
                    var closingParenthesis = Parser.getNextToken();
                    if (Parser.isTokenOfKind(closingParenthesis, Token.Kind.CLOSE_PARENTHESIS, true)) {
                        Parser.concreteSyntaxTree.addNode(booleanExpressionNode, closingParenthesis);
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

Parser.parseIntegerExpression = function(node) {
    if (Parser.isTokenOfKind(Parser.peekAtNextToken(), Token.Kind.DIGIT, true)) {
        var integerExpressionNode = Parser.concreteSyntaxTree.addNode(node, Nonterminal.Kind.INT_EXPR);
        var integer = Parser.getNextToken();
        Parser.concreteSyntaxTree.addNode(integerExpressionNode, integer);
        if (Parser.isTokenOfKind(Parser.peekAtNextToken(), Token.Kind.ADDITION_OPERATOR, false)) {
            LogDisplay.logParserParsingResult(integer, "Integer", "digit intop Expr");
            Parser.getNextToken();
            if (Parser.parseExpression(integerExpressionNode)) {
                return true;
            }
            LogDisplay.logParserErrorResult("Expecting expression but received", Parser.peekAtNextToken());
            return false;
        } else {
            LogDisplay.logParserParsingResult(integer, "Integer", "digit");
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