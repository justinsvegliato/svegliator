function SymbolTable() {
    this.scopeLevelId = 0;
    this.tree = new TreeModel();
    this.currentScope = this.tree.parse(new Scope(this.scopeLevelId));
};

SymbolTable.prototype.addSymbol = function(type, variable, lineDeclared) {
    if (!(variable in this.currentScope.model.variables)) {
        var symbol = new Symbol(type, variable, 0);
        this.currentScope.model.variables[variable] = symbol;
        SymbolTableDisplay.addSymbol(this.currentScope.model.level, lineDeclared, variable, type);
        return symbol;
    }           
    return false;
};

SymbolTable.prototype.enterScope = function() {
    var scope = this.tree.parse(new Scope(this.scopeLevelId++));
    this.currentScope.addChild(scope);
    this.currentScope = scope;
};

SymbolTable.prototype.exitScope = function() {
    this.currentScope = this.currentScope.parent;
};

function Symbol(type, variable, value) {
    this.type = type;
    this.variable = variable;
    this.value = value;    
};

function Scope(level) {
    this.level = level;
    this.variables = {};
};