/** 
 * A class that generated machine code for the specified program
 */

function CodeGenerator() {};

// Analyzes the scope and type of the specified abstract syntax tree
CodeGenerator.getCode = function(abstractSyntaxTree) {
    // Initializes the code, static data table, and the jump table for subsequence
    // code generation
    CodeGenerator.code = new Code();
    CodeGenerator.staticDataTable = new StaticDataTable();
    CodeGenerator.jumpTable = new JumpTable();
    
    CodeGenerator.scopeId = 0;

    // Generates the code...
    CodeGenerator.generate(abstractSyntaxTree.root, 0);
    
    // Backpatches and appropriately formats code
    var code = CodeGenerator.finalize();

    return code;
};

// Backpatches the code to ensure that all temporary values have been filled
CodeGenerator.finalize = function() {
    // Adds a break at the end of the code to ensure that the code halts at the correct place
    CodeGenerator.code.addInstruction(Code.operations.BREAK());

    // Generates an error if there is a memory collosion between the heap and code
    if (CodeGenerator.code.heapAddress < CodeGenerator.code.currentAddress) {
        LogDisplay.logCodeGeneratorErrorResult("Insufficient memory");
    }

    // Combines the code array into a long string so it can be analyzed by backpatching
    var code = CodeGenerator.code.text.join("");
    
    // Replaces all temporary memory locations with the actual memory location
    var codeLength = code.length / 2;
    var newAddress = Code.formatAddress(codeLength + Object.keys(CodeGenerator.staticDataTable.variables).length);
    code = code.replace(new RegExp(Code.TEMPORARY_ADDRESS, "g"), newAddress);
    LogDisplay.logCodeGeneratorBackpatchResult("Replacing", Code.TEMPORARY_ADDRESS, newAddress);
    
    // Replaces all secondary temporary memory locations with the actual memory location
    var newAddress = Code.formatAddress(codeLength + Object.keys(CodeGenerator.staticDataTable.variables).length + 1);
    code = code.replace(new RegExp(Code.SECONDARY_TEMPORARY_ADDRESS, "g"), newAddress);
    LogDisplay.logCodeGeneratorBackpatchResult("Replacing", Code.SECONDARY_TEMPORARY_ADDRESS, newAddress);

    // Replaces all temporary variable memory locations with the actual location
    for (var key in CodeGenerator.staticDataTable.variables) {
        var offset = CodeGenerator.staticDataTable.variables[key].offset;
        var newAddress = Code.formatAddress(codeLength + offset);
        var temporaryAddress = CodeGenerator.staticDataTable.variables[key].address;
        code = code.replace(new RegExp(temporaryAddress, "g"), newAddress);
        LogDisplay.logCodeGeneratorBackpatchResult("Replacing", temporaryAddress, newAddress);
    }

    // Replaces all temporary jump locations with the actual location
    for (var key in CodeGenerator.jumpTable.variables) {
        var startingAddress = CodeGenerator.jumpTable.variables[key].startingAddress;
        var endingAddress = CodeGenerator.jumpTable.variables[key].endingAddress;
        var jump = Code.formatValue(endingAddress - startingAddress - 2);
        code = code.replace(new RegExp(key, "g"), jump);
        LogDisplay.logCodeGeneratorBackpatchResult("Replacing", key, jump);
    }

    // Fills in the empty space with breaks
    LogDisplay.logCodeGeneratorBackpatchResult("Replacing", "empty space", "00");
    var heap = CodeGenerator.code.heap.join("");
    var heapLength = heap.length / 2;
    for (var i = codeLength; i < Code.MAX_LENGTH - heapLength; i++) {
        code += "00";
    }
    code += heap;

    // Puts a white space between each byte
    var formattedCode = "";
    for (var i = 0; i < Code.MAX_LENGTH; i++) {
        formattedCode += code.substr(2 * i, 2) + " ";
    }

    return formattedCode;
};

