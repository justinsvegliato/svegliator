function ConcreteSyntaxTree() {
    this.tree = new TreeModel();
    this.id = 0;
};

ConcreteSyntaxTree.prototype.initializeTree = function(root) {
    this.root = this.getObject(root);
    return this.root;
};

ConcreteSyntaxTree.prototype.addNode = function(node, childNode) {
    return node.addChild(this.getObject(childNode));
};

ConcreteSyntaxTree.prototype.getObject = function(node) {
    var object = {
        id: this.id++,
        object: jQuery.extend(true, {}, node)
    };
    return this.tree.parse(object);
};