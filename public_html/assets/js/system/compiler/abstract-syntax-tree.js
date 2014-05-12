/** 
 * A class that represents the abstract syntax tree
 */

// Creates the abstract syntax tree
function AbstractSyntaxTree(concreteSyntaxTree) {
    this.id = 0;
    this.tree = new TreeModel();
    this.root = this.getObject(Nonterminal.Kind.TEMPORARY.value, 1);
    this.convert(this.root, concreteSyntaxTree.root);
};

// Converts the given tree to an abstract tree
AbstractSyntaxTree.prototype.convert = function(root, node) {
    if (node === null) {
        return false;
    }
    
    // Recognize and convert tree patterns
    var newRoot = null;
    if (node.model.value === Nonterminal.Kind.BLOCK.value) {
        newRoot = this.addNode(root, node, "{}");
    } else if (node.model.value === Nonterminal.Kind.ASSIGNMENT_STATEMENT.value) {
        newRoot = this.addNode(root, node, "=");
    } else if (node.model.value === Nonterminal.Kind.PRINT_STATEMENT.value) {
        newRoot = this.addNode(root, node, "print");
    } else if (node.model.value === Nonterminal.Kind.VAR_DECL.value) {
        newRoot = this.addNode(root, node, Nonterminal.Kind.VAR_DECL.value);
    } else if (node.model.value === Nonterminal.Kind.WHILE_STATEMENT.value) {
        newRoot = this.addNode(root, node, "while");
    } else if (node.model.value === Nonterminal.Kind.IF_STATEMENT.value) {
        newRoot = this.addNode(root, node, "if");
    } else if (node.model.value === Nonterminal.Kind.INT_EXPR.value) {
        // If the length is 1, then the int expression is equal to a digit; otherwise, the 
        // int expression is an addition expression
        if (node.children.length === 1) {
            this.addNode(root, node, node.children[0].children[0].model.value);
        } else {
            newRoot = this.addNode(root, node, "+");
            this.addNode(newRoot, node, node.children[0].children[0].model.value);
            newRoot = this.addNode(newRoot, node, Nonterminal.Kind.TEMPORARY.value);
        }
    } else if (node.model.value === Nonterminal.Kind.STRING_EXPR.value) {
        this.addNode(root, node, "\"" + node.children[1].model.value + "\"");
    } else if (node.model.value === Nonterminal.Kind.BOOLEAN_EXPR.value) {
        // If the length is 1, then the boolean expression is equal to a boolean value; 
        // otherwise, the boolean expression is boolean expression
        if (node.children.length === 1) {
            this.addNode(root, node, node.children[0].children[0].model.value);
        } else {
            newRoot = this.addNode(root, node, node.children[2].children[0].model.value);
        }
    } else if (node.model.value === Nonterminal.Kind.ID.value) {
        this.addNode(root, node, node.children[0].children[0].model.value);
    } else if (node.model.value === Nonterminal.Kind.TYPE.value) {
        this.addNode(root, node, node.children[0].model.value);
    }

    if (newRoot === null) {
        newRoot = root;
    }

    // Iterates and converts each child node
    for (var i = 0; i < node.children.length; i++) {
        this.convert(newRoot, node.children[i]);
    }
};

// Adds the specified childNode to the specified root
AbstractSyntaxTree.prototype.addNode = function(root, node, alias) {
    if (root.model.value !== Nonterminal.Kind.TEMPORARY.value) {
        return root.addChild(this.getObject(alias, node.model.lineNumber));
    } else {
        root.model.value = alias;
        return root;
    }
};

// Creates an object that tree-model.js can use
AbstractSyntaxTree.prototype.getObject = function(alias, lineNumber) {
    var object = {
        id: this.id++,
        value: alias,
        lineNumber: lineNumber,
        scope: null
    };
    return this.tree.parse(object);
};