// Routes the node to the specified generation function
CodeGenerator.generate = function(node, scopeId) {
    var value = node.model.value;
    if (value === "{}") {
        return CodeGenerator.generateBlock(node, scopeId);
    } else if (value === "while") {
        return CodeGenerator.generateWhileStatement(node, scopeId);
    } else if (value === "if") {
        return CodeGenerator.generateIfStatement(node, scopeId);
    } else if (value === "=") {
        return CodeGenerator.generateAssignmentStatement(node, scopeId);
    } else if (value === "print") {
        return CodeGenerator.generatePrintStatement(node, scopeId);
    } else if (value === "VarDecl") {
        return CodeGenerator.generateVariableDeclaration(node, scopeId);
    } else if (value === "+") {
        return CodeGenerator.generateIntegerExpression(node, scopeId);
    } else if (value.match(/^==$/g)) {
        return CodeGenerator.generateEqualityExpression(node, scopeId);
    } else if (value.match(/^!=$/g)) {
        return CodeGenerator.generateInequalityExpression(node, scopeId);
    } else if (value.match(/^[a-z]$/g)) {
        return CodeGenerator.generateIdentifier(node, scopeId);
    } else if (value.match(/^"[a-z\s]*"$/g)) {
        return CodeGenerator.generateString(node, scopeId);
    } else if (value.match(/^(true|false)$/g)) {
        return CodeGenerator.generateBoolean(node, scopeId);
    } else if (value.match(/^\d$/g)) {
        return CodeGenerator.generateInteger(node, scopeId);
    }
};

// Creates the code for a block statement
CodeGenerator.generateBlock = function(node, scopeId) {
    LogDisplay.logCodeGeneratorInfoResult(node.model.lineNumber, "Generating", "block statement");
    LogDisplay.logCodeGeneratorEnteringScopeResult(node.model.lineNumber, scopeId);
    
    CodeGenerator.scopeId++;   
    
    // Generates code for each instruction in the block
    var startingScope = CodeGenerator.scopeId;
    for (var i = 0; i < node.children.length; i++) {
        CodeGenerator.generate(node.children[i], startingScope);
    }
    
    LogDisplay.logCodeGeneratorLeavingScopeResult(node.model.lineNumber, scopeId);
    LogDisplay.logCodeGeneratorInfoResult(node.model.lineNumber, "Finished", "block statement");
};

// Creates the code for a variable declaration
CodeGenerator.generateVariableDeclaration = function(node, scopeId) {
    LogDisplay.logCodeGeneratorInfoResult(node.model.lineNumber, "Generating", "variable declaration");
    
    CodeGenerator.code.addInstruction(Code.operations.LOAD_ACCUMULATOR_WITH_CONSTANT('00'));
    var address = CodeGenerator.staticDataTable.add(node.children[1], scopeId);
    CodeGenerator.code.addInstruction(Code.operations.STORE_ACCUMULATOR_IN_MEMORY(address));
};

// Creates the code for an assignment statement
CodeGenerator.generateAssignmentStatement = function(node, scopeId) {
    LogDisplay.logCodeGeneratorInfoResult(node.model.lineNumber, "Generating", "assignment statement");
    
    CodeGenerator.generate(node.children[1], scopeId);
    var address = CodeGenerator.staticDataTable.get(node.children[0], scopeId);
    CodeGenerator.code.addInstruction(Code.operations.STORE_ACCUMULATOR_IN_MEMORY(address));
};

// Creates the code for an integer
CodeGenerator.generateInteger = function(node, scopeId) {
    LogDisplay.logCodeGeneratorInfoResult(node.model.lineNumber, "Generating", "integer");
    
    CodeGenerator.code.addInstruction(Code.operations.LOAD_ACCUMULATOR_WITH_CONSTANT(node.model.value));
    
    LogDisplay.logCodeGeneratorInfoResult(node.model.lineNumber, "Finished", "integer");
};

