/** 
 * A class that contains all information regarding the symbols found during the parsing phase.
 */

// Initializes the symbol table
function SymbolTable() {
    this.scopeLevelId = 0;
    this.tree = new TreeModel();
    
    // Sets the current scope to 0
    this.currentScope = this.tree.parse(new Scope(this.scopeLevelId));
};

// Adds a symbol to the symbol table given a type, variable, and line number.
SymbolTable.prototype.addSymbol = function(type, variable, lineDeclared) {
    // Only add the symbol to the table if it does not yet exist
    if (!(variable in this.currentScope.model.variables)) {
        // Displays the symbol
        SymbolTableDisplay.addSymbol(this.currentScope.model.level, lineDeclared, variable, type);
        
        // Creates the symbol and adds it to the current scope
        var symbol = new Symbol(type, variable, 0);
        this.currentScope.model.variables[variable] = symbol;
        return symbol;
    }           
    return false;
};

// Enters a new scope (this is denoted by '{')
SymbolTable.prototype.enterScope = function() {
    // Create a new scope
    var scope = this.tree.parse(new Scope(this.scopeLevelId++));
    
    // Make this scope a child of the current scope
    this.currentScope.addChild(scope);
    
    // Set this new scope as the current scope
    this.currentScope = scope;
};

// Exists the current scope (this is denoted by '}')
SymbolTable.prototype.exitScope = function() {
    // Set the current scope to the parent scope
    this.currentScope = this.currentScope.parent;
};

// Creates a class containing all information for symbols
function Symbol(type, variable, value) {
    this.type = type;
    this.variable = variable;
    this.value = value;    
};

// Creates a class containing all information for scopes
function Scope(level) {
    this.level = level;
    this.variables = {};
};