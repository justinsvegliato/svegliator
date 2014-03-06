/** 
 * A class that representes the concrete syntax tree
 */

// Creates the concrete syntax tree
function ConcreteSyntaxTree() {
    this.tree = new TreeModel();
    this.id = 0;
};

// Intializes the concrete syntax tree by establishing a root node
ConcreteSyntaxTree.prototype.initializeTree = function(root) {
    this.root = this.getObject(root);
    return this.root;
};

// Adds the specified childNode to the specified parentNode
ConcreteSyntaxTree.prototype.addNode = function(node, childNode) {
    return node.addChild(this.getObject(childNode));
};

// Creates an object that tree-model.js can use
ConcreteSyntaxTree.prototype.getObject = function(node) {
    var object = {
        id: this.id++,
        object: jQuery.extend(true, {}, node)
    };
    return this.tree.parse(object);
};