// Creates the code for an integer expression
CodeGenerator.generateIntegerExpression = function(node, scopeId) {
    LogDisplay.logCodeGeneratorInfoResult(node.model.lineNumber, "Generating", "integer expression");
    
    CodeGenerator.generate(node.children[1], scopeId);
    CodeGenerator.code.addInstruction(Code.operations.STORE_ACCUMULATOR_IN_MEMORY(Code.TEMPORARY_ADDRESS));
    CodeGenerator.code.addInstruction(Code.operations.LOAD_ACCUMULATOR_WITH_CONSTANT(node.children[0].model.value));
    CodeGenerator.code.addInstruction(Code.operations.ADD_WITH_CARRY(Code.TEMPORARY_ADDRESS));
    
    LogDisplay.logCodeGeneratorInfoResult(node.model.lineNumber, "Finished", "integer expression");
};

// Creates the code for an identifier
CodeGenerator.generateIdentifier = function(node, scopeId) {
    LogDisplay.logCodeGeneratorInfoResult(node.model.lineNumber, "Generating", "identifier");
    
    var address = CodeGenerator.staticDataTable.get(node, scopeId);
    CodeGenerator.code.addInstruction(Code.operations.LOAD_ACCUMULATOR_FROM_MEMORY(address));
    
    LogDisplay.logCodeGeneratorInfoResult(node.model.lineNumber, "Finished", "identifier");
};

// Creates the code for a print statement
CodeGenerator.generatePrintStatement = function(node, scopeId) {
    LogDisplay.logCodeGeneratorInfoResult(node.model.lineNumber, "Generating", "print statement");
    
    var childNode = node.children[0];
    var childValue = childNode.model.value;
    
    // This a long method... It should probably be shorter but I'm unfortunately low on time.
    // There are three basic printing conditions: (1) an identifier, (2) a string literal, 
    // or (3) an integer or boolean value. 
    if (childValue.match(/^"[a-z\s]*"$/g)) {
        // This code prints out a string literal
        var string = childValue.substring(1, childValue.length - 1);
        var address = CodeGenerator.code.addString(string);
        CodeGenerator.code.addInstruction(Code.operations.LOAD_ACCUMULATOR_FROM_MEMORY(address));
        CodeGenerator.code.addInstruction(Code.operations.LOAD_Y_REGISTER_WITH_CONSTANT(address.substring(0, 2)));
        CodeGenerator.code.addInstruction(Code.operations.STORE_ACCUMULATOR_IN_MEMORY(Code.TEMPORARY_ADDRESS));
        CodeGenerator.code.addInstruction(Code.operations.LOAD_X_REGISTER_WITH_CONSTANT("2"));
        CodeGenerator.code.addInstruction(Code.operations.SYSTEM_CALL());
    } else if (childValue.match(/^[a-z]$/g)) {
        // First get the scope and address for later operations since we're dealing with 
        // identifiers in this method
        var scope = SemanticAnalyzer.symbolTable.getScope(scopeId);
        var address = CodeGenerator.staticDataTable.get(childNode, scopeId);
        
        // Each type of variable must be treated differently. In our language, we have integers,
        // booleans, and strings
        var variableData = SemanticAnalyzer.symbolTable.getVariableData(childValue, scope);
        if (variableData.type === 'int') {
            CodeGenerator.code.addInstruction(Code.operations.LOAD_Y_REGISTER_FROM_MEMORY(address));
            CodeGenerator.code.addInstruction(Code.operations.LOAD_X_REGISTER_WITH_CONSTANT("1"));
            CodeGenerator.code.addInstruction(Code.operations.SYSTEM_CALL());
        } else if (variableData.type === 'boolean') {
            CodeGenerator.code.addInstruction(Code.operations.LOAD_X_REGISTER_WITH_CONSTANT("1"));
            CodeGenerator.code.addInstruction(Code.operations.COMPARE_BYTE_IN_MEMORY_TO_X_REGISTER(address));
            CodeGenerator.code.addInstruction(Code.operations.LOAD_Y_REGISTER_WITH_CONSTANT(Code.FALSE_ADDRESS));
            CodeGenerator.code.addInstruction(Code.operations.BRANCH_IF_Z_FLAG_EQUALS_ZERO("02"));
            CodeGenerator.code.addInstruction(Code.operations.LOAD_Y_REGISTER_WITH_CONSTANT(Code.TRUE_ADDRESS));
            CodeGenerator.code.addInstruction(Code.operations.LOAD_X_REGISTER_WITH_CONSTANT("2"));
            CodeGenerator.code.addInstruction(Code.operations.SYSTEM_CALL());
        } else if (variableData.type === 'string') {
            CodeGenerator.code.addInstruction(Code.operations.LOAD_Y_REGISTER_FROM_MEMORY(address));
            CodeGenerator.code.addInstruction(Code.operations.LOAD_X_REGISTER_WITH_CONSTANT("2"));
            CodeGenerator.code.addInstruction(Code.operations.SYSTEM_CALL());
        }
    } else {
        // This stuff deals with boolean expressions and integers
        var childValue = node.children[0].model.value;
        CodeGenerator.generate(node.children[0], scopeId);
        
        // Each expression must, again, be treated differently.
        if (childValue.match(/^(true|false)$/g) || childValue.match(/^(==|!=)$/g)) {
            CodeGenerator.code.addInstruction(Code.operations.LOAD_X_REGISTER_WITH_CONSTANT("1"));
            CodeGenerator.code.addInstruction(Code.operations.LOAD_Y_REGISTER_WITH_CONSTANT(Code.FALSE_ADDRESS));
            CodeGenerator.code.addInstruction(Code.operations.BRANCH_IF_Z_FLAG_EQUALS_ZERO("02"));
            CodeGenerator.code.addInstruction(Code.operations.LOAD_Y_REGISTER_WITH_CONSTANT(Code.TRUE_ADDRESS));
            CodeGenerator.code.addInstruction(Code.operations.LOAD_X_REGISTER_WITH_CONSTANT("2"));
            CodeGenerator.code.addInstruction(Code.operations.SYSTEM_CALL());
        } else {
            CodeGenerator.code.addInstruction(Code.operations.LOAD_X_REGISTER_WITH_CONSTANT("1"));
            CodeGenerator.code.addInstruction(Code.operations.STORE_ACCUMULATOR_IN_MEMORY(Code.TEMPORARY_ADDRESS));
            CodeGenerator.code.addInstruction(Code.operations.LOAD_Y_REGISTER_FROM_MEMORY(Code.TEMPORARY_ADDRESS));
            CodeGenerator.code.addInstruction(Code.operations.SYSTEM_CALL());
        }
    }
};

