/** 
 * A class that represents the concrete syntax tree
 */

// Creates the concrete syntax tree
function ConcreteSyntaxTree() {
    this.tree = new TreeModel();
    this.id = 0;
};

// Intializes the concrete syntax tree by establishing a root node
ConcreteSyntaxTree.prototype.initializeTree = function(root) {
    this.root = this.getObject(root, 0);
    return this.root;
};

// Adds the specified childNode to the specified parentNode
ConcreteSyntaxTree.prototype.addNode = function(node, childNode, lineNumber) {
    return node.addChild(this.getObject(childNode, lineNumber));
};

// Creates an object that tree-model.js can use
ConcreteSyntaxTree.prototype.getObject = function(node, lineNumber) {
    var object = {
        id: this.id++,
        value: node.value,
        lineNumber: lineNumber
    };
    return this.tree.parse(object);
};