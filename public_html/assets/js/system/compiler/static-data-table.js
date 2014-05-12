/** 
 * A class that contains data associated with variables
 */

function StaticDataTable() {
    this.currentAddress = 0;
    this.offset = 0;
    this.variables = {};
};

// Adds a variable to the static data table
StaticDataTable.prototype.add = function(node, scopeLevelId) {
    var adjustedAddress = 'T' + pad(this.currentAddress++, 3, '0');
    this.variables[this.getKey(node, scopeLevelId)] = new IdentifierVariable(adjustedAddress, this.offset++);
    return adjustedAddress;
};

// Gets a variable from the static data table
StaticDataTable.prototype.get = function(node, scopeLevelId) {
    var identifier = this.variables[this.getKey(node, scopeLevelId)];
    
    if (!identifier) {
        var parentScopeLevel = SemanticAnalyzer.symbolTable.getScope(scopeLevelId).parent.model.scopeId;
        identifier = this.variables[node.model.value + "@" + parentScopeLevel];
    }
    
    return identifier.address;
};

// Generates the key for a given variable
StaticDataTable.prototype.getKey = function(node, scopeLevelId) {
    var scopeLevel = SemanticAnalyzer.symbolTable.getDeclarationScopeLevel(node.model.value, scopeLevelId);
    var key = node.model.value + "@" + scopeLevel;
    return key;
};

/** 
 * A class that contains data associated with an identifier
 */

function IdentifierVariable(address, offset) {
    this.address = address;
    this.offset = offset;
};