// Generates code for a boolean value
CodeGenerator.generateBoolean = function(node, scopeId) {
    LogDisplay.logCodeGeneratorInfoResult(node.model.lineNumber, "Generating", "boolean");
    
    if (node.model.value === 'true') {
        CodeGenerator.code.addInstruction(Code.operations.LOAD_ACCUMULATOR_WITH_CONSTANT("1"));
    } else {
        CodeGenerator.code.addInstruction(Code.operations.LOAD_ACCUMULATOR_WITH_CONSTANT("0"));
    }
    CodeGenerator.code.addInstruction(Code.operations.STORE_ACCUMULATOR_IN_MEMORY(Code.TEMPORARY_ADDRESS));
    CodeGenerator.code.addInstruction(Code.operations.LOAD_X_REGISTER_WITH_CONSTANT("1"));
    CodeGenerator.code.addInstruction(Code.operations.COMPARE_BYTE_IN_MEMORY_TO_X_REGISTER(Code.TEMPORARY_ADDRESS));
    
    LogDisplay.logCodeGeneratorInfoResult(node.model.lineNumber, "Finished", "boolean");
};

// Generates code for equality expressions
CodeGenerator.generateEqualityExpression = function(node, scopeId) {
    LogDisplay.logCodeGeneratorInfoResult(node.model.lineNumber, "Generating", "equality expression");
    
    // For boolean expressions, two types of expressions are unsupported. My compiler
    // doesn't support nested boolean expressions as well as identifier to string
    // comparisons. It does however, support string literal to string literal comparisons 
    // and all other comparisons. 
    if (node.children[0].model.value === "==" || node.children[0].model.value === "!=" || node.children[1].model.value === "==" || node.children[1].model.value === "!=") {
        LogDisplay.logCodeGeneratorErrorResult("Nested Boolean expressions are unsupported");
    } else if (node.children[0].model.value.match(/^"[a-z\s]*"$/g) && node.children[1].model.value.match(/^"[a-z\s]*"$/g)) {
        // This code handles comparing strings... We cheat (or optimize depending on your
        // perspective by utilizing JavaScript to compare the strings
        if (node.children[0].model.value === node.children[1].model.value) {
            CodeGenerator.code.addInstruction(Code.operations.LOAD_ACCUMULATOR_WITH_CONSTANT("1"));
            CodeGenerator.code.addInstruction(Code.operations.LOAD_X_REGISTER_WITH_CONSTANT("1"));
        } else {
            CodeGenerator.code.addInstruction(Code.operations.LOAD_ACCUMULATOR_WITH_CONSTANT("1"));
            CodeGenerator.code.addInstruction(Code.operations.LOAD_X_REGISTER_WITH_CONSTANT("0"));
        }

        CodeGenerator.code.addInstruction(Code.operations.STORE_ACCUMULATOR_IN_MEMORY(Code.TEMPORARY_ADDRESS));
        CodeGenerator.code.addInstruction(Code.operations.COMPARE_BYTE_IN_MEMORY_TO_X_REGISTER(Code.TEMPORARY_ADDRESS));
    } else if (node.children[0].model.value.match(/^"[a-z\s]*"$/g) || node.children[1].model.value.match(/^"[a-z\s]*"$/g)) {
        LogDisplay.logCodeGeneratorErrorResult("Identifier to string comparison is unsupported");
    } else {
        // This code handles all other supported comparisons such as identifier to identifier,
        // integer to integer and so on. The commented code is a poor attempt at handling
        // nested boolean expressions. It failed.
        CodeGenerator.generate(node.children[0], scopeId);
        //    if (node.children[0].model.value === "==" || node.children[0].model.value === "!=") {
        //        CodeGenerator.code.addInstruction(Code.operations.LOAD_ACCUMULATOR_WITH_CONSTANT("0")); 
        //        CodeGenerator.code.addInstruction(Code.operations.BRANCH_IF_Z_FLAG_EQUALS_ZERO("02"));                   
        //        CodeGenerator.code.addInstruction(Code.operations.LOAD_ACCUMULATOR_WITH_CONSTANT("1"));
        //    }
        CodeGenerator.code.addInstruction(Code.operations.STORE_ACCUMULATOR_IN_MEMORY(Code.SECONDARY_TEMPORARY_ADDRESS));
        CodeGenerator.generate(node.children[1], scopeId);
        //    if (node.children[1].model.value === "==" || node.children[1].model.value === "!=") { 
        //        CodeGenerator.code.addInstruction(Code.operations.LOAD_ACCUMULATOR_WITH_CONSTANT("0")); 
        //        CodeGenerator.code.addInstruction(Code.operations.BRANCH_IF_Z_FLAG_EQUALS_ZERO("02"));                   
        //        CodeGenerator.code.addInstruction(Code.operations.LOAD_ACCUMULATOR_WITH_CONSTANT("1"));
        //    }
        CodeGenerator.code.addInstruction(Code.operations.STORE_ACCUMULATOR_IN_MEMORY(Code.TEMPORARY_ADDRESS));
        CodeGenerator.code.addInstruction(Code.operations.LOAD_X_REGISTER_FROM_MEMORY(Code.SECONDARY_TEMPORARY_ADDRESS));
        CodeGenerator.code.addInstruction(Code.operations.COMPARE_BYTE_IN_MEMORY_TO_X_REGISTER(Code.TEMPORARY_ADDRESS));
        CodeGenerator.code.addInstruction(Code.operations.LOAD_ACCUMULATOR_WITH_CONSTANT("0"));
        CodeGenerator.code.addInstruction(Code.operations.BRANCH_IF_Z_FLAG_EQUALS_ZERO("02"));
        CodeGenerator.code.addInstruction(Code.operations.LOAD_ACCUMULATOR_WITH_CONSTANT("1"));
   }
    
    LogDisplay.logCodeGeneratorInfoResult(node.model.lineNumber, "Finished", "equality expression");
};

