/** 
 * A class that displays the symbol table.
 */

function SymbolTableDisplay() {};

// The HTML elements that will be displayed to the screen
SymbolTableDisplay.display = $("#symbol-table-display table tbody");
SymbolTableDisplay.rowTemplate = "<tr class='text-center'>\
                                      <td><strong class='text-primary'>{0}</strong></td>\
                                      <td><strong class='text-muted'>{1}</storng</td>\
                                      <td><strong class='text-warning'>{2}</span></td>\
                                      <td><strong class='text-danger'>{3}</span></td>\
                                  </tr>";

// The symbols that will be displayed
SymbolTableDisplay.symbols = [];


// Adds a symbol to the display
SymbolTableDisplay.addSymbol = function(scopeLevel, lineDeclared, variable, type)  {
    SymbolTableDisplay.symbols.push(SymbolTableDisplay.rowTemplate.format(scopeLevel, lineDeclared, variable, type));
};

// Clears old data
SymbolTableDisplay.clear = function() {
    SymbolTableDisplay.display.html('<tr><td class="lead text-center" colspan="4">No symbols</td></tr>');
    SymbolTableDisplay.symbols = [];
};

// Populates the display with all symbols
SymbolTableDisplay.populate = function() {    
    SymbolTableDisplay.display.empty();
    for (var i = 0; i < SymbolTableDisplay.symbols.length; i++) {
        SymbolTableDisplay.display.append(SymbolTableDisplay.symbols[i]);
    }
};