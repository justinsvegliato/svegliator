/** 
 * The parser class analyzes the code to ensure that it fits properly with a specified
 * grammar. In other words, it ensures that the code is made up of valid sentences.
 */

function Parser() {};

// Parses the tokens and returns a concrete syntax tree
Parser.parse = function(tokens) {
    // Initializes all variables to be used
    Parser.tokens = tokens;
    
    // Creates a new concrete syntax tree and symbol table
    Parser.concreteSyntaxTree = new ConcreteSyntaxTree();
    
    // Log an error and return false if the program is not valid
    if (!Parser.parseProgram()) {
        LogDisplay.logParserErrorResult("Expecting a block statement but received", Parser.peekAtNextToken());
        return false;
    }
    
    // Returns the beauteous concrete syntax tree for the semantic analyzer to destroy
    return Parser.concreteSyntaxTree;
};

// Parses the program to ensure that it is valid
Parser.parseProgram = function() {
    // Initializes the CST with the program node as the root
    var programNode = Parser.concreteSyntaxTree.initializeTree(Nonterminal.Kind.PROGRAM);
    
    // Checks if the remaining code is a valid block
    if (Parser.parseBlock(programNode)) {
        // Adds the end of file symbol to the CST if it is valid
        var endOfFileSymbol = Parser.getNextToken();
        if (Parser.isTokenOfKind(endOfFileSymbol, Token.Kind.END_OF_FILE, true)) {
            Parser.concreteSyntaxTree.addNode(programNode, endOfFileSymbol, endOfFileSymbol.lineNumber);
            return true;
        }
        return false;
    }
    return false;
};

// Parses the specified block to ensure that it is valid
Parser.parseBlock = function(programNode) {
    // Checks if the first character of the block is correct
    var openingBrace = Parser.peekAtNextToken();
    if (Parser.isTokenOfKind(openingBrace, Token.Kind.OPEN_BRACE, true)) {
        // Creates a block node and then adds the opening brace to the block node as a child
        var blockNode = Parser.concreteSyntaxTree.addNode(programNode, Nonterminal.Kind.BLOCK, openingBrace.lineNumber);
        Parser.concreteSyntaxTree.addNode(blockNode, openingBrace, openingBrace.lineNumber);
        
        // Logs and retrieves the opening brace
        LogDisplay.logParserParsingResult(Parser.getNextToken(), "Block", "{ StatementList }");        

        // Checks if the remaining code is a valid satement list
        if (Parser.parseStatementList(blockNode)) {
            // Checks if the last character of the block is correct            
            var closingBrace = Parser.getNextToken();
            if (Parser.isTokenOfKind(closingBrace, Token.Kind.CLOSE_BRACE, true)) {
                // Adds the closing brace as a child of the block node
                Parser.concreteSyntaxTree.addNode(blockNode, closingBrace, closingBrace.lineNumber);
                return true;
            }
            LogDisplay.logParserErrorResult("Expecting closing brace but received", closingBrace);
            return false;
        }
        LogDisplay.logParserErrorResult("Expecting a statement list but received", Parser.peekAtNextToken());
        return false;
    }
    return false;
};

// Parses the specified statement list to ensure that it is valid
Parser.parseStatementList = function(blockNode) {    
    // Creates a staement list node as a child of block node
    var statementListNode = Parser.concreteSyntaxTree.addNode(blockNode, Nonterminal.Kind.STATEMENT_LIST, blockNode.model.lineNumber);
    
    // Checks if the first token is within the first set of statement list
    var kinds = [Token.Kind.PRINT, Token.Kind.IDENTIFIER, Token.Kind.VARIABLE_TYPE, 
        Token.Kind.WHILE, Token.Kind.IF, Token.Kind.OPEN_BRACE];
    if (Parser.isTokenOfKind(Parser.peekAtNextToken(), kinds, false)) {
        // Checks if the remaining code is a valid statement
        if (Parser.parseStatement(statementListNode)) {
            // Checks if the remaining code is a valid statement list
            if (Parser.parseStatementList(statementListNode)) {
                return true;
            }
            LogDisplay.logParserErrorResult("Expecting a print statement, an identifier, a variable type, a while statement, an if statement, or a block statement but received", Parser.peekAtNextToken());
            return false;
        }
        LogDisplay.logParserErrorResult("Expecting a print statement, an identifier, a variable type, a while statement, an if statement, or a block statement but received", Parser.peekAtNextToken());
        return false;
    }

    // Checks if the statement list is empty
    var closingBrace = Parser.peekAtNextToken();
    if (Parser.isTokenOfKind(closingBrace, Token.Kind.CLOSE_BRACE, true)) {
        // Adds an epsilon node as a child of statement list node
        Parser.concreteSyntaxTree.addNode(statementListNode, Nonterminal.Kind.EPSILON, closingBrace.lineNumber);
        return true;
    }

    return false;
};