// Generates code for inequality expressions (we basically negate the equality)
CodeGenerator.generateInequalityExpression = function(node, scopeId) {
    LogDisplay.logCodeGeneratorInfoResult(node.model.lineNumber, "Generatng", "inequality expression");
    
    CodeGenerator.generateEqualityExpression(node, scopeId);
    CodeGenerator.code.addInstruction(Code.operations.LOAD_ACCUMULATOR_WITH_CONSTANT("0"));
    CodeGenerator.code.addInstruction(Code.operations.BRANCH_IF_Z_FLAG_EQUALS_ZERO("02"));
    CodeGenerator.code.addInstruction(Code.operations.LOAD_ACCUMULATOR_WITH_CONSTANT("1"));
    CodeGenerator.code.addInstruction(Code.operations.LOAD_X_REGISTER_WITH_CONSTANT("0"));
    CodeGenerator.code.addInstruction(Code.operations.STORE_ACCUMULATOR_IN_MEMORY(Code.TEMPORARY_ADDRESS));
    CodeGenerator.code.addInstruction(Code.operations.COMPARE_BYTE_IN_MEMORY_TO_X_REGISTER(Code.TEMPORARY_ADDRESS));
    
    LogDisplay.logCodeGeneratorInfoResult(node.model.lineNumber, "Finished", "inequality expression");
};

