/** 
 * A class that handles analyzing the scope and types of the program
 */

// Initializes a new instance of the semantic analyzer
function SemanticAnalyzer() {};

// The data structure which holds all variable data
SemanticAnalyzer.symbolTable = new SymbolTable();

// Analyzes the scope and type of the specified abstract syntax tree
SemanticAnalyzer.analyze = function(abstractSyntaxTree) {
    SemanticAnalyzer.symbolTable = new SymbolTable();
    SemanticAnalyzer.typeCheck(abstractSyntaxTree.root);
    SemanticAnalyzer.symbolTable.check();
};

// Routes the node to the specified type checking function
SemanticAnalyzer.typeCheck = function(node) {
    var value = node.model.value;
    if (value === "{}") {
        return SemanticAnalyzer.typeCheckBlock(node);
    } else if (value === "while") {
        return SemanticAnalyzer.typeCheckWhileStatement(node);
    } else if (value === "if") {
        return SemanticAnalyzer.typeCheckIfStatement(node);
    } else if (value === "=") {
        return SemanticAnalyzer.typeCheckAssignmentOperator(node);
    } else if (value === "print") {
        return SemanticAnalyzer.typeCheck(node.children[0]);
    } else if (value === "VarDecl") {
        return SemanticAnalyzer.typeCheckVariableDeclaration(node);  
    } else if (value === "+") {
        return SemanticAnalyzer.typeCheckAdditionOperator(node);
    } else if (value.match(/^(==|!=)$/g)) {
        return SemanticAnalyzer.typeCheckBooleanOperator(node);
    } else if (value.match(/^[a-z]$/g)) {
        return SemanticAnalyzer.typeCheckIdentifier(node);
    } else if (value.match(/^"[a-z\s]*"$/g)) {
        return 'string';
    } else if (value.match(/^(true|false)$/g)) {
        return 'boolean';
    } else if (value.match(/^\d$/g)) {
        return 'int';
    } 
};

// Type checks the statements of the specified block
SemanticAnalyzer.typeCheckBlock = function(node) {
    // Create a new scope since we hit a block
    SemanticAnalyzer.symbolTable.enterScope();
    LogDisplay.logSemanticAnalyzerEnteringScopeResult(node.model.lineNumber, SemanticAnalyzer.symbolTable.currentScope.model.scopeId);
    
    // Type check every statement associated with the specified block
    for (var i = 0; i < node.children.length; i++) {
        SemanticAnalyzer.typeCheck(node.children[i]);
    }
    
    // Exit the current scope since the block is over
    LogDisplay.logSemanticAnalyzerLeavingScopeResult(node.model.lineNumber, SemanticAnalyzer.symbolTable.currentScope.model.scopeId);
    SemanticAnalyzer.symbolTable.exitScope();
};

// Type checks the expression and block of the specified while statement
SemanticAnalyzer.typeCheckWhileStatement = function(node) { 
    LogDisplay.logSemanticAnalyzerInfoResult(node.model.lineNumber, "Analyzing", "while statement");
    
    // Type checks the expression
    SemanticAnalyzer.typeCheck(node.children[0]);
    
    // Type checks the block
    SemanticAnalyzer.typeCheck(node.children[1]); 
};

// Type checks the expression and block of the specified if statement 
SemanticAnalyzer.typeCheckIfStatement = function(node) {   
    LogDisplay.logSemanticAnalyzerInfoResult(node.model.lineNumber, "Analyzing", "if statement");
    
    // Type checks the expression
    SemanticAnalyzer.typeCheck(node.children[0]);
    
    // Type checks the block
    SemanticAnalyzer.typeCheck(node.children[1]); 
};
    