// Parses the specified statement to ensure that it is valid
Parser.parseStatement = function(statementListNode) {
    // Adds a statement node as a child of statement list node
    var statementNode = Parser.concreteSyntaxTree.addNode(statementListNode, Nonterminal.Kind.STATEMENT, statementListNode.model.lineNumber);
    
    // Checks if the statement is a valid print, assignment, while, if, 
    // block, or variable declaration statement
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

// Parses the specified assignment statement to ensure that it is valid
Parser.parseAssignmentStatement = function(statementNode) {
    // Checks if the first token is within the first set of the assignment statement
    var peek = Parser.peekAtNextToken();
    if (Parser.isTokenOfKind(peek, Token.Kind.IDENTIFIER, true)) {
        // Adds an assignment statement node as a child of statement node
        var assignmentStatementNode = Parser.concreteSyntaxTree.addNode(statementNode, Nonterminal.Kind.ASSIGNMENT_STATEMENT, peek.lineNumber);
        LogDisplay.logParserParsingResult(Parser.peekAtNextToken(), "AssignmentStatement", "Id = Expr");
        
        // Checks if the remaining code is a valid identifier
        if (Parser.parseIdentifier(assignmentStatementNode)) {
            // Checks if the next token is the assignment operator
            var assignmentOperator = Parser.getNextToken();
            if (Parser.isTokenOfKind(assignmentOperator, Token.Kind.ASSIGNMENT_OPERATOR, true)) {
                // Adds an assignment operator terminal node as a child of assignment operator
                Parser.concreteSyntaxTree.addNode(assignmentStatementNode, assignmentOperator, assignmentOperator.lineNumber);
                
                // Checks if the remaining code is a valid expression
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

// Parses the specified while statement to ensure that it is valid
Parser.parseWhileStatement = function(statementNode) {
    // Checks if the first token is within the first set of while statement
    var peek = Parser.peekAtNextToken();
    if (Parser.isTokenOfKind(peek, Token.Kind.WHILE, true)) {
        // Adds a while statement node as a child of statement node
        var whileStatementNode = Parser.concreteSyntaxTree.addNode(statementNode, Nonterminal.Kind.WHILE_STATEMENT, peek.lineNumber);
        
        // Adds a while keyword as a child of while statement node
        var whileKeyword = Parser.getNextToken();
        Parser.concreteSyntaxTree.addNode(whileStatementNode, whileKeyword, peek.lineNumber);        
        LogDisplay.logParserParsingResult(whileKeyword, "WhileStatement", "while BooleanExpr Block");
        
        // Checks if the rest of the code is a valid boolean expression
        if (Parser.parseBooleanExpression(whileStatementNode)) {
            // Checks if the rest of the code is a valid block
            if (Parser.parseBlock(whileStatementNode)) {
                return true;
            }
            LogDisplay.logParserErrorResult("Expecting block but received", Parser.peekAtNextToken());
            return false;
        }
        LogDisplay.logParserErrorResult("Expecting boolean expression but received", Parser.peekAtNextToken());
        return false;
    }
    return false;
};

// Parses the specified if statement to ensure that it is valid
Parser.parseIfStatement = function(statementNode) {
    // Checks if the first token is within the first set of if statement
    var peek = Parser.peekAtNextToken();
    if (Parser.isTokenOfKind(peek, Token.Kind.IF, true)) {
        // Adds an if statement node as a child of statement node
        var ifStatementNode = Parser.concreteSyntaxTree.addNode(statementNode, Nonterminal.Kind.IF_STATEMENT, peek.lineNumber);

        // Adds an if statement terminal node as a child of if statement node
        var ifKeyword = Parser.getNextToken();
        Parser.concreteSyntaxTree.addNode(ifStatementNode, ifKeyword, peek.lineNumber);
        LogDisplay.logParserParsingResult(ifKeyword, "IfStatement", "if BooleanExpr Block");
        
        // Checks if the remaining code is a valid boolean expression
        if (Parser.parseBooleanExpression(ifStatementNode)) {
            // Checks if the remaining code is a block block
            if (Parser.parseBlock(ifStatementNode)) {
                return true;
            }
            LogDisplay.logParserErrorResult("Expecting block but received", Parser.peekAtNextToken());
            return false;
        }
        LogDisplay.logParserErrorResult("Expecting boolean expression but received", Parser.peekAtNextToken());
        return false;
    }
    return false;
};

// Parses the specified variable declaration to ensure that it is valid
Parser.parseVariableDeclaration = function(statementNode) {
    // Checks if first token is within the first set of a variable declaration
    var peek = Parser.peekAtNextToken();
    if (Parser.isTokenOfKind(peek, Token.Kind.VARIABLE_TYPE, true)) {
        // Adds a variable declaration node as a child of statement node
        var variableDeclarationNode = Parser.concreteSyntaxTree.addNode(statementNode, Nonterminal.Kind.VAR_DECL, peek.lineNumber);
        
        // Adds a variable declaration terminal node as a child of variable declaration node
        var variableTypeNode = Parser.concreteSyntaxTree.addNode(variableDeclarationNode, Nonterminal.Kind.TYPE);
        var variableDeclaration = Parser.getNextToken();
        Parser.concreteSyntaxTree.addNode(variableTypeNode, variableDeclaration, peek.lineNumber);
        LogDisplay.logParserParsingResult(variableDeclaration, "VarDecl", "type Id");
        
        // Checks if the remaining code is a valid identifier
        var id = Parser.peekAtNextToken();
        if (Parser.parseIdentifier(variableDeclarationNode)) {             
            return true;
        }
        LogDisplay.logParserErrorResult("Expecting identifier but received", id);
        return false;
    }
    return false;
};

// Parses the specified print statement to ensure that it is valid
Parser.parsePrintStatement = function(statementNode) {
    // Checks if the first token is within the first set of print statement
    var peek = Parser.peekAtNextToken();
    if (Parser.isTokenOfKind(peek, Token.Kind.PRINT, true)) {
        // Add a print statement node as a child of statement node
        var printStatementNode = Parser.concreteSyntaxTree.addNode(statementNode, Nonterminal.Kind.PRINT_STATEMENT, peek.lineNumber);
        
        // Add a print statement terminal node as a child of print statement node
        var printKeyword = Parser.getNextToken();
        Parser.concreteSyntaxTree.addNode(printStatementNode, printKeyword, peek.lineNumber);
        LogDisplay.logParserParsingResult(printKeyword, "PrintStatement", "print ( Expr )");
        
        // Check if the next token is an opening parenthesis
        var openingParenthesis = Parser.getNextToken();
        if (Parser.isTokenOfKind(openingParenthesis, Token.Kind.OPEN_PARENTHESIS, true)) {
            // Add a opening parenthesis terminal node as a child of print statement node
            Parser.concreteSyntaxTree.addNode(printStatementNode, openingParenthesis, openingParenthesis.lineNumber);
            
            // Check if the remaining code is a valid expression
            if (Parser.parseExpression(printStatementNode)) {
                // Check if the next token is an closing parenthesis
                var closingParenthesis = Parser.getNextToken();
                if (Parser.isTokenOfKind(closingParenthesis, Token.Kind.CLOSE_PARENTHESIS, true)) {
                    // Add a closing parenthesis terminal node as a child of print statement node
                    Parser.concreteSyntaxTree.addNode(printStatementNode, closingParenthesis, closingParenthesis.lineNumber);
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

// Parses the specified expression to ensure that it is valid
Parser.parseExpression = function(node) {
    // Add an expresson node a child of the specified node (whatever it may be)
    var expressionNode = Parser.concreteSyntaxTree.addNode(node, Nonterminal.Kind.EXPR, node.model.lineNumber);
    
    // Checks if the remaining code is a valid integer expression, 
    // identifier expression, string expression, or boolean expression
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

// Parses the specified identifier to ensure that it is valid
Parser.parseIdentifier = function(node) {
    // Checks if the first token is within the first set of identifier
    var peek = Parser.peekAtNextToken();
    if (Parser.isTokenOfKind(peek, Token.Kind.IDENTIFIER, true)) {
        // Add an identifier node as a child of the specified node
        var identifierNode = Parser.concreteSyntaxTree.addNode(node, Nonterminal.Kind.ID, peek.lineNumber);
        
        // Add the identifier itself as a child of the identifier node
        var charNode = Parser.concreteSyntaxTree.addNode(identifierNode, Nonterminal.Kind.CHAR, peek.lineNumber);
        var identifier = Parser.getNextToken();        
        Parser.concreteSyntaxTree.addNode(charNode, identifier, peek.lineNumber);
        LogDisplay.logParserParsingResult(identifier, "Id", "char");        
        return true;
    }
    return false;
};

// Parses the specified string expression to ensure that it is valid
Parser.parseStringExpression = function(node) {
    // Checks if the first token is within the first set of string expression
    var peek = Parser.peekAtNextToken();
    if (Parser.isTokenOfKind(peek, Token.Kind.QUOTE, true)) {
        // Adds a string expression node as a child of the specified node
        var stringExpressionNode = Parser.concreteSyntaxTree.addNode(node, Nonterminal.Kind.STRING_EXPR, peek.lineNumber);
        
        // Adds a quote as a child of strng expression node
        var openQuote = Parser.getNextToken();
        Parser.concreteSyntaxTree.addNode(stringExpressionNode, openQuote, node.model.lineNumber);
        LogDisplay.logParserParsingResult(openQuote, "StringExpr", '" CharList "');
        
        // Checks if the next token is a valid string
        var string = Parser.getNextToken();
        if (Parser.isTokenOfKind(string, Token.Kind.STRING, true)) {
            // Adds the string as a child of string expression node
            Parser.concreteSyntaxTree.addNode(stringExpressionNode, string, peek.lineNumber);
            
            // Checks if the next token is a valid quote
            var closeQuote = Parser.getNextToken();
            if (Parser.isTokenOfKind(closeQuote, Token.Kind.QUOTE, true)) {
                // Adds the quote as a child of string expression node
                Parser.concreteSyntaxTree.addNode(stringExpressionNode, closeQuote, peek.lineNumber);
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

// Parses the specified boolean expression to ensure that it is valid
Parser.parseBooleanExpression = function(node) {
    // Checks if the next token is a boolean value
    var peek = Parser.peekAtNextToken();
    if (Parser.isTokenOfKind(peek, Token.Kind.BOOLEAN, true)) {
        // Adds a boolean expression node as a child of the specified node
        var booleanExpressionNode = Parser.concreteSyntaxTree.addNode(node, Nonterminal.Kind.BOOLEAN_EXPR, peek.lineNumber);
        
        // Adds a boolean value as a child of the boolean expression node
        var booleanValueNode = Parser.concreteSyntaxTree.addNode(booleanExpressionNode, Nonterminal.Kind.BOOL_VAL, peek.lineNumber);
        var booleanValue = Parser.getNextToken();
        Parser.concreteSyntaxTree.addNode(booleanValueNode, booleanValue, peek.lineNumber);
        LogDisplay.logParserParsingResult(booleanValue, "BooleanExpr", "boolval");
        return true;
    }

    // Checks if the next token is a valid opening parenthesis
    var openingParenthesis = Parser.peekAtNextToken();
    if (Parser.isTokenOfKind(openingParenthesis, Token.Kind.OPEN_PARENTHESIS, true)) {
        // Adds a boolean expression node as a child of the specified node
        var booleanExpressionNode = Parser.concreteSyntaxTree.addNode(node, Nonterminal.Kind.BOOLEAN_EXPR, openingParenthesis.lineNumber);
        
        // Adds an opening parenthesis as a child of the boolean expression node
        Parser.concreteSyntaxTree.addNode(booleanExpressionNode, openingParenthesis, openingParenthesis.lineNumber);
        LogDisplay.logParserParsingResult(Parser.getNextToken(), "BooleanExpr", "( Expr boolop Expr )");
        
        // Checks if the remaining code is a valid expression
        if (Parser.parseExpression(booleanExpressionNode)) {
            // Checks if the next token is equality or inequality operator
            var booleanOperator = Parser.getNextToken();
            if (Parser.isTokenOfKind(booleanOperator, Token.Kind.EQUALITY_OPERATOR, true) || Parser.isTokenOfKind(booleanOperator, Token.Kind.INEQUALITY_OPERATOR, true)) {
                // Adds the boolean operator as a child of boolean expression node
                var booleanOperatorNode = Parser.concreteSyntaxTree.addNode(booleanExpressionNode, Nonterminal.Kind.BOOL_OP, openingParenthesis.lineNumber);
                Parser.concreteSyntaxTree.addNode(booleanOperatorNode, booleanOperator, openingParenthesis.lineNumber);
                
                // Checks if the remaining code is a valid expression
                if (Parser.parseExpression(booleanExpressionNode)) {
                    var closingParenthesis = Parser.getNextToken();
                    if (Parser.isTokenOfKind(closingParenthesis, Token.Kind.CLOSE_PARENTHESIS, true)) {
                        // Adds the closing parenthesis as a child of boolean expression node
                        Parser.concreteSyntaxTree.addNode(booleanExpressionNode, closingParenthesis, openingParenthesis.lineNumber);
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

// Parses the specified integer expression to ensure that it is valid
Parser.parseIntegerExpression = function(node) {
    // Checks if the first token is a digit
    var peek = Parser.peekAtNextToken();
    if (Parser.isTokenOfKind(peek, Token.Kind.DIGIT, true)) {
        // Adds an integer expression node as a child of the specified node
        var integerExpressionNode = Parser.concreteSyntaxTree.addNode(node, Nonterminal.Kind.INT_EXPR, peek.lineNumber);
        
        // Adds an integer as a child of the integer expression node
        var digitNode = Parser.concreteSyntaxTree.addNode(integerExpressionNode, Nonterminal.Kind.DIGIT, peek.lineNumber);
        var integer = Parser.getNextToken();
        Parser.concreteSyntaxTree.addNode(digitNode, integer, node.model.lineNumber);
        
        // Checks if the nexxt token is an addition operator, otherwise 
        // is it just a regular digit
        if (Parser.isTokenOfKind(Parser.peekAtNextToken(), Token.Kind.ADDITION_OPERATOR, false)) {
            LogDisplay.logParserParsingResult(integer, "Integer", "digit intop Expr");
            
            // Adds an addition operator as a child of integer expression node
            var integerOperationNode = Parser.concreteSyntaxTree.addNode(integerExpressionNode, Nonterminal.Kind.INT_OP, peek.lineNumber);
            Parser.concreteSyntaxTree.addNode(integerOperationNode, Parser.getNextToken(), peek.lineNumber);
            
            // Checks if the rest of the code is a valid expression
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

// Checks if the token is of the array of kinds
Parser.isTokenOfKind = function(nextToken, kinds, isVerbose) {
    // Turn the variable into an array if it is not
    if (!(kinds instanceof Array)) {
        kinds = [kinds];
    }

    // Execute the logic below if the token exists
    if (nextToken) {
        // iterate through all kinds in the list
        for (var i = 0; i < kinds.length; i++) {
            var kind = kinds[i];
            
            // Print a searching message if the log is in verbose mode
            if (isVerbose) {
                LogDisplay.logParserSearchingResult(nextToken, kind);
            }
            
            // Return true if the token is of the specified kind
            if (nextToken.is(kind)) {
                // Print a found message if the log is in verbose mode
                if (isVerbose) {
                    LogDisplay.logParserFoundResult(nextToken);
                }
                return true;
            }
        }
    }
    return false;
};

// Retrieves the next token by removing it from the token list
Parser.getNextToken = function() {
    // Return false if there are no more tokens left
    if (Parser.tokens.length <= 0) {
        return false;
    }

    // Otherwise pop off the first element and return it
    var nextToken = Parser.tokens[0];
    Parser.tokens = Parser.tokens.slice(1);
    return nextToken;
};

// Retrieves the next token without removing it from the token list
Parser.peekAtNextToken = function() {
    // Return false if there are no more tokens left
    if (Parser.tokens.length <= 0) {
        return false;
    }
    
    // Return the first element without popping it off
    return Parser.tokens[0];
};