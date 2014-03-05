function SymbolTable() {};

SymbolTable.scopes = [];

SymbolTable.addSymbol = function(type, variable, scopeLevel, lineDeclared) {
    if (scopeLevel < SymbolTable.scopes.length) {
        var scope = SymbolTable.scopes[scopeLevel];
        if (!(variable in scope)) {
            scope[variable] = new Symbol(type, variable, 0);
            SymbolTableDisplay.addSymbol(scopeLevel, lineDeclared, variable, type);
            return true;
        }           
        return false;
    }
    return false;
};

SymbolTable.addScope = function() {
    SymbolTable.scopes.push({});
};

SymbolTable.clear = function() {
    SymbolTable.scopes = [];
    SymbolTableDisplay.clear();
};

function Symbol(type, variable, value) {
    this.type = type;
    this.variable = variable;
    this.value = value;    
};