// Type checks the variable against the specified value
SemanticAnalyzer.typeCheckAssignmentOperator = function(node) {
    // Retrieves the type of identifier
    var leftNode = node.children[0];
    var leftType = SemanticAnalyzer.typeCheck(leftNode);
    
    LogDisplay.logSemanticAnalyzerInfoResult(leftNode.model.lineNumber, "Analyzing", "assignment statement");
    
    // Retrieves the type of the value
    var rightNode = node.children[1];
    var rightType = SemanticAnalyzer.typeCheck(rightNode);  

    // Check if the two types are equivalent
    LogDisplay.logSemanticAnalyzerTypeCheckingResult(leftNode.model.lineNumber, "assignment operator", leftType, rightType);
    if (leftType !== rightType) {
        LogDisplay.logSemanticAnalyzerTypeMismatchErrorResult(leftNode.model.lineNumber, "assign", rightType, leftType);
    } else {
        // Marks this variable as initialized
        var variableData = SemanticAnalyzer.symbolTable.getVariableData(leftNode.model.value, SemanticAnalyzer.symbolTable.currentScope);
        variableData.isInitilized = true;
    }    
        
    return leftType;
};

// This method really doesn't type check - it adds stuff to the symbol table
SemanticAnalyzer.typeCheckVariableDeclaration = function(node) {
    var leftNode = node.children[0];
    var rightNode = node.children[1];
    
    var type = leftNode.model.value;
    var identifier = rightNode.model.value;
    
    LogDisplay.logSemanticAnalyzerInfoResult(rightNode.model.lineNumber, "Analyzing", "variable declaration");
    
    // If the symbol doesn;t exist, add it to the symbol table (otherwise we throw an error)
    LogDisplay.logSemanticAnalyzerAddingSymbolResult(node.model.lineNumber, identifier, type, SemanticAnalyzer.symbolTable.currentScope.model.scopeId - 1);
    var symbol = SemanticAnalyzer.symbolTable.currentScope.model.variables[identifier];
    if (symbol) {        
        LogDisplay.logSemanticAnalyzerScopeErrorResult("Variable is already declared", rightNode.model.lineNumber, identifier);
    } else {
        SemanticAnalyzer.symbolTable.addSymbol(type, identifier, node.model.lineNumber);
    }    
};

// Type checks the digit and the expression of the specified addition operator
SemanticAnalyzer.typeCheckAdditionOperator = function(node) {
    // Type checks the digit
    var leftNode = node.children[0];
    var leftType = SemanticAnalyzer.typeCheck(leftNode);
    
    // Type checks the expression
    var rightNode = node.children[1];    
    var rightType = SemanticAnalyzer.typeCheck(rightNode);
    
    // Throw an error if the expression is not an integer
    LogDisplay.logSemanticAnalyzerTypeCheckingResult(leftNode.model.lineNumber, "addition operator", leftType, rightType);
    if (rightType !== 'int') {
        LogDisplay.logSemanticAnalyzerTypeMismatchErrorResult(rightNode.model.lineNumber, "add", leftType, rightType);
    }
    
    return leftType;
};   

// Type checks the specified identifier
SemanticAnalyzer.typeCheckIdentifier = function(node) {
    // Checks if the identifier is within the scope
    var variableData = SemanticAnalyzer.symbolTable.getVariableData(node.model.value, SemanticAnalyzer.symbolTable.currentScope);
    
    LogDisplay.logSemanticAnalyzerInfoResult(node.model.lineNumber, "Retrieving identifier", node.model.value);
    
    if (!variableData) {
        LogDisplay.logSemanticAnalyzerScopeErrorResult("Variable is not declared", node.model.lineNumber, node.model.value);
    }
    // Mark the variable as used  
    variableData.isUsed = true;
    
    return variableData.type;
};

// Type checks expressions associated with the boolean operator
SemanticAnalyzer.typeCheckBooleanOperator = function(node) {
    // Type checks the first expression
    var leftNode = node.children[0];    
    var leftType = SemanticAnalyzer.typeCheck(leftNode);
    
    // Type checks the second expression
    var rightNode = node.children[1];
    var rightType = SemanticAnalyzer.typeCheck(rightNode);
    
    // Throw an error if the two types are not equal
    LogDisplay.logSemanticAnalyzerTypeCheckingResult(leftNode.model.lineNumber, "boolean operator", leftType, rightType);
    if (leftType !== rightType) {
        LogDisplay.logSemanticAnalyzerTypeMismatchErrorResult(leftNode.model.lineNumber, "compare", leftType, rightType);
    }
    
    return 'boolean';
};