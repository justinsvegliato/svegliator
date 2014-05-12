/** 
 * A class that displays the concrete syntax tree.
 */

function TreeDisplay() {};

// The DOM element used throughout the code
TreeDisplay.concreteSyntaxTreeDisplay = $("#concreteSyntaxTree");
TreeDisplay.abstractSyntaxTreeDisplay = $("#abstractSyntaxTree");
TreeDisplay.symbolTreeDisplay = $("#symbol-tree-display");

// HTML templates that will be displayed on the screen
TreeDisplay.nonterminalTemplate = "<strong class='text-danger'>{0}</strong>";
TreeDisplay.terminalTemplate = "<strong class='text-success'><em>{0}</em></strong>";
TreeDisplay.scopeTemplate = "<strong class='text-info'>Scope [ <span class='text-muted'>{0}</span> ]</strong>";
TreeDisplay.variableTemplate = "<strong class='text-success'><span class='text-danger'>{0}</span> <span class='text-warning'>{1}</span></strong>";

TreeDisplay.symbolTreeJson = [];

// Populates the trees associated with the abstract or concrete syntax tree
TreeDisplay.populateSyntaxTrees = function(concreteSyntaxTree, abstractSyntaxTree) {
    TreeDisplay.populateAndGenerateTree(concreteSyntaxTree, TreeDisplay.concreteSyntaxTreeDisplay);
    TreeDisplay.populateAndGenerateTree(abstractSyntaxTree, TreeDisplay.abstractSyntaxTreeDisplay);
};

// Populates tree associated with the symbol table
TreeDisplay.populateSymbolTree = function(symbolTree) {
    TreeDisplay.generateTree(TreeDisplay.symbolTreeDisplay);
};

// Populates the tree display by using the jsTree framework
TreeDisplay.populateAndGenerateTree = function(tree, element) {
    // Empties out any previous results
    element.empty();

    // Creates the json that will be pushed to the tree generation framework
    var json = [];
    tree.root.walk({
        strategy: 'breadth'
    }, function(node) {
        // Retrieves the information necessary for the JSON element
        var id = node["model"].id.toString();
        var parentId = ("parent" in node) ? node.parent.model.id.toString() : "#";
        var text = node["model"]["value"];

        // Use the terminal template if the node is a 
        // terminal, otherwise use the nonterminal template
        if (node.children.length <= 0) {
            text = TreeDisplay.terminalTemplate.format(text);
        } else {
            text = TreeDisplay.nonterminalTemplate.format(text);
        }

        // Pushes the above data to the JSON element to be displayed
        json.push({
            "id": id,
            "icon": false,
            "parent": parentId,
            "text": text,
            state: {
                opened: true
            }
        });
    });

    // Displays the tree onto the screen
    element.jstree({
        'core': {
            'data': json,
            "themes": {
                "stripes": true
            }

        }
    });
};

// Registers scope to the symbol tree
TreeDisplay.addScope = function(scope) {
    // Pushes the node representing scope onto array
    var parentId = (scope.model.scopeId !== 1) ? scope.parent.model.scopeId.toString() : "#";
    TreeDisplay.symbolTreeJson.push({
        "id": scope.model.scopeId.toString(),
        "icon": false,
        "parent": parentId,
        "text": TreeDisplay.scopeTemplate.format(scope.model.scopeId - 1),
        state: {
            opened: true
        }
    }); 
};

// Add a symbol to the given scope
TreeDisplay.addSymbol = function(scope, variable, type) {       
        // Pushes the above data to the JSON element to be displayed
        TreeDisplay.symbolTreeJson.push({
            "id": scope.model.scopeId + "-" + variable,
            "icon": false,
            "parent": scope.model.scopeId.toString(),
            "text": TreeDisplay.variableTemplate.format(type, variable),
            state: {
                opened: true
            }
        });
};
 
// Populates the scope symbol display by using the jsTree framework
TreeDisplay.generateTree = function(element) {
    // Empties out any previous results
    element.empty();

    // Displays the tree onto the screen
    element.jstree({
        'core': {
            'data': TreeDisplay.symbolTreeJson,
            "themes": {
                "stripes": true
            }

        }
    });
};


// Clears the tree replacing it with filler text
TreeDisplay.clear = function() {
    var regex = new RegExp('\\b' + 'jstree-' + '.+?\\b', 'g');
    TreeDisplay.concreteSyntaxTreeDisplay.removeClass("jstree jstree-default jstree-default-responsive").removeAttr('role');
    TreeDisplay.concreteSyntaxTreeDisplay[0].className = TreeDisplay.concreteSyntaxTreeDisplay[0].className.replace(regex, '');
    TreeDisplay.concreteSyntaxTreeDisplay[0].className = TreeDisplay.concreteSyntaxTreeDisplay[0].className.replace(/\s+/, ' ');
    TreeDisplay.concreteSyntaxTreeDisplay.html('<h6 class="lead text-center">No concrete syntax tree</h6>');
    TreeDisplay.concreteSyntaxTreeDisplay.empty();

    TreeDisplay.abstractSyntaxTreeDisplay.removeClass("jstree jstree-default jstree-default-responsive").removeAttr('role');
    TreeDisplay.abstractSyntaxTreeDisplay[0].className = TreeDisplay.abstractSyntaxTreeDisplay[0].className.replace(regex, '');
    TreeDisplay.abstractSyntaxTreeDisplay[0].className = TreeDisplay.abstractSyntaxTreeDisplay[0].className.replace(/\s+/, ' ');
    TreeDisplay.abstractSyntaxTreeDisplay.html('<h6 class="lead text-center">No abstract syntax tree</h6>');
    TreeDisplay.abstractSyntaxTreeDisplay.empty();
    
    TreeDisplay.symbolTreeDisplay.removeClass("jstree jstree-default jstree-default-responsive").removeAttr('role');
    TreeDisplay.symbolTreeDisplay[0].className = TreeDisplay.symbolTreeDisplay[0].className.replace(regex, '');
    TreeDisplay.symbolTreeDisplay[0].className = TreeDisplay.symbolTreeDisplay[0].className.replace(/\s+/, ' ');
    TreeDisplay.symbolTreeDisplay.html('<h6 class="lead text-center">No symbol tree</h6>');    
    TreeDisplay.symbolTreeJson = [];
};