function SymbolTableDisplay() {};

SymbolTableDisplay.display = $("#symbol-table-display table tbody");
SymbolTableDisplay.rowTemplate = "<tr class='text-center'>\
                                      <td><strong class='text-primary'>{0}</strong></td>\
                                      <td><strong class='text-muted'>{1}</storng</td>\
                                      <td><strong class='text-warning'>{2}</span></td>\
                                      <td><strong class='text-danger'>{3}</span></td>\
                                  </tr>";
SymbolTableDisplay.symbols = [];

SymbolTableDisplay.addSymbol = function(scopeLevel, lineDeclared, variable, type)  {
    SymbolTableDisplay.symbols.push(SymbolTableDisplay.rowTemplate.format(scopeLevel, lineDeclared, variable, type));
};

SymbolTableDisplay.clear = function() {
    SymbolTableDisplay.display.empty();
    SymbolTableDisplay.symbols = [];
};

SymbolTableDisplay.populate = function() {
    for (var i = 0; i < SymbolTableDisplay.symbols.length; i++) {
        SymbolTableDisplay.display.append(SymbolTableDisplay.symbols[i]);
    }
};