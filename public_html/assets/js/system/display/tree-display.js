function TreeDisplay() {};

TreeDisplay.display = $("#tree-display");
TreeDisplay.nonterminalTemplate = "<strong class='text-danger'>{0}</strong>";
TreeDisplay.terminalTemplate = "<strong class='text-success'><em>{0}</em></strong>";

TreeDisplay.populate = function(tree) {
    TreeDisplay.display.empty();
    
    var json = [];
    tree.root.walk({
        strategy: 'breadth'
    }, function(node) {
        var id = node["model"].id.toString();
        var parentId = ("parent" in node) ? node.parent.model.id.toString() : "#";
        var text = node["model"]["object"].value;

        if (node.children.length <= 0) {
            text = TreeDisplay.terminalTemplate.format(text);
        } else {
            text = TreeDisplay.nonterminalTemplate.format(text);
        }

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

    TreeDisplay.display.jstree({
        'core': {
            'data': json,
            "themes": {
                "stripes": true
            }

        }
    });
};

TreeDisplay.clear = function() {
    TreeDisplay.display.removeClass().removeAttr('role');;
    TreeDisplay.display.html('<h6 class="lead text-center">No concrete syntax tree</h6>');
};