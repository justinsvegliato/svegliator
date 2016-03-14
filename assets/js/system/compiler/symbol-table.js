/** 
 * A class that contains all information regarding the symbols found during the parsing phase.
 */

// Initializes the symbol table
function SymbolTable() {
    this.scopeId = 0;
    this.tree = new TreeModel();

    // Sets the current scope to 0
    this.currentScope = this.tree.parse(new Scope(this.scopeId));
    this.root = this.currentScope;
};

// Adds a symbol to the symbol table given a type, variable, and line number.
SymbolTable.prototype.addSymbol = function(type, variable, lineDeclared) {
    // Only add the symbol to the table if it does not yet exist
    if (!(variable in this.currentScope.model.variables)) {
        // Displays the symbol
        SymbolTableDisplay.addSymbol(this.currentScope.model.scopeId - 1, lineDeclared, variable, type);
        TreeDisplay.addSymbol(this.currentScope, variable, type);

        // Creates the symbol and adds it to the current scope
        var symbol = new Symbol(type, variable, lineDeclared, this.currentScope.model.scopeId);
        this.currentScope.model.variables[variable] = symbol;
        return symbol;
    }
    return false;
};

// Enters a new scope (this is denoted by '{')
SymbolTable.prototype.enterScope = function() {
    // Create a new scope
    var scope = this.tree.parse(new Scope(++this.scopeId));

    // Make this scope a child of the current scope
    this.currentScope.addChild(scope);
    
    // Registers the new scope in the tree display    
    TreeDisplay.addScope(scope);

    // Set this new scope as the current scope
    this.currentScope = scope;  
};

// Exists the current scope (this is denoted by '}')
SymbolTable.prototype.exitScope = function() {
    // Set the current scope to the parent scope
    this.currentScope = this.currentScope.parent;
};

// Checks if the specified identifier is in the current scope
SymbolTable.prototype.checkScope = function(identifier) {
    return this.getVariableData(identifier, this.currentScope);
};

// Gets the scope at the specified id
SymbolTable.prototype.getScope = function(scopeId) {
    return this.currentScope.first(function(node) {
        return node.model.scopeId === scopeId;
        
        
    });
};

// Retrieves the scope which contains this identifier
SymbolTable.prototype.getDeclarationScopeLevel = function(identifier, currentScopeId) {    
    var getScope = function(scope) {
        if (identifier in scope.model.variables) {
            return scope.model.scopeId;
        } else {
            return getScope(scope.parent);
        }    
    };
    
    var scope = this.getScope(currentScopeId);    

    return getScope(scope);
};

// Checks if every variable has been initialized or used (it outputs an error otherwise)
SymbolTable.prototype.check = function() {
    this.currentScope.walk(function (node) {
        for (var key in node.model.variables) {
            var variable = node.model.variables[key];
            if (!variable.isUsed) {
                LogDisplay.logSemanticAnalyzerWarningResult(variable.lineNumber, "Variable is not used", variable.variable);
            } else if (variable.isUsed && !variable.isInitilized) {
                LogDisplay.logSemanticAnalyzerWarningResult(variable.lineNumber, "Variable is not initialized", variable.variable);
            }
        }
    });
};

// Retrieves the data associated with the specified identifier at this given scope
// or perhaps the ancestors of the specified scope
SymbolTable.prototype.getVariableData = function(identifier, scope) {    
    if (identifier in scope.model.variables) {
        return scope.model.variables[identifier];
    } else {
        if (!("parent" in scope)) {
            return false;
        }
        return this.getVariableData(identifier, scope.parent);
    }       
};

// Creates a class containing all information for symbols
function Symbol(type, variable, lineNumber, scopeId) {
    this.type = type;
    this.variable = variable;
    this.lineNumber = lineNumber;
    this.isUsed = false;
    this.isInitilized = false;
    this.scopeId = scopeId;
};

// Creates a class containing all information for scopes
function Scope(scopeId) {
    this.scopeId = scopeId;
    this.variables = {};
};