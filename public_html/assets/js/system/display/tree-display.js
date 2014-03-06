/** 
 * A class that displays the concrete syntax tree.
 */

function TreeDisplay() {};

// The DOM element used throughout the code
TreeDisplay.display = $("#tree-display");

// HTML templates that will be displayed on the screen
TreeDisplay.nonterminalTemplate = "<strong class='text-danger'>{0}</strong>";
TreeDisplay.terminalTemplate = "<strong class='text-success'><em>{0}</em></strong>";

// Populates the tree display by using the jsTree
TreeDisplay.populate = function(tree) {
    // Empties out any previous results
    TreeDisplay.display.empty();
    
    // Creates the json that will be pushed to the tree generation framework
    var json = [];
    tree.root.walk({
        strategy: 'breadth'
    }, function(node) {
        // Retrieves the information necessary for the JSON element
        var id = node["model"].id.toString();
        var parentId = ("parent" in node) ? node.parent.model.id.toString() : "#";
        var text = node["model"]["object"].value;

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
    TreeDisplay.display.jstree({
        'core': {
            'data': json,
            "themes": {
                "stripes": true
            }

        }
    });
};

// Clears the tree replacing it with filler text
TreeDisplay.clear = function() {
    TreeDisplay.display.removeClass().removeAttr('role');;
    TreeDisplay.display.html('<h6 class="lead text-center">No concrete syntax tree</h6>');
};