// Generates code for if statements
CodeGenerator.generateIfStatement = function(node, scopeId) {
    LogDisplay.logCodeGeneratorInfoResult(node.model.lineNumber, "Generating", "if statement");
    
    CodeGenerator.generate(node.children[0], scopeId);
    var address = CodeGenerator.jumpTable.add(CodeGenerator.code.currentAddress);
    CodeGenerator.code.addInstruction(Code.operations.BRANCH_IF_Z_FLAG_EQUALS_ZERO(address));
    CodeGenerator.generate(node.children[1], scopeId);
    CodeGenerator.jumpTable.get(address).endingAddress = CodeGenerator.code.currentAddress;
};

// Generates code for while statements
CodeGenerator.generateWhileStatement = function(node, scopeId) {
    LogDisplay.logCodeGeneratorInfoResult(node.model.lineNumber, "Generating", "while statement");
    
    var address = CodeGenerator.code.currentAddress;
    CodeGenerator.generate(node.children[0], scopeId);
    var temporaryAddress = CodeGenerator.jumpTable.add(CodeGenerator.code.currentAddress);
    CodeGenerator.code.addInstruction(Code.operations.BRANCH_IF_Z_FLAG_EQUALS_ZERO(temporaryAddress));
    CodeGenerator.generate(node.children[1], scopeId);

    CodeGenerator.code.addInstruction(Code.operations.LOAD_ACCUMULATOR_WITH_CONSTANT("0"));
    CodeGenerator.code.addInstruction(Code.operations.STORE_ACCUMULATOR_IN_MEMORY(Code.TEMPORARY_ADDRESS));
    CodeGenerator.code.addInstruction(Code.operations.LOAD_X_REGISTER_WITH_CONSTANT("1"));
    CodeGenerator.code.addInstruction(Code.operations.COMPARE_BYTE_IN_MEMORY_TO_X_REGISTER(Code.TEMPORARY_ADDRESS));

    var jump = Code.formatValue(256 - CodeGenerator.code.currentAddress + address - 2);
    CodeGenerator.code.addInstruction(Code.operations.BRANCH_IF_Z_FLAG_EQUALS_ZERO(jump));

    CodeGenerator.jumpTable.get(temporaryAddress).endingAddress = CodeGenerator.code.currentAddress;
};

// Generates code for string literals
CodeGenerator.generateString = function(node, scopeId) {
    LogDisplay.logCodeGeneratorInfoResult(node.model.lineNumber, "Generating", "string");
    
    var string = node.model.value.substring(1, node.model.value.length - 1);
    var value = parseInt(CodeGenerator.code.addString(string).substring(0, 2), 16);
    CodeGenerator.code.addInstruction(Code.operations.LOAD_ACCUMULATOR_WITH_CONSTANT(value));
    
    LogDisplay.logCodeGeneratorInfoResult(node.model.lineNumber, "Finished", "string");
};